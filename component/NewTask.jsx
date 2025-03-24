    import React from 'react'
    import { View, Text, TextInput, TouchableOpacity, Platform, Keyboard, TouchableWithoutFeedback  } from 'react-native'
    import { SafeAreaView } from 'react-native-safe-area-context';
    import { AntDesign, EvilIcons, Feather, MaterialCommunityIcons, FontAwesome5
    } from '@expo/vector-icons'

    const NewTask = () => {

    // Function to dismiss keyboard
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <SafeAreaView style={{flex:1,backgroundColor:'#F5DFBB'}}>
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
        
            <View style={{flex:1,  alignItems:'center'}}>
            {/* Header */}
                <View style={{ width:'100%',  padding:30,alignItems:'center'}}>
                <Text style={{fontSize:20, color:'#2A0800', fontWeight:500}}>New Task</Text>
                </View>
                {/* Body */}
                <View style={{marginVertical:Platform.OS === 'ios' ? 10 : 0, gap:10,width:'100%',}}>
                {/* Title */}
                <View style={{ alignItems:'center' }}>
                <Text style={{fontSize:17, color:'#2A0800', fontWeight:500, width:'87%'}}>
                Title    
                </Text>
                <View style={{backgroundColor:'#fff',  padding:Platform.OS === 'ios' ? 20 : 6, paddingLeft:20, borderRadius:20, flexDirection:'row', gap:10, alignItems:'center', marginVertical:10}}>
    
    <TextInput placeholder='Enter Task' style={{backgroundColor:'#fff',width:'90%',}}  hitSlop={{size:40}}/>
    </View>
                </View>
    {/* Reminder Date */}
                <View style={{ alignItems:'center' }}>
                <Text style={{fontSize:17, color:'#2A0800', fontWeight:500, width:'87%'}}>
                Reminder Date    
                </Text>
                <View style={{backgroundColor:'#fff', width:'90%',padding:Platform.OS === 'ios' ? 20 : 6, paddingLeft:20, borderRadius:20, flexDirection:'row', gap:10, alignItems:'center', marginVertical:10, justifyContent:'space-between', paddingRight:Platform.OS === 'ios' ? 20 : 20}}>
    
    <TextInput placeholder='Set Date' style={{backgroundColor:'#fff'}}/>
    <FontAwesome5 name="calendar" size={Platform.OS === 'ios' ? 24 : 18} color="#2A0800" />
    </View>
                </View>
                {/* Reminder Time */}
                <View style={{ alignItems:'center' }}>
                <Text style={{fontSize:17, color:'#2A0800', fontWeight:500, width:'87%'}}>
                Reminder Time    
                </Text>
                <View style={{backgroundColor:'#fff', width:'90%', padding:Platform.OS === 'ios' ? 20 : 6, paddingLeft:20, borderRadius:20, flexDirection:'row', gap:10, alignItems:'center', marginVertical:10, justifyContent:'space-between', paddingRight:Platform.OS === 'ios' ? 20 : 20}}>
    
    <TextInput placeholder='Set Time' style={{backgroundColor:'#fff'}}/>
    <AntDesign
    name="caretdown" size={Platform.OS === 'ios' ? 24 : 18} color="#2A0800" />
    </View>
                </View>
                {/* Additional Note */}
                <View style={{ alignItems:'center' }}>
                <Text style={{fontSize:17, color:'#2A0800', fontWeight:500, width:'87%'}}>
                Additional Note <Text style={{fontSize:10, color:'#2A0800'}}>(optional)</Text>
                </Text>
                <View style={{
                backgroundColor:'#fff',  
                padding:10, 
                paddingLeft:20, 
                borderRadius:20, 
                marginVertical:10, 
                width: '90%'
                }}>
    
                <TextInput 
                    placeholder='Write Something....' 
                    style={{
                    backgroundColor:'#fff', 
                    width:'100%',
                    height: Platform.OS === 'ios' ? 120 : 100,
                    textAlignVertical: 'top',
                    paddingTop: 10
                    }}  
                    multiline={true}
                    numberOfLines={5}
                    
                />

                </View>
                </View>
                </View>
                {/* Footer */}
                <View style={{flexDirection:'row', gap:10}}>
    <TouchableOpacity style={{
        backgroundColor:'#FC5007',
        padding:13,
        borderRadius:20,
        width:'40%',
        alignItems:'center',
        justifyContent:'center'
    }}> 
    <Text style={{color:'#fff'}}>
        Save
    </Text>
    </TouchableOpacity>
    <TouchableOpacity style={{
        backgroundColor:'#fff',
        padding:13,
        borderRadius:20,
        width:'40%',
        alignItems:'center',
        justifyContent:'center',
        borderColor:'#FC5007',
        borderWidth:2
    }}> 
    <Text style={{  color:'#FC5007'}}>
    Clear
    </Text>
    </TouchableOpacity>

                </View>
                </View>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        
    )
    }

    export default NewTask