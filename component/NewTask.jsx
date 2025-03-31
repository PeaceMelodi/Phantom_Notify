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
    import { useTheme } from '../context/ThemeContext'
    import { useNavigation } from '@react-navigation/native';
    import { useTasks } from '../context/TasksContext';

    const NewTask = ({ route }) => {
        const { colors } = useTheme();
        const navigation = useNavigation();
        const { addTask, editTask } = useTasks();
        
        // Get task data if editing
        const editingTask = route.params?.task;
        const isEditing = route.params?.isEditing || false;

        // Initialize state with existing task data if editing
        const [taskTitle, setTaskTitle] = useState(editingTask?.title || '');
        const [note, setNote] = useState(editingTask?.note || '');
        
        // Initialize date and time
        const [date, setDate] = useState(editingTask ? new Date(editingTask.date) : new Date());
        const [time, setTime] = useState(editingTask ? new Date(editingTask.time) : new Date());
        
        const [displayDate, setDisplayDate] = useState(
            editingTask?.date ? 
            new Date(editingTask.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }) : 
            new Date().toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            })
        );
        
        const [displayTime, setDisplayTime] = useState(
            editingTask?.time ? 
            new Date(editingTask.time).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }) : 
            new Date().toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })
        );

        const [showDatePicker, setShowDatePicker] = useState(false);
        const [showTimePicker, setShowTimePicker] = useState(false);

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

        const handleSave = () => {
            if (!taskTitle.trim()) return;
            
            const taskData = {
                title: taskTitle,
                dueDate: `${displayDate} ${displayTime}`,
                date: date,
                time: time,
                note: note
            };

            if (isEditing) {
                editTask(editingTask.id, taskData);
            } else {
                addTask({
                    ...taskData,
                    id: Date.now().toString(),
                });
            }
            
            navigation.navigate('MainPage');
        };

        // Add handleClear function
        const handleClear = () => {
            setTaskTitle('');
            setNote('');
            const now = new Date();
            setDate(now);
            setTime(now);
            setDisplayDate(now.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }));
            setDisplayTime(now.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }));
        };

        return (
            <SafeAreaView style={{flex:1, backgroundColor: colors.background}}>
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
                            <View style={{ 
                                width:'100%',  
                                padding:30,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <TouchableOpacity 
                                    onPress={() => navigation.goBack()}
                                    style={{ marginRight: 30 }}
                                    hitSlop={40}
                                >
                                    <AntDesign name="left" size={24} color={colors.text} />
                                </TouchableOpacity>
                                <Text style={{
                                    fontSize:20, 
                                    color: colors.text, 
                                    fontWeight:500
                                }}>
                                    {isEditing ? 'Edit Task' : 'New Task'}
                                </Text>
                            </View>
                                {/* Body */}
                                <View style={{marginVertical:Platform.OS === 'ios' ? 10 : 0, gap:10,width:'100%',}}>
                                {/* Title */}
                                <View style={{ alignItems:'center' }}>
                                <Text style={{fontSize:17, color: colors.text, fontWeight:500, width:'87%'}}>
                                Title    
                                </Text>
                                <View style={{backgroundColor: colors.card,  padding:Platform.OS === 'ios' ? 5 : 6, paddingLeft:20, borderRadius:20, flexDirection:'row', gap:10, alignItems:'center', marginVertical:10}}>
        
        <TextInput 
            placeholder='Enter Task' 
            value={taskTitle}
            onChangeText={setTaskTitle}
            style={{backgroundColor: colors.card, width:'90%', color: colors.text, padding:Platform.OS === 'ios' ? 10 : 7}}  
            returnKeyType="done"
           
            placeholderTextColor={colors.text}
        />
        </View>
                                </View>
        {/* Reminder Date */}
                                <View style={{ alignItems:'center' }}>
                                <Text style={{fontSize:17, color: colors.text, fontWeight:500, width:'87%'}}>
                                Reminder Date    
                                </Text>
                                <TouchableOpacity 
            onPress={() => setShowDatePicker(true)}
            style={{backgroundColor: colors.card, width:'90%',padding:Platform.OS === 'ios' ? 20 : 6, paddingLeft:20, borderRadius:20, flexDirection:'row', gap:10, alignItems:'center', marginVertical:10, justifyContent:'space-between', paddingRight:Platform.OS === 'ios' ? 20 : 20}}>
            <Text style={{color: displayDate ? colors.text : colors.placeholder}}>
                {displayDate || 'Select Date'}
            </Text>
            <FontAwesome5 name="calendar" size={Platform.OS === 'ios' ? 24 : 18} color={colors.icon} />
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
                                    color: colors.text,
                                }}>Select Date</Text>
                                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                    <Text style={{
                                        fontSize: 16,
                                        color: colors.accent,
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
                                <Text style={{fontSize:17, color: colors.text, fontWeight:500, width:'87%'}}>
                                Reminder Time    
                                </Text>
                                <TouchableOpacity 
                                    onPress={() => setShowTimePicker(true)}
                                    style={{
                                        backgroundColor: colors.card, 
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
                                    <Text style={{color: displayTime ? colors.text : colors.placeholder}}>
                                        {displayTime || 'Select Time'}
                                    </Text>
                                    <AntDesign name="clockcircleo" size={Platform.OS === 'ios' ? 24 : 18} color={colors.icon} />
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
                                                                color: colors.text,
                                                            }}>Select Time</Text>
                                                            <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                                                                <Text style={{
                                                                    fontSize: 16,
                                                                    color: colors.accent,
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
                                <Text style={{fontSize:17, color: colors.text, fontWeight:500, width:'87%'}}>
                                Additional Note <Text style={{fontSize:10, color: colors.text}}>(optional)</Text>
                                </Text>
                                <View style={{
                                backgroundColor: colors.card,  
                                padding:10, 
                                paddingLeft:20, 
                                borderRadius:20, 
                                marginVertical:10, 
                                width: '90%'
                                }}>
        
                                <TextInput 
                                    placeholder='Write Something....' 
                                    value={note}
                                    onChangeText={setNote}
                                    style={{
                                    backgroundColor: colors.card, 
                                    width:'100%',
                                    height: Platform.OS === 'ios' ? 120 : 100,
                                    textAlignVertical: 'top',
                                    paddingTop: 10,
                                    color: colors.text
                                    }}  
                                    multiline={true}
                                    numberOfLines={5}
                                    returnKeyType="done"
                                    blurOnSubmit={true}
                                    onSubmitEditing={Keyboard.dismiss}
                                    placeholderTextColor={colors.text}
                                />

                                </View>
                                </View>
                                </View>
                                {/* Footer */}
                                <View style={{flexDirection:'row', gap:10}}>
        <TouchableOpacity 
            style={{
                backgroundColor: colors.accent,
                padding:13,
                borderRadius:20,
                width:'40%',
                alignItems:'center',
                justifyContent:'center'
            }}
            onPress={handleSave}
        >
            <Text style={{color: colors.card}}>
                {isEditing ? 'Update' : 'Save'}
            </Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={{
                backgroundColor: colors.card,
                padding:13,
                borderRadius:20,
                width:'40%',
                alignItems:'center',
                justifyContent:'center',
                borderColor: colors.accent,
                borderWidth:2
            }}
            onPress={handleClear}
        >
            <Text style={{ color: colors.accent }}>
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
