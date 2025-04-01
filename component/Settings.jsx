import React, { useState } from 'react'
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Animated,
    ScrollView,
    Modal,
    FlatList 
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, AntDesign } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useNavigation } from '@react-navigation/native'

const Settings = () => {
    const navigation = useNavigation();
    const { 
        isDarkMode, 
        setIsDarkMode, 
        colors,
        selectedFont,
        setSelectedFont,
        availableFonts 
    } = useTheme();
    const [animation] = useState(new Animated.Value(isDarkMode ? 1 : 0));
    const [showFontModal, setShowFontModal] = useState(false);

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

    const FontOption = ({ font, index }) => (
        <TouchableOpacity 
            style={{
                padding: 15,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                backgroundColor: selectedFont === font ? colors.accent : 'transparent'
            }}
            onPress={() => {
                setSelectedFont(font);
                setShowFontModal(false);
            }}
        >
            <Text style={{
                color: selectedFont === font ? '#FFFFFF' : colors.text,
                fontSize: 16,
                fontFamily: font
            }}>
                {font}
            </Text>
        </TouchableOpacity>
    );

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

            <ScrollView style={{flex: 1, paddingHorizontal: 20}}>
                <View style={{marginTop: 60}}>
                    <View style={{
                        alignItems: 'center',
                        marginTop: 30
                    }}>
                        <Text style={{
                            fontSize: 16,
                            color: colors.text,
                            marginBottom: 10,
                            fontFamily: selectedFont
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

                    {/* Font Selection Button */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 20,
                        padding: 15,
                        backgroundColor: colors.card,
                        borderRadius: 10
                    }}>
                        <View>
                            <Text style={{
                                color: colors.text,
                                fontSize: 16,
                                fontWeight: '500',
                                marginBottom: 5,
                                fontFamily: selectedFont
                            }}>Font Style</Text>
                            <Text style={{
                                color: colors.text,
                                opacity: 0.7,
                                fontSize: 14,
                                fontFamily: selectedFont
                            }}>
                                {selectedFont}
                            </Text>
                        </View>
                        <TouchableOpacity 
                            onPress={() => setShowFontModal(true)}
                            style={{
                                backgroundColor: colors.accent,
                                padding: 8,
                                borderRadius: 8
                            }}
                        >
                            <Text style={{
                                color: '#FFFFFF',
                                fontFamily: selectedFont
                            }}>Change</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Font Selection Modal */}
            <Modal
                visible={showFontModal}
                transparent={true}
                animationType="slide"
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'flex-end'
                }}>
                    <View style={{
                        backgroundColor: colors.background,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        maxHeight: '70%'
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            padding: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: colors.border
                        }}>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: '600',
                                color: colors.text,
                                fontFamily: selectedFont
                            }}>Select Font</Text>
                            <TouchableOpacity onPress={() => setShowFontModal(false)}>
                                <AntDesign name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={availableFonts}
                            renderItem={({item, index}) => <FontOption font={item} index={index} />}
                            keyExtractor={(item, index) => `${item}-${index}`}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default Settings
