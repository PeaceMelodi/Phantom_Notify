    import React, { useState, useEffect } from 'react'
    import { 
        View, 
        Text, 
        TextInput, 
        TouchableOpacity, 
        Platform, 
        Keyboard, 
        KeyboardAvoidingView,
        ScrollView,
        TouchableWithoutFeedback,
        Modal
    } from 'react-native'
    import { SafeAreaView } from 'react-native-safe-area-context';
    import { AntDesign, EvilIcons, Feather, MaterialCommunityIcons, FontAwesome5
    } from '@expo/vector-icons'
    import DateTimePicker from '@react-native-community/datetimepicker';


    const NewTask = () => {
        // Get current date and time
        const getCurrentDateTime = () => {
            return new Date();
        };

        const [date, setDate] = useState(getCurrentDateTime());
        const [time, setTime] = useState(getCurrentDateTime());
        const [showDatePicker, setShowDatePicker] = useState(false);
        const [showTimePicker, setShowTimePicker] = useState(false);
        const [displayDate, setDisplayDate] = useState(getCurrentDateTime().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }));
        const [displayTime, setDisplayTime] = useState(getCurrentDateTime().toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }));

        const onDateChange = (event, selectedDate) => {
            const currentDate = selectedDate || date;
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            
            if (currentDate < now) {
                if (Platform.OS === 'android') {
                    setShowDatePicker(false);
                }
                return;
            }
            
            setDate(currentDate);
            setDisplayDate(currentDate.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }));
            
            if (currentDate.toDateString() === new Date().toDateString()) {
                const newTime = new Date();
                setTime(newTime);
                setDisplayTime(newTime.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }));
            }
            
            if (Platform.OS === 'android') {
                setShowDatePicker(false);
            }
        };

        const onTimeChange = (event, selectedTime) => {
            const currentTime = selectedTime || time;
            const now = new Date();
            
            if (date.toDateString() === now.toDateString()) {
                if (currentTime < now) {
                    if (Platform.OS === 'android') {
                        setShowTimePicker(false);
                    }
                    const newTime = new Date();
                    setTime(newTime);
                    setDisplayTime(newTime.toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    }));
                    return;
                }
            }

            setTime(currentTime);
            setDisplayTime(currentTime.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }));

            if (Platform.OS === 'android') {
                setShowTimePicker(false);
            }
        };

        // Get today's date for minimum date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Update time every minute if the selected date is today
        useEffect(() => {
            if (date.toDateString() === new Date().toDateString()) {
                const intervalId = setInterval(() => {
                    const now = new Date();
                    if (time < now) {
                        setTime(now);
                        setDisplayTime(now.toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        }));
                    }
                }, 60000);

                return () => clearInterval(intervalId);
            }
        }, [date, time]);

        return (
            <SafeAreaView style={{flex:1, backgroundColor:'#F5DFBB'}}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{flex: 1}}
                >
                    <ScrollView 
                        contentContainerStyle={{flexGrow: 1}}
                        keyboardShouldPersistTaps="handled"
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={{flex:1, alignItems:'center'}}>
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
        
        <TextInput 
            placeholder='Enter Task' 
            style={{backgroundColor:'#fff',width:'90%',}}  
            hitSlop={{size:40}}
            returnKeyType="next"
        />
        </View>
                                </View>
        {/* Reminder Date */}
                                <View style={{ alignItems:'center' }}>
                                <Text style={{fontSize:17, color:'#2A0800', fontWeight:500, width:'87%'}}>
                                Reminder Date    
                                </Text>
                                <TouchableOpacity 
            onPress={() => setShowDatePicker(true)}
            style={{backgroundColor:'#fff', width:'90%',padding:Platform.OS === 'ios' ? 20 : 6, paddingLeft:20, borderRadius:20, flexDirection:'row', gap:10, alignItems:'center', marginVertical:10, justifyContent:'space-between', paddingRight:Platform.OS === 'ios' ? 20 : 20}}>
            <Text style={{color: displayDate ? '#000' : '#666'}}>
                {displayDate || 'Select Date'}
            </Text>
            <FontAwesome5 name="calendar" size={Platform.OS === 'ios' ? 24 : 18} color="#2A0800" />
        </TouchableOpacity>
                                </View>
                                {/* Date Picker */}
    {Platform.OS === 'ios' ? (
        <Modal
            animationType="fade"
            transparent={true}
            visible={showDatePicker}
            onRequestClose={() => setShowDatePicker(false)}
        >
            <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <TouchableWithoutFeedback>
                        <View style={{
                            backgroundColor: 'white',
                            borderRadius: 20,
                            padding: 20,
                            width: '90%',
                            maxWidth: 400,
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 20,
                                paddingHorizontal: 10,
                            }}>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: '600',
                                    color: '#2A0800',
                                }}>Select Date</Text>
                                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                    <Text style={{
                                        fontSize: 16,
                                        color: '#FC5007',
                                        fontWeight: '600',
                                    }}>Done</Text>
                                </TouchableOpacity>
                            </View>
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="spinner"
                                onChange={onDateChange}
                                minimumDate={today}
                                style={{ backgroundColor: 'white' }}
                                textColor="#000000"
                                themeVariant="light"
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    ) : (
        showDatePicker && (
            <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={today}
            />
        )
    )}
                                {/* Reminder Time */}
                                <View style={{ alignItems:'center' }}>
                                <Text style={{fontSize:17, color:'#2A0800', fontWeight:500, width:'87%'}}>
                                Reminder Time    
                                </Text>
                                <TouchableOpacity 
                                    onPress={() => setShowTimePicker(true)}
                                    style={{
                                        backgroundColor:'#fff', 
                                        width:'90%', 
                                        padding:Platform.OS === 'ios' ? 20 : 6, 
                                        paddingLeft:20, 
                                        borderRadius:20, 
                                        flexDirection:'row', 
                                        gap:10, 
                                        alignItems:'center', 
                                        marginVertical:10, 
                                        justifyContent:'space-between', 
                                        paddingRight:Platform.OS === 'ios' ? 20 : 20
                                    }}
                                >
                                    <Text style={{color: displayTime ? '#000' : '#666'}}>
                                        {displayTime || 'Select Time'}
                                    </Text>
                                    <AntDesign name="clockcircleo" size={Platform.OS === 'ios' ? 24 : 18} color="#2A0800" />
                                </TouchableOpacity>
                                </View>
                                {/* Time Picker */}
                                {Platform.OS === 'ios' ? (
                                    <Modal
                                        animationType="fade"
                                        transparent={true}
                                        visible={showTimePicker}
                                        onRequestClose={() => setShowTimePicker(false)}
                                    >
                                        <TouchableWithoutFeedback onPress={() => setShowTimePicker(false)}>
                                            <View style={{
                                                flex: 1,
                                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}>
                                                <TouchableWithoutFeedback>
                                                    <View style={{
                                                        backgroundColor: 'white',
                                                        borderRadius: 20,
                                                        padding: 20,
                                                        width: '90%',
                                                        maxWidth: 400,
                                                    }}>
                                                        <View style={{
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            marginBottom: 20,
                                                            paddingHorizontal: 10,
                                                        }}>
                                                            <Text style={{
                                                                fontSize: 18,
                                                                fontWeight: '600',
                                                                color: '#2A0800',
                                                            }}>Select Time</Text>
                                                            <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                                                                <Text style={{
                                                                    fontSize: 16,
                                                                    color: '#FC5007',
                                                                    fontWeight: '600',
                                                                }}>Done</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                        <DateTimePicker
                                                            value={time}
                                                            mode="time"
                                                            display="spinner"
                                                            onChange={onTimeChange}
                                                            style={{ backgroundColor: 'white' }}
                                                            textColor="#000000"
                                                            themeVariant="light"
                                                        />
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </Modal>
                                ) : (
                                    showTimePicker && (
                                        <DateTimePicker
                                            value={time}
                                            mode="time"
                                            display="default"
                                            onChange={onTimeChange}
                                        />
                                    )
                                )}
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
                                    returnKeyType="done"
                                    blurOnSubmit={true}
                                    onSubmitEditing={Keyboard.dismiss}
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
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </SafeAreaView>
                )
    }

    export default NewTask
