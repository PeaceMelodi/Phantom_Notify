import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Platform, Modal, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '../context/ThemeContext'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const Welcome = () => {
    const navigation = useNavigation();
    const { colors, selectedFont } = useTheme();
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    const showPrivacyPolicy = () => {
        setShowPrivacyModal(true);
    };

    return (
        <View style={{flex:1, backgroundColor: colors.background}}>
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={{fontSize:25, color: colors.text, fontWeight:500, fontFamily: selectedFont}}>Welcome</Text>
            </View>

            {/* Bottom area with Continue and Privacy Policy */}
            <View style={{position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', paddingBottom: 30}}>
                <TouchableOpacity 
                    style={{marginBottom: 8}} 
                    onPress={() => navigation.navigate('MainPage')}
                >
                    <Text style={{fontSize:Platform.OS === 'ios' ? 12 : 15, color: colors.text, fontFamily: selectedFont}}>
                        Continue →
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={showPrivacyPolicy}
                    style={{
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        borderRadius: 15,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6
                    }}
                >
                    <MaterialCommunityIcons 
                        name="shield-check" 
                        size={14} 
                        color={colors.text} 
                        style={{opacity: 0.7}}
                    />
                    <Text style={{
                        fontSize: 12, 
                        color: colors.text, 
                        fontFamily: selectedFont,
                        opacity: 0.7
                    }}>
                        Privacy Policy
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Privacy Policy Modal */}
            <Modal
                visible={showPrivacyModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowPrivacyModal(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 24, width: '90%', maxHeight: '80%' }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: colors.text, fontFamily: selectedFont }}>
                                Privacy Policy
                            </Text>
                            <Text style={{ fontSize: 12, color: colors.text, opacity: 0.7, marginBottom: 16, textAlign: 'center', fontFamily: selectedFont }}>
                                Last updated: August 2025
                            </Text>
                            
                            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: colors.text, fontFamily: selectedFont }}>
                                Introduction
                            </Text>
                            <Text style={{ fontSize: 14, marginBottom: 16, lineHeight: 20, color: colors.text, fontFamily: selectedFont }}>
                                Phantom Notify is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application.
                            </Text>

                            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: colors.text, fontFamily: selectedFont }}>
                                Information We Collect
                            </Text>
                            <Text style={{ fontSize: 14, marginBottom: 8, lineHeight: 20, color: colors.text, fontFamily: selectedFont }}>
                                Phantom Notify stores all your data locally on your device:
                            </Text>
                            <Text style={{ fontSize: 14, marginBottom: 16, lineHeight: 20, color: colors.text, fontFamily: selectedFont }}>
                                • Task information (title, description, due date, reminder time){"\n"}
                                • App settings and preferences{"\n"}
                                • Theme preferences (light/dark mode){"\n"}
                                • Notification settings
                            </Text>

                            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: colors.text, fontFamily: selectedFont }}>
                                How We Use Your Information
                            </Text>
                            <Text style={{ fontSize: 14, marginBottom: 16, lineHeight: 20, color: colors.text, fontFamily: selectedFont }}>
                                All data processing occurs locally on your device. We do not upload your data to external servers, share your information with third parties, or track your usage patterns.
                            </Text>

                            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: colors.text, fontFamily: selectedFont }}>
                                Data Security
                            </Text>
                            <Text style={{ fontSize: 14, marginBottom: 16, lineHeight: 20, color: colors.text, fontFamily: selectedFont }}>
                                All data is stored securely on your device and is not transmitted over the internet. No external servers have access to your information.
                            </Text>

                            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: colors.text, fontFamily: selectedFont }}>
                                Your Rights
                            </Text>
                            <Text style={{ fontSize: 14, marginBottom: 16, lineHeight: 20, color: colors.text, fontFamily: selectedFont }}>
                                Since all data is stored locally, you have complete control over your data. You can delete the app to remove all data or manage permissions through your device settings.
                            </Text>

                            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: colors.text, fontFamily: selectedFont }}>
                                Contact Information
                            </Text>
                            <Text style={{ fontSize: 14, marginBottom: 16, lineHeight: 20, color: colors.text, fontFamily: selectedFont }}>
                                If you have questions about this Privacy Policy, please contact us through the app or via WhatsApp support.
                            </Text>
                        </ScrollView>
                        
                        <TouchableOpacity 
                            onPress={() => setShowPrivacyModal(false)}
                            style={{ 
                                backgroundColor: colors.accent, 
                                borderRadius: 8, 
                                paddingVertical: 12, 
                                paddingHorizontal: 24, 
                                marginTop: 16,
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ color: colors.card, fontWeight: 'bold', fontSize: 16, fontFamily: selectedFont }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default Welcome
