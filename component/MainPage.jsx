import React from 'react'
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, EvilIcons, Feather, MaterialCommunityIcons, FontAwesome6
} from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'


const MainPage = () => {


   const navigation = useNavigation();


  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#F5DFBB'}}>
 <ScrollView>
   <View style={{flex:1, 
   alignItems:'center'}}>
    {/* Header */}
    <View style={{ width:'100%',  padding:30, gap:10, justifyContent:'space-between', flexDirection:'row'}}>
    <Text style={{fontSize:20, color:'#2A0800', fontWeight:500}}>
        Tasks
    </Text>
    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
    <AntDesign name="setting" size={24} color="#2A0800" />
    </TouchableOpacity>
    </View>

    {/* Search */}
<View style={{backgroundColor:'#fff', width:'90%', padding:10, paddingLeft:20, borderRadius:30, flexDirection:'row', gap:10, alignItems:'center', marginVertical:10}}>
  <Feather
 name="search" size={20} color="#2A0800" />
  <TextInput placeholder='Search for tasks' style={{backgroundColor:'#fff'}}/>
</View>

{/* Tasks */}
<View style={{marginVertical:18, gap:10,width:'90%',}}>
<View style={{backgroundColor:'#fff',  padding:20, paddingLeft:20, borderRadius:10, flexDirection:'row',  alignItems:'center',  justifyContent:'space-between'}}>
  <View style={{gap:10}}>
  <Text style={{fontSize:18, color:'#2A0800', fontWeight:500}}>
    Task 1
  </Text>
  <Text>
    <Text style={{color:'#2A0800', fontWeight:500}}>Due:</Text> Tue, 23 10:00pm
  </Text>
  </View>
  <View style={{flexDirection:'row', gap:25}}>
  <TouchableOpacity hitSlop={30}>
  <MaterialCommunityIcons name="pencil-outline" size={17} color="#2A0800" />
  </TouchableOpacity>
  <TouchableOpacity hitSlop={25}>
<FontAwesome6 name="trash" size={17} color="#2A0800" />
</TouchableOpacity>
  </View>
  </View>
  <View style={{backgroundColor:'#fff',  padding:20, paddingLeft:20, borderRadius:10, flexDirection:'row',  alignItems:'center',  justifyContent:'space-between'}}>
  <View style={{gap:10}}>
  <Text style={{fontSize:18, color:'#2A0800', fontWeight:500}}>
    Task 2
  </Text>
  <Text>
    <Text style={{color:'#2A0800', fontWeight:500}}>Due:</Text> Tue, 23 10:00pm
  </Text>
  </View>
  <View style={{flexDirection:'row', gap:25}}>
  <TouchableOpacity hitSlop={30}>
  <MaterialCommunityIcons name="pencil-outline" size={17} color="#2A0800" />
  </TouchableOpacity>
  <TouchableOpacity hitSlop={25}>
<FontAwesome6 name="trash" size={17} color="#2A0800" />
</TouchableOpacity>
  </View>
  </View>

  </View>
  
   </View>
   </ScrollView>
   {/* Floating Icon */}
   <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: '#FC5007',
          padding: 15,
          borderRadius: 50,
          elevation: 5 // Shadow on Android
        }}
        onPress={() => navigation.navigate('NewTask')}
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
   </SafeAreaView>
  )
}

export default MainPage