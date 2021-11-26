import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Button,
  ToastAndroid,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import { addOrderHistoryItem, clearCart } from '../store/StoreCard';
import dayjs from 'dayjs';
 
interface DishShortInfo {
  dish_id: number;
  dish_amount: number;
  excluded_ingredients: string;
}

interface Order {
  adress: string;
  customer_id: string;
  delivery_method: string;
  total_price: number;
  delivery_date: string;
  contact_name: string;
  payment_method: number;
  contact_phone: string;
  comment: string;
  reserve_time:string;
  status:string;
  reserve_date:string;
  num_of_persons: number;
  dish: DishShortInfo[];
}

export const OrderDetails = ({
  navigation: {goBack},
  route
}: {
  navigation: any;
  route: any;
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const [id, setId] = useState();
  const cart = useSelector(state => state.dishes);
  const [pay, setPay] = useState('а мне похуй')
  const showToast = () => {
    ToastAndroid.showWithGravity(
      'Заказ отправлен',
      ToastAndroid.SHORT,
      ToastAndroid.TOP,
    );
  };
  const handleAddOrderHistoryItem = (item:any) => {
    dispatch(addOrderHistoryItem(item))
  }
  const handleClearCart = () => {
    dispatch(clearCart())
  }
  const historyOrder = {
    id:cart.date,
    type:cart.orderType,
    date:cart.date,
    paymentType: cart.paymentType,
    orderStatus: 'Завершен'
  }
  const onMakingOrder = () => {
    let order = {} as Order;
    order.adress = 'asdf';
    order.customer_id = cart.userInfo.surName;
    order.delivery_method = cart.orderType;
    order.total_price = cart.cardTotalAmount;
    order.delivery_date = cart.date;
    order.contact_name = cart.userInfo.surName;
    order.contact_phone = cart.userInfo.phone;
    order.payment_method = cart.paymentType;
    order.comment = "Hi, I'm hardcode comment";

    let dishesShortInfo = cart.dishes.map((item: any) => {
      let dish = {} as DishShortInfo;
      dish.dish_id = item.id;
      dish.dish_amount = item.cardQuantity;
      dish.excluded_ingredients = item.excluded_ingredients
        ? item.excluded_ingredients
        : '';
      return dish;
    });
    
    order.dish = dishesShortInfo;
    console.log(order)
    axios
      .post(
        'http://ec2-18-198-161-12.eu-central-1.compute.amazonaws.com:5000/api/order',
        order,
        {
          headers: {'Content-type': 'application/json'},
        },
      )
      .then((response:any) => setId(response))
      .catch(err => console.log(err));
  };

  const onMakingOrderTable = async () => {
      
    let order = {} as Order;
    order.num_of_persons = cart.num;
    order.customer_id = "889993242341";
    order.contact_name = cart.userInfo.name +" "+cart.userInfo.surName;
    order.contact_phone = "1111111";
    order.payment_method = 1;
    order.adress = 'bookTable';
    order.status = "bla";
    order.comment = "bla";
    order.delivery_method = cart.orderType;
    order.total_price = cart.cardTotalAmount;
    order.delivery_date = cart.date;
    order.reserve_time = cart.date;
    order.reserve_date = cart.date;
    let dishesShortInfo = cart.dishes.map((item: any) => {
      let dish = {} as DishShortInfo;
      dish.dish_id = item.id;
      dish.dish_amount = item.cardQuantity;
      dish.excluded_ingredients = item.excluded_ingredients
        ? item.excluded_ingredients
        : '';
      return dish;
    });
    
    order.dish = dishesShortInfo;
    console.log(order)
      const servResp = await axios
      .post(
        'http://ec2-18-198-161-12.eu-central-1.compute.amazonaws.com:5000/api/reserve',
        order,
        {
          headers: {'Content-type': 'application/json'},
        },
      )
      const res = servResp;
      console.log({...res}.data.id,'res')
    
    
  };

  const payWordFunc = () => {
    let payWord
    if (cart.paymentType == 0){
      payWord = 'Наличными'
    }else if (cart.paymentType == 1){
      payWord = 'Картой онлайн'
    } else if (cart.paymentType == 2){
      payWord = 'Картой'
    } 
    
    setPay(payWord)
  }
  useEffect(() => {
    payWordFunc();
  }, []);
  
  return (
    <View style={styles.Wrapper}>
      <View style={styles.Title}>
        <TouchableOpacity onPress={() => goBack()}>
          <Image
            style={styles.Arrow}
            source={require('../../img/arrowLeft.png')}
          />
        </TouchableOpacity>
        <Text style={styles.TitleText}>Детали заказа</Text>
      </View>
      <View style={styles.orderType}>
        <View style={styles.flexWrapper}>
          <View style={styles.flexEnd}>
            <Text style={styles.color}>ТИП ЗАКАЗА</Text>
            <Text style={styles.color}> ДАТА</Text>
            <Text style={styles.color}> ВРЕМЯ</Text>
            <Text style={styles.color}> ОПЛАТА</Text>
          </View>
          <View>
            <Text style={styles.simpText}>{cart.orderType}</Text>
            <Text style={styles.simpText}>13 октября</Text>
            <Text style={styles.simpText}>15:00</Text>
            <Text style={styles.simpText}>{pay}</Text>
          </View>
        </View>
      </View>
      <View style={styles.orderDishes}>
        <View style={styles.rowWrapper}>
          <Text style={styles.color}>БЛЮДО</Text>
          <Text style={styles.color}>ЦЕНА</Text>
          <Text style={styles.color}>КОЛ-ВО</Text>
          <Text style={styles.color}>СУММА</Text>
        </View>
        <View
          style={{
            paddingTop: 15,
            borderBottomColor: '#979A9F',
            borderBottomWidth: 0.3,
          }}
        />
        {cart.dishes.map((item: any) => {
          let newTitle
          if(item.title.length >7){
            let name = item.title.substr(0,7)
             newTitle = name+'...'
            console.log(newTitle)
          } else {
            newTitle = item.title
          }
          
      
          return (
            <View style={styles.contContent} key={item.id}>
              <Text style={styles.simpText}>{newTitle}</Text>
              <Text style={styles.Price}> {item.price} BYN</Text>
              <Text style={styles.Qan}> {item.cardQuantity}</Text>
              <Text style={styles.simpText}>
                {item.price * item.cardQuantity} BYN
              </Text>
            </View>
      )} )}
        <View
          style={{
            paddingTop: 15,
            borderBottomColor: '#979A9F',
            borderBottomWidth: 0.3,
          }}
        />
        <View style={styles.TotalCounter}>
          <Text style={styles.finHardText}>ИТОГО</Text>
          <Text style={styles.finText}>{cart.cardTotalAmount} BYN</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.butStyle}
        onPress={() => {
          showToast();
          if(cart.orderType == "Бронь стола") {
            onMakingOrderTable()
            console.log(onMakingOrderTable(),'return')
          
          } else {
            onMakingOrder();
            console.log(id,'id')
           
          }
          console.log(id)
          
          handleAddOrderHistoryItem(historyOrder)
          handleClearCart()
          
          navigation.navigate('Home')
          
          
        }}>
        <Text style={styles.ButText}> ГОТОВО </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  Wrapper: {
    flex: 1,
    backgroundColor: 'white',
  },
  finHardText: {
    left: 45,
    paddingTop: 15,
    color: '#FF4D00',
  },
  finText: {
    right: 40,
    color: 'black',
    paddingTop: 15,
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
  },
  butStyle: {
    position: 'absolute',
    top: '75%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    height: '8%',
    backgroundColor: '#FF4D00',
    borderRadius: 4,
  },
  ButText: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 18,
    lineHeight: 24,
    color: '#FFFFFF',
  },
  TotalCounter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contContent: {
    paddingTop: 15,
    paddingBottom: 15,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  Qan: {
    color: 'black',
    right: '70%',
  },
  Price: {
    color: 'black',
    right: '70%',
  },
  rowWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  color: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '800',
    fontSize: 13,
    lineHeight: 18,

    color: '#979A9F',
  },
  flexEnd: {
    justifyContent: 'flex-end',
  },
  Title: {
    flexDirection: 'row',
    height: '9%',
    width: '100%',

    fontFamily: 'Roboto',
    fontSize: 30,
    fontWeight: 'normal',
    color: 'black',
    backgroundColor: '#F4F4F4',
  },
  orderDishes: {
    paddingBottom: 15,
    paddingTop: 15,
    top: '10%',
    elevation: 3,
    alignSelf: 'center',
    width: '96%',
    backgroundColor: '#F3F5F9',
    borderRadius: 10,
  },
  flexWrapper: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  Arrow: {
    top: '26%',
    width: 30,
    height: 30,
    marginRight: 15,
    marginLeft: 5,
  },
  TitleText: {
    alignSelf: 'center',
    fontFamily: 'Roboto',

    fontSize: 25,
    fontWeight: 'normal',
    color: 'black',
  },
  simpText: {
    color: 'black',
  },
  orderType: {
    paddingBottom: 15,
    paddingTop: 15,
    top: '5%',
    elevation: 3,
    alignSelf: 'center',
    width: '96%',
    backgroundColor: '#F3F5F9',
    borderRadius: 10,
  },
});
