import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'


const Welcome = () => {

    const navigation = useNavigation();


  return (
   <View style={{flex:1,justifyContent:'center',alignItems:'center', gap:20, backgroundColor:'#F5DFBB'}}>
    
    <Text style={{fontSize:20, color:'#2A0800', fontWeight:500}}>Welcome</Text>

<TouchableOpacity style={{ backgroundColor:'#FC5007', padding:10, borderRadius: 10}} onPress={() => navigation.navigate('MainPage')}>
    <Text style={{fontSize:13, color:'white',}}>
Next
</Text>
</TouchableOpacity>
   </View>
  )
}

export default Welcome