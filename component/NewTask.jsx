import React from 'react'
import { View, Text } from 'react-native'

const NewTask = () => {
  return (
     <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#F5DFBB'}}>
            <Text style={{fontSize:20, color:'#2A0800', fontWeight:500}}>New Task</Text>
        </View>
     
  )
}

export default NewTask