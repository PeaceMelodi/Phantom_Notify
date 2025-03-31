import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, AntDesign } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useNavigation } from '@react-navigation/native'

const Settings = () => {
    const navigation = useNavigation();
    const { isDarkMode, setIsDarkMode, colors } = useTheme();
    const [animation] = useState(new Animated.Value(isDarkMode ? 1 : 0))

    const toggleTheme = () => {
        Animated.timing(animation, {
            toValue: isDarkMode ? 0 : 1,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setIsDarkMode(!isDarkMode)
        })
    }
    
    const translateX = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 22]
    })

    return (
        <SafeAreaView style={{flex:1, backgroundColor: colors.background}}>
            <TouchableOpacity 
                style={{
                    position: 'absolute',
                    top: 100,
                    left: 30,
                    zIndex: 1
                }}
                onPress={() => navigation.goBack()}
                hitSlop={40}
            >
                <AntDesign name="left" size={24} color={colors.text} />
            </TouchableOpacity>

            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <View style={{
                    alignItems: 'center',
                    marginTop: 30
                }}>
                    <Text style={{
                        fontSize: 16,
                        color: colors.text,
                        marginBottom: 10
                    }}>
                        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                    </Text>
                    
                    <TouchableOpacity 
                        activeOpacity={0.8}
                        style={{
                            width: 50,
                            height: 30,
                            borderRadius: 15,
                            padding: 2,
                            justifyContent: 'center',
                            backgroundColor: isDarkMode ? '#555555' : '#FFD700'
                        }}
                        onPress={toggleTheme}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Animated.View 
                            style={{
                                width: 26,
                                height: 26,
                                borderRadius: 13,
                                backgroundColor: 'white',
                                alignItems: 'center',
                                justifyContent: 'center',
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: 2
                                },
                                shadowOpacity: 0.2,
                                shadowRadius: 2.5,
                                elevation: 2,
                                transform: [{ translateX }]
                            }}
                        >
                            {isDarkMode ? (
                                <Ionicons name="moon" size={16} color="#333" />
                            ) : (
                                <Ionicons name="sunny" size={16} color="#FFD700" />
                            )}
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Settings
