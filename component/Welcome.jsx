import React from 'react'
import { View, Text, TouchableOpacity, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'


const Welcome = () => {

    const navigation = useNavigation();


  return (
<View style={{flex:1, backgroundColor:'#F5DFBB'}}>

<View style={{flex:1,justifyContent:'center',alignItems:'center',}}>
    
    <Text style={{fontSize:25, color:'#2A0800', fontWeight:500}}>Welcome</Text>

   </View>
   <TouchableOpacity style={{paddingBottom:50, paddingTop:0 , alignItems:'center'}} onPress={() => navigation.navigate('MainPage')}>
    <Text style={{fontSize:Platform.OS === 'ios' ? 12 : 15, color:'#2A0800'}}>
    Continue →
</Text>
</TouchableOpacity>

</View>
  )
}

export default Welcome