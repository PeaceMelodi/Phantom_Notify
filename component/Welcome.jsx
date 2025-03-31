import React from 'react'
import { View, Text, TouchableOpacity, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '../context/ThemeContext'

const Welcome = () => {
    const navigation = useNavigation();
    const { colors } = useTheme();

    return (
        <View style={{flex:1, backgroundColor: colors.background}}>
            <View style={{flex:1,justifyContent:'center',alignItems:'center',}}>
                <Text style={{fontSize:25, color: colors.text, fontWeight:500}}>Welcome</Text>
            </View>
            <TouchableOpacity 
                style={{paddingBottom:50, paddingTop:0 , alignItems:'center'}} 
                onPress={() => navigation.navigate('MainPage')}
            >
                <Text style={{fontSize:Platform.OS === 'ios' ? 12 : 15, color: colors.text}}>
                    Continue →
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default Welcome
