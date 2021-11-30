import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppStateType } from "../../../store";
import { AuthStateType } from "../../../store/auth/auth.reducer";
import "./profileOrders.scss";
import { useEffect, useState } from "react";
import { orderAPI } from "../../../api/api";
import { useAppSelector } from "../../../store/hooks";
import { Link } from "react-router-dom";
import moment from 'moment';

export interface Order {
  delivery_method: string;
  payment_method: number;
  customer_id: string;
  total_price: number;
  delivery_date: Date;
  comment: string;
  OrderDishes: DishSettingsInfo[];
  adress: string;
  contact_name: string;
  contact_phone: string;
  num_of_persons: number;
  status: string
}

export interface DishSettingsInfo {
  dish_id: number;
  excluded_ingredients: string;
  quantity: number;
  Dish: DishShortInfo;
}

export interface DishShortInfo {
  title: string;
  calories: number;
  id: number;
  price: number;
  weight: number;
}

const paymentMethod = ["Наличными", "Картой онлайн", "Картой на месте"];

export const ProfileOrders = () => {
  const user = useSelector<AppStateType, AuthStateType>(state => state.auth.user);
  const userId = useAppSelector((state) => state.auth?.user?.attributes?.sub);
  const [ordersCurrent, setOrdersCurrent] = useState([] as Order[]);
  const [ordersHistory, setOrdersHistory] = useState([] as Order[]);
  const [ordersType, setOrdersType] = useState('');
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const ordersPerPage: number = 3;
  let pages: number = 1;

  useEffect(() => {
    let currentOrders: Order[] = [];
    let historyOrders: Order[] = [];
    orderAPI.getOrders(userId).then(async (orders: any) => {
       currentOrders = await orders.filter((order: Order) => {
        return order.status === "Принят в работу" && "Готовится" && "Изменен" && "Отправлен";
      });
      historyOrders = await orders.filter((order: Order) => {
        return order.status === "Готов" && "Отменен";
      });
      setOrdersCurrent(currentOrders);
      setOrdersHistory(historyOrders);
      console.log(orders)
      onCurrentClicked();
    })
  }, [userId]);

  const onCurrentClicked = () => {
    setOrdersType('current');
  }

  const onHistoryClicked = () => {
    setOrdersType('history');
  }

  const renderColumn = (colName: string) => {
    return (
      <th>
        <div className="table-head" >
          <div className="table-head__description">{colName}</div>
        </div>
      </th>
    )
  }

  const renderRows = () => {
    const tableData = ordersType === "current" ? ordersCurrent : ordersHistory;
    pages = Math.ceil(tableData.length / ordersPerPage);
    let tableRows: any = [];
    if (tableData.length) {
      const curPage = Math.min(pages, selectedPage);
      let startOrder = ordersPerPage * curPage - ordersPerPage;
      for (let i = startOrder; i < Math.min(ordersPerPage * curPage, tableData.length); i++) {
        console.log(i, tableData);
        tableRows.push(
          <tr className="table-row">
            <td>{
              tableData[i].OrderDishes.map(el => {
                return (<div>{el.Dish.title}</div>)
              })
              }</td>
            <td>{tableData[i].delivery_method === "takeaway" ? "Навынос" :
              tableData[i].delivery_method === "bookTable" ? "Бронирование стола" :
                tableData[i].delivery_method === "delivery" ? "Доставка" : null
            }</td>
            <td>{moment(tableData[i].delivery_date).format("DD.MM.YYYY hh.mm")}</td>
            <td>
              <div className={
                tableData[i].status === "Готовится" ? "status-wrapper status-in-progress" :
                  tableData[i].status === "Готов" ? "status-wrapper status-done" :
                    tableData[i].status === "Отменен" ? "status-wrapper status-canceled" :
                      tableData[i].status === "Изменен" ? "status-wrapper status-shanged" :
                        tableData[i].status === "Принят в работу" ? "status-wrapper status-in-progress" :
                          undefined
              }>
                &#8226;{tableData[i].status}
              </div>
            </td>
            <td>
              <span className="td-total-price">
                {tableData[i].total_price}  
              </span>
              &#8194;BYN
              </td>
            <td>{paymentMethod[tableData[i].payment_method]}</td>
          </tr>
        );
      }
    }
    return tableRows;
  }

  const renderTable = () => {
    const selectNextPage = () => {
      let currentPage = selectedPage;
      if (pages > 0) {
        if (currentPage < pages) {
          currentPage++;
          setSelectedPage(currentPage);
        }
      }
    }

    const selectPrevioustPage = () => {
      let currentPage = selectedPage;
      if (pages > 0) {
        if (currentPage > 1) {
          currentPage--;
          setSelectedPage(currentPage)
        }
      }
    }

    return (
      <div className="orders-table__container">
        <table>
          <thead>
            <tr>
              {renderColumn("Название блюда")}
              {renderColumn("Тип заказа")}
              {renderColumn("Дата/Время")}
              {renderColumn("Статус")}
              {renderColumn("Итого")}
              {renderColumn("Способ оплаты")}
            </tr>
          </thead>
          <tbody>
            {renderRows()}
          </tbody>
        </table>
        <div className="orders-table__pages-list-container">
          <div className="pages-list-container__info">{selectedPage} из {pages}</div>
          <button className="pages-list-container__btn" onClick={selectPrevioustPage}>
            &#60;
          </button>
          <button className="pages-list-container__btn" onClick={selectNextPage}>
            &#62;
          </button>
        </div>
      </div>
    );
  }

  if (user === null) {
    return <Redirect to="/login" />
  }
  return (
    <div className="orders-container">
      <div className="orders-switcher">
        <button
          className={ordersType === "current" ? "orders-switcher__btn active" : "orders-switcher__btn"}
          onClick={onCurrentClicked}>Текущие
        </button>
        <button
          className={ordersType === "history" ? "orders-switcher__btn active" : "orders-switcher__btn"}
          onClick={onHistoryClicked}>История
        </button>
      </div>
      {ordersType === "current" && ordersCurrent.length === 0 || ordersType === "history" && ordersHistory.length === 0
        ?
        (<div className="orders__empty">
          <div className="orders__message">
            {ordersType === "current"
              ? ("У вас нет текуших заказов")
              : ('Ваша история заказов пуста')
            }
          </div>
          <Link to="/menu" className="orders__menu-link">
            Перейти в меню
          </Link>
        </div>)
        : renderTable()}
    </div>
  )
}

export default ProfileOrders;