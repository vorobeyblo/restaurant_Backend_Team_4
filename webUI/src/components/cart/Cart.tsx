import "./cart.scss";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { CartItem } from "../cartItem/cartItem";
import { useEffect, useState, MouseEvent } from "react";
import { ICartItem } from "../../store/cart/cart.types";
import axios, { AxiosResponse } from "axios";
import { Takeaway } from "../takeaway/Takeaway";
import {
  DishShortInfo,
  Order,
  DELIVERY_METHOD,
} from "../../store/order/order.types";
import TakeawayIcon from "../../assets/take-away.svg";
import DeliveryIcon from "../../assets/truck.svg";
import BookTableIcon from "../../assets/table.svg";
import {
  clearCart,
  omitIngredient,
  pickIngredient,
} from "../../store/cart/cart.actions";
import emptyCart from "../../assets/empty-cart.png";
import { Link } from "react-router-dom";
import { Delivery } from "../delivery/Delivery";
import {
  changeDeliveryMethod,
  changeTotalPrice,
} from "../../store/order/order.actions";
import { BookTable } from "../bookTable/BookTable";
import Modal from "../common/modal/Modal";
import { useHistory } from "react-router-dom";
import Api from "../../store/Api";

export interface OrderTemp extends Order {
  reserve_time: Date;
  reserve_date: Date;
}

