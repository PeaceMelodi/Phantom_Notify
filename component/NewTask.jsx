import React, { useState, useEffect, useRef } from 'react'
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
    Modal,
    Alert,
    Animated
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, EvilIcons, Feather, MaterialCommunityIcons, FontAwesome5
} from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../context/ThemeContext'
import { useNavigation } from '@react-navigation/native';
import { useTasks } from '../context/TasksContext';

// Custom styled notification component
const CustomNotification = ({ visible, title, message, onClose, colors, selectedFont }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    
    useEffect(() => {
        if (visible) {
            // Start animation sequence when notification becomes visible
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                })
            ]).start();
            
            // Auto hide after 3 seconds
            const timer = setTimeout(() => {
                hideNotification();
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [visible]);
    
    const hideNotification = () => {
        // Animate out before closing
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 50,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start(() => {
            onClose();
        });
    };
    
    if (!visible) return null;
    
    return (
        <Animated.View
            style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 1000
            }}
        >
            <Animated.View
                style={{
                    width: '80%',
                    backgroundColor: colors.card,
                    borderRadius: 15,
                    padding: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                    <View style={{ 
                        backgroundColor: colors.accent,
                        borderRadius: 20,
                        width: 36,
                        height: 36,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12
                    }}>
                        <AntDesign name="clockcircle" size={20} color="white" />
                    </View>
                    <Text style={{ 
                        color: colors.text, 
                        fontWeight: 'bold', 
                        fontSize: 18,
                        flex: 1,
                        fontFamily: selectedFont
                    }}>
                        {title}
                    </Text>
                    <TouchableOpacity onPress={hideNotification}>
                        <AntDesign name="close" size={20} color={colors.text} />
                    </TouchableOpacity>
                </View>
                <Text style={{ 
                    color: colors.text, 
                    fontSize: 16, 
                    marginBottom: 10,
                    fontFamily: selectedFont
                }}>
                    {message}
                </Text>
            </Animated.View>
        </Animated.View>
    );
};

