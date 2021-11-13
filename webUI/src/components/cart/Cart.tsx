import "./cart.scss";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { CartItem } from "../cartItem/cartItem";
import { useEffect, useState } from "react";
import { ICartItem } from "../../store/cart/cart.types";
import { Button } from "../common/button/Button";
import axios, { AxiosResponse } from "axios";
import { Takeaway } from "../takeaway/Takeaway";
import {
  DishShortInfo,
  Order,
  OrderConstants,
} from "../../store/order/order.types";
import TakeawayIcon from "../../assets/takeaway.png";
import DeliveryIcon from "../../assets/delivery.png";
import BookTableIcon from "../../assets/book-table.png";
import { clearCart } from "../../store/cart/cart.actions";
import emptyCart from "../../assets/empty-cart.png";
import { Link } from "react-router-dom";
import { Delivery } from "../delivery/Delivery";
import {
  changeDeliveryMethod,
  clearOrder,
} from "../../store/order/order.actions";
import { BookTable } from "../bookTable/BookTable";

export const Cart = () => {
  const items = useAppSelector((state) => state.cartItems.items);
  const userId = useAppSelector((state) => state.auth?.user?.attributes?.sub);
  const totalPrice = items.reduce((acc, el) => acc + el.price * el.amount, 0);
  const order = useAppSelector((state) => state.order.order);
  const dispatch = useAppDispatch();

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
    let currentOrder = {} as Order;

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

      return axios
        .post(`http://localhost:5001/api/order`, currentOrder, {
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

    console.log(currentOrder);

    return axios
      .post(`${process.env.REACT_APP_GET_DISHES}/api/order`, currentOrder, {
        headers: {
          "Content-type": "application/json",
          "cross-domain": "true",
        },
      })
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };

  const handleOnMakingOrder = async () => {
    await onMakingOrder();
    console.log("Order done");
    dispatch(clearCart());
  };

  const [orderType, setOrderType] = useState("");

  useEffect(() => {
    dispatch(changeDeliveryMethod(""));
    dispatch(clearOrder());
  }, []);

  const clearFullCart = async () => {
    console.log("Order done");
    dispatch(clearCart());
  };

  const onChangeTab = (e: any) => {
    dispatch(clearOrder());
    dispatch(changeDeliveryMethod(e.target.alt));
    setOrderType(e.target.alt);
  };

  return (
    <>
      {items.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart__container empty-cart__container--small">
            <div className="cart-title">Корзина</div>
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
            <div className="cart_title">
              <p>Корзина</p>
            </div>
            <div className="cart_order">
              <h1>Ваш заказ</h1>
            </div>
            <button className="clear-button" onClick={clearFullCart}>
              Очистить корзину
            </button>
            {items.map((item: ICartItem, index) => (
              <CartItem key={index} {...item} />
            ))}
            <div className="total-price">
              <div>Итого:</div>
              <div className="total-price__number">{totalPrice} BYN</div>
            </div>
          </div>

          <div className="order_actions">
            <div>Тип заказа: </div>
            <div className="order_buttons">
              <button
                className={
                  orderType === "bookTable" ? "order_button_pushed" : undefined
                }
                type="button"
                onClick={onChangeTab}
              >
                <img src={BookTableIcon} alt="bookTable" />
              </button>
              <button
                className={
                  orderType === "delivery" ? "order_button_pushed" : undefined
                }
                type="button"
                onClick={onChangeTab}
              >
                <img src={DeliveryIcon} alt="delivery" />
              </button>
              <button
                className={
                  orderType === "takeaway" ? "order_button_pushed" : undefined
                }
                type="button"
                onClick={onChangeTab}
              >
                <img src={TakeawayIcon} alt="takeaway" />
              </button>
            </div>
          </div>

          {orderType === "bookTable" ? (
            <BookTable />
          ) : orderType === "delivery" ? (
            <Delivery />
          ) : orderType === "takeaway" ? (
            <Takeaway />
          ) : (
            <div></div>
          )}

          <div className="make_order">
            <Button type="button" onClick={handleOnMakingOrder}>
              Оформить Заказ
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