export const Cart = () => {
  const items = useAppSelector((state) => state.cartItems.items);
  const userId = useAppSelector((state) => state.auth?.user?.attributes?.sub);
  const totalPrice = items.reduce((acc, el) => acc + el.price * el.amount, 0);

  const order = useAppSelector((state) => state.order.order);
  const dispatch = useAppDispatch();

  let history = useHistory();

  const [selectedDish, setSelectedDish] = useState(0);

 // const dishItem = items.find((i) => i.id === selectedDish);
  const dishItem = items[selectedDish];

  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  const editIngredients = (
    e: React.ChangeEvent<HTMLInputElement>,
    selectedDish: number,
    id: number
  ) => {
    !e.target.checked
      ? dispatch(omitIngredient(id, selectedDish, e.target.value))
      : dispatch(pickIngredient(id, selectedDish, e.target.value));
  };

  const checkOrder = (order: Order) =>
    order.adress &&
    order.comment &&
    order.contact_name &&
    order.contact_phone &&
    order.customer_id &&
    order.customer_id &&
    order.delivery_date &&
    order.delivery_method &&
    order.dish.length !== 0 &&
    order.payment_method >= 0 &&
    order.payment_method < 3 &&
    order.total_price;

  const onMakingOrder = () => {
    let currentOrder = {} as OrderTemp;

    currentOrder.delivery_method = order.delivery_method;
    currentOrder.payment_method = order.payment_method;
    currentOrder.customer_id = userId;
    currentOrder.total_price = totalPrice;
    currentOrder.delivery_date = order.delivery_date;
    currentOrder.comment = "Hi, I'm hardcode comment :)";

    let dishesShortInfo = items.map((item) => {
      let dish = {} as DishShortInfo;
      dish.dish_id = item.id;
      dish.dish_amount = item.amount;
      dish.excluded_ingredients = item.excluded_ingredients
        ? item.excluded_ingredients.join(", ")
        : "";
      return dish;
    });

    currentOrder.dish = dishesShortInfo;
    currentOrder.contact_name = order.contact_name;
    currentOrder.contact_phone = order.contact_phone;

    if (currentOrder.delivery_method === "takeaway") {
      currentOrder.adress = "takeaway";
    }

    if (currentOrder.delivery_method === "bookTable") {
      currentOrder.adress = "bookTable";
      currentOrder.num_of_persons = order.num_of_persons;
      currentOrder.reserve_date = order.delivery_date;
      currentOrder.reserve_time = order.delivery_date;

      return Api.post(`${process.env.REACT_APP_GET_DISHES}/api/reserve`, currentOrder, {
          headers: {
            "Content-type": "application/json",
            "cross-domain": "true",
          },
        })
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
    }

    if (currentOrder.delivery_method === "delivery") {
      currentOrder.adress = order.adress;
    }

    return Api.post(`${process.env.REACT_APP_GET_DISHES}/api/order`, currentOrder, {
        headers: {
          "Content-type": "application/json",
          "cross-domain": "true",
        },
      })
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };

  const [orderType, setOrderType] = useState(order.delivery_method);

  // useEffect(() => {
  //   dispatch(changeDeliveryMethod(""));
  //   dispatch(clearOrder());
  // }, []);

  const combineOrder = async (total: number) => {
    dispatch(changeTotalPrice(total));
    console.log("The order was updated");
  };
  const clearFullCart = async () => {
    console.log("Order done");
    dispatch(clearCart());
  };

  const onChangeTab = (orderType: DELIVERY_METHOD) => {
    dispatch(changeDeliveryMethod(orderType));
    setOrderType(orderType);
  };

  return (
    <>
      {items.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart__container empty-cart__container--small">
            <div className="cart-body">
              <div className="empty-cart__img">
                <img src={emptyCart} alt="empty-cart-img" />
              </div>
              <div className="empty-cart__title">Ваша корзина пуста</div>
              <div className="empty-cart__text">
                Похоже, вы пока ничего не добавили в корзину
              </div>
              <Link to="/menu" className="empty-cart__menu-link">
                Перейти в меню
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="full-cart">
          <div className="cart_order_container">
            <div className="cart_order">
              <h1>Ваш заказ</h1>
            </div>
            <button className="clear-button" onClick={clearFullCart}>
              Очистить корзину
            </button>
            {items.map((item: ICartItem, index) => (
              <CartItem
                key={index}
                idx={index}
                toggleModal={toggleModal}
                item={item}
                setSelectedDish={setSelectedDish}
              />
            ))}
            <div className="total-price">
              <div>Итого:</div>
              <div className="total-price__number"> {totalPrice} BYN</div>
            </div>
          </div>

          <div className="order_actions">
            <h1 className="actions__title">Тип заказа:</h1>
            <div className="order_buttons">
              <button
                className={
                  orderType === "bookTable" ? "order_button_pushed" : undefined
                }
                type="button"
                onClick={() => onChangeTab(DELIVERY_METHOD.bookTable)}
              >
                <img src={BookTableIcon} alt="bookTable" />
                <p className="actions-button__desctiption">
                  Забронировать стол
                </p>
              </button>
              <button
                className={
                  orderType === "delivery" ? "order_button_pushed" : undefined
                }
                type="button"
                onClick={() => onChangeTab(DELIVERY_METHOD.delivery)}
              >
                <img src={DeliveryIcon} alt="delivery" />
                <p className="actions-button__desctiption">Доставка</p>
              </button>
              <button
                className={
                  orderType === "takeaway" ? "order_button_pushed" : undefined
                }
                type="button"
                onClick={() => onChangeTab(DELIVERY_METHOD.takeaway)}
              >
                <img src={TakeawayIcon} alt="takeaway" />
                <p className="actions-button__desctiption">Самовывоз</p>
              </button>
            </div>
            <div className="selected-actions">
              {orderType === "bookTable" ? (
                <BookTable total={totalPrice} combineOrder={combineOrder} />
              ) : orderType === "delivery" ? (
                <Delivery total={totalPrice} combineOrder={combineOrder} />
              ) : orderType === "takeaway" ? (
                <Takeaway total={totalPrice} combineOrder={combineOrder} />
              ) : (
                <div></div>
              )}
            </div>
            <div className="make_order"></div>
          </div>

          <Modal
            active={showModal}
            setActive={toggleModal}
            title={"Изменить состав"}
          >
            <div className="dish-modal-title">{dishItem && dishItem.title}</div>
            <div className="ingredients-form">
              <div className="ingredients-list">
                {dishItem &&
                  dishItem.ingredient.map((i) => (
                    <div className="ingredient-item" key={i.id}>
                      <label>
                        {i.DishIngredient.is_default ? (
                          <input
                            type="checkbox"
                            className="ingredient-checkbox"
                            checked
                            disabled
                          />
                        ) : (
                          <input
                            type="checkbox"
                            className="ingredient-checkbox"
                            onChange={(e) => editIngredients(e, selectedDish, dishItem.id)}
                            checked={
                              !dishItem.excluded_ingredients.includes(i.title) 
                            }
                            value={i.title}
                          />
                        )}{" "}
                        {i.title}
                      </label>
                    </div>
                  ))}
              </div>
              <div className="button-container">
                <button onClick={toggleModal} className="ingredients-edit__btn">
                  Готово
                </button>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
};