const NewTask = ({ route }) => {
    // Get theme colors from ThemeContext for styling
    const { colors, selectedFont } = useTheme();
    // Get navigation functions to move between screens
    const navigation = useNavigation();
    // Get task management functions from TasksContext
    const { addTask, editTask } = useTasks();
    
    // State for custom notification
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    
    // Check if we're editing an existing task by getting task data from navigation params
    // If route.params.task exists, we're editing. If not, we're creating new task
    const editingTask = route.params?.task;
    const isEditing = route.params?.isEditing || false;

    // State for task title - If editing, use existing title, otherwise empty string
    const [taskTitle, setTaskTitle] = useState(editingTask?.title || '');
    // State for task note - If editing, use existing note, otherwise empty string
    const [note, setNote] = useState(editingTask?.note || '');
    
    // Initialize date state:
    // If editing: use the task's existing date
    // If new task: use current date
    const [date, setDate] = useState(editingTask ? new Date(editingTask.date) : new Date());
    
    // Initialize time state similarly to date
    const [time, setTime] = useState(editingTask ? new Date(editingTask.time) : new Date());
    
    // State for displaying date in UK format (dd/mm/yyyy)
    // If editing: format the existing date
    // If new: format current date
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
    
    // State for displaying time in 12-hour format
    // Similar logic to displayDate
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

    // States to control visibility of date/time pickers
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Handler for when date is changed in picker
    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        // Prevent selecting past dates
        if (currentDate < now) {
            if (Platform.OS === 'android') {
                setShowDatePicker(false);
            }
            return;
        }
        
        // Update date and its display format
        setDate(currentDate);
        setDisplayDate(currentDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }));
        
        // If selected date is today, update time to current time
        if (currentDate.toDateString() === new Date().toDateString()) {
            const newTime = new Date();
            setTime(newTime);
            setDisplayTime(newTime.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }));
        }
        
        // Close picker on Android
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
    };

    // Handler for when time is changed in picker
    const onTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || time;
        const now = new Date();
        
        // If selected date is today, prevent selecting past times
        if (date.toDateString() === now.toDateString()) {
            // Create a comparison date with current date and selected time
            const selectedDateTime = new Date(date);
            selectedDateTime.setHours(
                currentTime.getHours(),
                currentTime.getMinutes(),
                currentTime.getSeconds()
            );
            
            // If time is not at least one minute in the future
            if (selectedDateTime <= now) {
                if (Platform.OS === 'android') {
                    setShowTimePicker(false);
                }
                
                // Set time to current time + 1 minute
                const newTime = new Date();
                newTime.setMinutes(newTime.getMinutes() + 1);
                newTime.setSeconds(0);
                
                setTime(newTime);
                setDisplayTime(newTime.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }));
                return;
            }
        }

        // Update time and its display format
        setTime(currentTime);
        setDisplayTime(currentTime.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }));

        // Close picker on Android
        if (Platform.OS === 'android') {
            setShowTimePicker(false);
        }
    };

    // Reference to today's date for minimum date validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Effect to automatically update time if selected date is today
    useEffect(() => {
        if (date.toDateString() === new Date().toDateString()) {
            // Update time every minute
            const intervalId = setInterval(() => {
                const now = new Date();
                // If current time is past selected time, update to current time
                if (time < now) {
                    setTime(now);
                    setDisplayTime(now.toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    }));
                }
            }, 60000); // Run every minute

            // Cleanup interval on component unmount or when dependencies change
            return () => clearInterval(intervalId);
        }
    }, [date, time]);

    // Calculate time remaining until the notification will be sent
    const getTimeRemaining = () => {
        const now = new Date().getTime();
        const scheduledDate = new Date(date);
        const scheduledTime = new Date(time);
        
        scheduledDate.setHours(
            scheduledTime.getHours(),
            scheduledTime.getMinutes(),
            scheduledTime.getSeconds(),
            0 // Reset milliseconds
        );
        
        // Calculate milliseconds until scheduled time
        const ms = scheduledDate.getTime() - now;
        
        if (ms <= 0) {
            return "immediately";
        }
        
        // Convert to readable format
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        const formattedTime = scheduledDate.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        
        if (days > 0) {
            return `in ${days} day${days > 1 ? 's' : ''} at ${formattedTime}`;
        } else if (hours > 0) {
            return `in ${hours} hour${hours > 1 ? 's' : ''} at ${formattedTime}`;
        } else if (minutes > 0) {
            return `in ${minutes} minute${minutes > 1 ? 's' : ''} at ${formattedTime}`;
        } else {
            return `in ${seconds} second${seconds > 1 ? 's' : ''} at ${formattedTime}`;
        }
    };

    // Handler for saving task
    const handleSave = async () => {
        // Don't save if title is empty
        if (!taskTitle.trim()) {
            Alert.alert("Error", "Task title cannot be empty");
            return;
        }
        
        // Check if the selected time is still in the future
        const now = new Date();
        const selectedDateTime = new Date(date);
        selectedDateTime.setHours(
            time.getHours(),
            time.getMinutes(),
            time.getSeconds()
        );
        
        // If time is no longer in the future, adjust it forward by 1 minute
        let updatedTime = time;
        let updatedDate = date;
        if (selectedDateTime <= now) {
            updatedTime = new Date();
            updatedTime.setMinutes(updatedTime.getMinutes() + 1);
            updatedTime.setSeconds(0);
            
            // Update display time
            setTime(updatedTime);
            setDisplayTime(updatedTime.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }));
            
            // If it's a different day, update the date too
            if (updatedTime.toDateString() !== date.toDateString()) {
                updatedDate = new Date(updatedTime);
                setDate(updatedDate);
                setDisplayDate(updatedDate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }));
            }
        }
        
        // Prepare task data with potentially adjusted time and date
        const taskData = {
            title: taskTitle,
            dueDate: `${displayDate} ${displayTime}`,
            date: updatedDate,
            time: updatedTime,
            note: note
        };

        try {
            // If editing, update existing task
            // If new, create new task with unique ID
            if (isEditing) {
                await editTask(editingTask.id, taskData);
                
                // Show custom notification
                setNotificationTitle("Task Updated");
                setNotificationMessage(`Your task will notify you ${getTimeRemaining()}`);
                setNotificationVisible(true);
                
                // Navigate back after a short delay
                setTimeout(() => {
                    navigation.navigate('MainPage');
                }, 1500);
            } else {
                await addTask({
                    ...taskData,
                    id: Date.now().toString(),
                });
                
                // Show custom notification
                setNotificationTitle("Task Created");
                setNotificationMessage(`Your task will notify you ${getTimeRemaining()}`);
                setNotificationVisible(true);
                
                // Navigate back after a short delay
                setTimeout(() => {
                    navigation.navigate('MainPage');
                }, 1500);
            }
        } catch (error) {
            Alert.alert("Error", "There was an error saving your task. Please try again.");
            console.error("Error saving task:", error);
        }
    };

    // Handler to clear all form fields
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
                                fontWeight:500,
                                fontFamily: selectedFont
                            }}>
                                {isEditing ? 'Edit Task' : 'New Task'}
                            </Text>
                        </View>
                            {/* Body */}
                            <View style={{marginVertical:Platform.OS === 'ios' ? 10 : 0, gap:10,width:'100%',}}>
                            {/* Title */}
                            <View style={{ alignItems:'center' }}>
                            <Text style={{fontSize:17, color: colors.text, fontWeight:500, width:'87%', fontFamily: selectedFont}}>
                            Title    
                            </Text>
                            <View style={{backgroundColor: colors.card,  padding:Platform.OS === 'ios' ? 5 : 6, paddingLeft:20, borderRadius:20, flexDirection:'row', gap:10, alignItems:'center', marginVertical:10}}>
    
    <TextInput 
        placeholder='Enter Task' 
        value={taskTitle}
        onChangeText={setTaskTitle}
        style={{backgroundColor: colors.card, width:'90%', color: colors.text, padding:Platform.OS === 'ios' ? 10 : 7, fontFamily: selectedFont}}  
        returnKeyType="done"
       
        placeholderTextColor={colors.text}
    />
    </View>
                            </View>
    {/* Reminder Date */}
                            <View style={{ alignItems:'center' }}>
                            <Text style={{fontSize:17, color: colors.text, fontWeight:500, width:'87%', fontFamily: selectedFont}}>
                            Reminder Date    
                            </Text>
                            <TouchableOpacity 
            onPress={() => setShowDatePicker(true)}
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
            <Text style={{
                color: displayDate ? colors.text : colors.placeholder,
                fontFamily: selectedFont
            }}>
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
                                fontFamily: selectedFont
                            }}>Select Date</Text>
                            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                <Text style={{
                                    fontSize: 16,
                                    color: colors.accent,
                                    fontWeight: '600',
                                    fontFamily: selectedFont
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
                            <Text style={{fontSize:17, color: colors.text, fontWeight:500, width:'87%', fontFamily: selectedFont}}>
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
                                <Text style={{
                                    color: displayTime ? colors.text : colors.placeholder,
                                    fontFamily: selectedFont
                                }}>
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
                                                            fontFamily: selectedFont
                                                        }}>Select Time</Text>
                                                        <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                                                            <Text style={{
                                                                fontSize: 16,
                                                                color: colors.accent,
                                                                fontWeight: '600',
                                                                fontFamily: selectedFont
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
                            <Text style={{fontSize:17, color: colors.text, fontWeight:500, width:'87%', fontFamily: selectedFont}}>
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
                                color: colors.text,
                                fontFamily: selectedFont
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
        <Text style={{color: colors.card, fontFamily: selectedFont}}>
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
        <Text style={{ color: colors.accent, fontFamily: selectedFont }}>
            Clear
        </Text>
    </TouchableOpacity>

                            </View>
                            </View>
                            </TouchableWithoutFeedback>
                        </ScrollView>
                    </KeyboardAvoidingView>
                    
                    {/* Custom notification */}
                    <CustomNotification
                        visible={notificationVisible}
                        title={notificationTitle}
                        message={notificationMessage}
                        onClose={() => setNotificationVisible(false)}
                        colors={colors}
                        selectedFont={selectedFont}
                    />
                </SafeAreaView>
            )
}

export default NewTask
