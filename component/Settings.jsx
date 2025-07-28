import React, { useState, useEffect } from 'react'
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Animated,
    ScrollView,
    Modal,
    FlatList,
    Image,
    Linking,
    Alert,
    Platform
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useNavigation } from '@react-navigation/native'
import * as Notifications from 'expo-notifications';

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

    // New animated values for bubble and profile
    const [bubbleAnimation] = useState(new Animated.Value(0));
    const [profileAnimation] = useState(new Animated.Value(0));

    // Run animations when component mounts
    useEffect(() => {
        // Delay for bubble animation
        Animated.sequence([
            Animated.delay(500), // Wait for 500ms
            Animated.parallel([
                // Fade in
                Animated.timing(bubbleAnimation, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                // Slide up
                Animated.spring(profileAnimation, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                })
            ])
        ]).start();
    }, []);

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

    const openWhatsApp = () => {
        Linking.openURL('https://wa.me/2348102608378');
    };

    // Test notification functionality
    const testNotification = async () => {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Test Notification",
                    body: "If you see this, notifications are working!",
                },
                trigger: { seconds: 2 },
            });
        } catch (error) {
            console.log('Error testing notification:', error);
        }
    };

    // Custom themed help modal
    const [showHelpModal, setShowHelpModal] = useState(false);

    const showNotificationHelp = () => {
        setShowHelpModal(true);
    };

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

                    {/* Notification Troubleshooting Section */}
                    {Platform.OS === 'android' && (
                        <View style={{
                            marginTop: 20,
                            padding: 15,
                            backgroundColor: colors.card,
                            borderRadius: 10
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 10
                            }}>
                                <MaterialCommunityIcons 
                                    name="bell-alert" 
                                    size={20} 
                                    color={colors.accent} 
                                />
                                <Text style={{
                                    color: colors.text,
                                    fontSize: 16,
                                    fontWeight: '500',
                                    marginLeft: 10,
                                    fontFamily: selectedFont
                                }}>Notification Help</Text>
                            </View>
                            <Text style={{
                                color: colors.text,
                                opacity: 0.7,
                                fontSize: 14,
                                marginBottom: 15,
                                fontFamily: selectedFont
                            }}>
                                Having trouble with reminders? Get help with notification settings.
                            </Text>
                            <View style={{
                                flexDirection: 'row',
                                gap: 10
                            }}>
                                <TouchableOpacity 
                                    onPress={testNotification}
                                    style={{
                                        backgroundColor: colors.accent,
                                        paddingVertical: 8,
                                        paddingHorizontal: 12,
                                        borderRadius: 6,
                                        flex: 1
                                    }}
                                >
                                    <Text style={{
                                        color: colors.card,
                                        fontSize: 14,
                                        fontWeight: '500',
                                        textAlign: 'center',
                                        fontFamily: selectedFont
                                    }}>Test Notification</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={showNotificationHelp}
                                    style={{
                                        backgroundColor: colors.border,
                                        paddingVertical: 8,
                                        paddingHorizontal: 12,
                                        borderRadius: 6,
                                        flex: 1
                                    }}
                                >
                                    <Text style={{
                                        color: colors.text,
                                        fontSize: 14,
                                        fontWeight: '500',
                                        textAlign: 'center',
                                        fontFamily: selectedFont
                                    }}>Get Help</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Custom Themed Help Modal */}
            <Modal
                visible={showHelpModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowHelpModal(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 24, width: '85%', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center', color: colors.text, fontFamily: selectedFont }}>
                            Notification Issues?
                        </Text>
                        <Text style={{ fontSize: 15, marginBottom: 18, textAlign: 'center', color: colors.text, fontFamily: selectedFont }}>
                            If your reminders aren't working:{"\n\n"}1. Go to Settings &gt; Battery &gt; Battery Optimization{"\n"}2. Find 'Phantom Notify' and set to 'Don't optimize'{"\n"}3. Also check Settings &gt; Apps &gt; Phantom Notify &gt; Permissions{"\n"}4. Make sure notifications are enabled
                        </Text>
                        <TouchableOpacity
                            style={{ backgroundColor: colors.accent, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24, marginBottom: 10, width: '100%' }}
                            onPress={() => {
                                setShowHelpModal(false);
                                Linking.openSettings();
                            }}
                        >
                            <Text style={{ color: colors.card, fontWeight: 'bold', fontSize: 16, textAlign: 'center', fontFamily: selectedFont }}>Open Settings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => setShowHelpModal(false)}
                            style={{ marginTop: 5 }}
                        >
                            <Text style={{ color: colors.accent, fontSize: 15, fontFamily: selectedFont }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Floating Profile with Speech Bubble */}
            <View style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                alignItems: 'flex-end'
            }}>
                {/* Speech Bubble */}
                <TouchableOpacity 
                    onPress={openWhatsApp}
                    activeOpacity={1}  // Remove opacity feedback completely
                    style={{
                        transform: [{ scale: 1 }],  // Initial scale
                    }}
                    onPressIn={() => {
                        Animated.spring(bubbleAnimation, {
                            toValue: 0.95,  // Scale down slightly when pressed
                            useNativeDriver: true,
                            tension: 100,
                            friction: 3
                        }).start();
                    }}
                    onPressOut={() => {
                        Animated.spring(bubbleAnimation, {
                            toValue: 1,  // Scale back to normal when released
                            useNativeDriver: true,
                            tension: 100,
                            friction: 3
                        }).start();
                    }}
                >
                    <Animated.View style={{
                        backgroundColor: colors.card,
                        padding: 8,
                        borderRadius: 12,
                        marginBottom: 10,
                        marginRight: 5,
                        maxWidth: 150,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                        transform: [{ scale: bubbleAnimation }]  // Apply scale animation
                    }}>
                        <Text style={{
                            color: colors.text,
                            fontSize: 12,
                            fontFamily: selectedFont
                        }}>
                            Made by Phantom{'\n'}
                            <Text style={{ color: colors.accent }}>
                                Contact me →
                            </Text>
                        </Text>
                        <View style={{
                            position: 'absolute',
                            bottom: -10,
                            right: 20,
                            width: 0,
                            height: 0,
                            backgroundColor: 'transparent',
                            borderStyle: 'solid',
                            borderLeftWidth: 10,
                            borderRightWidth: 10,
                            borderTopWidth: 10,
                            borderLeftColor: 'transparent',
                            borderRightColor: 'transparent',
                            borderTopColor: colors.card,
                        }} />
                    </Animated.View>
                </TouchableOpacity>

                {/* Floating Profile Circle */}
                <Animated.View style={{
                    opacity: profileAnimation, // Fade in animation
                    transform: [
                        {
                            translateY: profileAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [50, 0] // Slide up from 50 to 0
                            })
                        },
                        {
                            scale: profileAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.5, 1] // Scale up from 0.5 to 1
                            })
                        }
                    ]
                }}>
                    <TouchableOpacity
                        onPress={openWhatsApp}
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            justifyContent: 'center',
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                            overflow: 'hidden'
                        }}
                    >
                        <Image
                            source={require('../assets/phantom.jpeg')}
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                </Animated.View>
            </View>

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
                            renderItem={({item, index}) => <FontOption key={`font-${item}-${index}`} font={item} index={index} />}
                            keyExtractor={(item, index) => `${item}-${index}`}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default Settings
