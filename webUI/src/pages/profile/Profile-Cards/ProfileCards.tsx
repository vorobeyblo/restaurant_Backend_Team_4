import "./ProfileCards.scss";
import {Button} from "../../../components/common/button/Button";
import {useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {Redirect} from "react-router-dom";
import {Auth} from "aws-amplify";
import CardsModal from "./CardsModal";
import visaImg from '../../../assets/ProfileCards/VISA.png';
import mastercardImg from '../../../assets/ProfileCards/mastercard.png';

type cardType = {
    cardName: string,
    cardValidity: string,
    cardCVV: string,
    cardNumber: string,
}

function ProfileCards() {
    const user = useAppSelector(state => state.auth.user);
    let cardData: any;
    try {
        cardData = JSON.parse(user.attributes["custom:card_number"]);
    } catch (err) {
        cardData = {};
    }
    // const cardData = JSON.parse(user.attributes["custom:card_number"]);
    const cardDataArray: Array<cardType> = Object.values(cardData);
    const dispatch = useAppDispatch();

    const [editMode, setEditMode] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false)

    const onToggleHandler = () => {
        if (editMode) {
            setEditMode(false);
        } else {
            setEditMode(true);
        }
    }
    const showModalHandler = () => {
        setShowModal(true);
    }
    const hideModalHandler = () => {
        setShowModal(false);
    }

    const deleteCardHandler = async (cardNumber: any) => {
        delete cardData[cardNumber];
        try {
            if (user) {
                await Auth.updateUserAttributes(user, {["custom:card_number"]: JSON.stringify(cardData)});
                const updatedUser = await Auth.currentAuthenticatedUser();
                dispatch(
                    {
                        type: "UPDATE_USER_ATTR",
                        payload: updatedUser,
                    }
                )
            }
        } catch (err) {
            console.log(err)
        }
    }

    if (!user) {
        return <Redirect to="/login"/>
    }

    return <>
        <>
            {showModal && <CardsModal onHideModal={hideModalHandler}/>}
            <div className={"profileCards"}>
                {cardDataArray.length > 0?
                    <ul className={"profileCards__list"}>
                        {cardDataArray.map(card => {
                            return <li className={"profileCards__item"} key={card.cardNumber}>
                                <div className={"profileCards__image"}>
                                    <img src={+card.cardNumber[0] === 4 ? visaImg : mastercardImg}
                                         alt={+card.cardNumber[0] === 4 ? "VISA" : "MASTERCARD"}/>
                                </div>
                                <div className="profileCards__info">
                                    <div>**** **** **** {card.cardNumber.slice(-4)}</div>
                                    <div>{card.cardValidity}</div>
                                    <div>{card.cardName}</div>
                                </div>
                                {editMode && <button className="profileCards__deleteBtn" type="button" onClick={() => {
                                    deleteCardHandler(card.cardNumber)
                                }}>Удалить</button>}
                            </li>;
                        })}
                    </ul> :
                    <p className="profileCards__text">Похоже, вы пока не добавили карту</p>
                }
                <div className="profileCards__controls">
                    <Button type={"button"} onClick={onToggleHandler}>{editMode ? "Готово" : "Изменить"}</Button>
                    {editMode && <Button type="button" onClick={showModalHandler}>Добавить карту</Button>}
                </div>
            </div>
        </>
    </>
}

export default ProfileCards;