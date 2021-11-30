import { StyleSheet } from "react-native"
const styles = StyleSheet.create({
    Wrapper:{
        backgroundColor:'white',
    },
    size:{
      width:'100%',
      height:'80%',
    },
    EmptyTextWrapper:{
        justifyContent:'center',
        top:'50%'
    },
    EmptyText:{
        position:'absolute',
        top:200,
        
        alignSelf:'center',
        fontWeight:'800',
        fontSize:20,
        color: 'black',
    },
    Title: {
        flexDirection:'row',
        height:'9%',
        width:'100%',
        
        
        fontFamily: 'Roboto',
        fontSize: 30,
        fontWeight: 'normal',
        color:'black',
        backgroundColor:'#F4F4F4',
    },
    Arrow:{
        top:'26%',
        width:30,
        height:30,
        marginRight:15,
        marginLeft:5,
    },
    TitleText:{
        alignSelf:'center',
        fontFamily: 'Roboto',
        
        fontSize: 25,
        fontWeight: 'normal',
        color:'black',
    },
    switcher:{
      top:5,
      alignSelf:'center',
      borderRadius: 20,
      width: 260,
      height: 30,
      backgroundColor: 'rgba(239, 116, 47, 0.25)',
    },
    switchBut:{
      alignItems:'center',
      justifyContent:'center',
      width:'50%',
      height:'105%',
      backgroundColor: '#FFFFFF',
      borderColor:'#FF4D00',
      borderWidth:1.5,
      borderRadius: 20,
    },
    switchButHist:{
      alignItems:'center',
      justifyContent:'center',
      left:73,
      width:'50%',
      height:'105%',
      backgroundColor: '#FFFFFF',
      borderColor:'#FF4D00',
      borderWidth:1.5,
      borderRadius: 20,
    },
    trueText:{
      color:'black',
      alignSelf:'center',
    },
    inActText:{
      alignSelf:'center',
      left:40,
      color: 'rgba(255, 77, 0, 0.5)',
    },
    orderType: {
      marginBottom:15,
        paddingBottom: 15,
        paddingTop: 15,
        top: '5%',
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
      flex:{
        marginTop:10,
        height:'85%',
        width:'100%',
   

      },
      flexEnd: {
        justifyContent: 'flex-end',
      },
      color: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: '800',
        fontSize: 13,
        lineHeight: 18,
    
        color: '#979A9F',
      },
      simpText: {
        color: 'black',
      },
      orderDishes: {
        marginBottom:40,
        paddingBottom:15,
        paddingTop: 15,
        top: '10%',
        elevation: 3,
        alignSelf: 'center',
        width: '96%',
        backgroundColor: '#F3F5F9',
        borderRadius: 10,
      },
      rowWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  rowSwitcher: {
    
    flexDirection: 'row',
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
    right: '75%',
  },
  TotalCounter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    Button:{
        position:'absolute',
        top:400,
        alignSelf:'center',
        alignItems:'center',
        justifyContent:'center',
        width:'90%',
        height:60,
        backgroundColor:'#FF4D00',
        borderRadius: 4,

    },
    ButText:{
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 18,
        lineHeight: 24,
        color: '#FFFFFF',
    },
})

export default styles