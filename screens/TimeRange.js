import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import BackButton from '../objects/backButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import Globals from '../../GlobalVariables';

export default function TimeRange({ navigation, route }) {
    const backParams = route.params;
    const makeDate = (dateString) => { //convert from UTC to EST as well
        const utcDate = new Date(dateString.substr(0, 10) + 'T' + dateString.substr(11, 8));
        utcDate.setHours(utcDate.getHours() - 4);
        return utcDate;
    }
    const today = new Date();
    const [startDate, setStartDate] = useState(backParams.TimeRange.startTime == '' ? today : makeDate(backParams.TimeRange.startTime));
    const [endDate, setEndDate] = useState(backParams.TimeRange.endTime == '' ? 'Anytime' : makeDate(backParams.TimeRange.endTime));
    const [startTime, setStartTime] = useState(backParams.TimeRange.startTime == '' ? today : makeDate(backParams.TimeRange.startTime));
    const [endTime, setEndTime] = useState(backParams.TimeRange.endTime == '' ? 'Anytime' : makeDate(backParams.TimeRange.endTime));

    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [show4, setShow4] = useState(false);

    const dateFormatter = (dateString) => {
        if (dateString == 'Anytime')
            return <Text style={styles.dateText}>Anytime</Text>
        return (
            <Text style={styles.dateText}>{dateString.substring(0, 3) + ', ' + dateString.substring(4, dateString.indexOf(':') - 8) + ', ' +
                dateString.substring(dateString.indexOf(':') - 7, dateString.indexOf(':') - 3)} </Text>
        );
    }
    const timeFormatter = (timeString) => {
        if (timeString == 'Anytime')
            return <Text style={styles.dateText}>Anytime</Text>
        const startIndex = timeString.indexOf(':') - 2;
        let hour = parseInt(timeString.substring(startIndex, startIndex + 2));
        let post = 'AM';
        if (hour >= 12) {
            post = 'PM';
            if (hour > 12)
                hour -= 12;
        }
        else if (hour == 0) {
            hour = 12;
        }
        return (
            <Text style={styles.dateText}>{hour.toString() + timeString.substring(startIndex + 2, startIndex + 5) + ' ' + post}</Text>
        );
    }
    const backHandler = () => {
        navigation.goBack();
    }
    const selectHandler = () => {
        let start = startTime;
        let end = endTime;

        if (start == 'Anytime') {
            start = new Date().toISOString().substr(11, 8);
        }
        else {
            start = start.toISOString().substr(11, 8);
        }
        if (end == 'Anytime') {
            const newEnd = new Date();
            newEnd.setHours(19, 59, 59, 0);
            end = newEnd.toISOString().substr(11, 8);
        }
        else {
            end = end.toISOString().substr(11, 8);
        }
        backParams.TimeRange.startTime = startDate.toISOString().substr(0, 10) + ' ' + start;

        if (endDate != 'Anytime') {
            backParams.TimeRange.endTime = endDate.toISOString().substr(0, 10) + ' ' + end;
        }
        else {
            backParams.TimeRange.endTime = '';
        }
        backParams.TimeRange.value = 'Custom';
        backParams.SearchType = 'filter';
        backParams.CloseBotSheet = true;
        backParams.CloseBotSheet2 = false;

        if (startDate == today && startTime == today && endDate == 'Anytime' && endTime == 'Anytime') {
            backParams.TimeRange.value = 'Anytime';
            if (backParams.Categories.length == 0) {
                if (backParams.SearchText == '') {
                    backParams.SearchType = 'none';
                    backParams.CloseBotSheet2 = true;
                }
                else
                    backParams.SearchType = 'text';
            }
            else
                backParams.SearchType = 'filter';
        }
        navigation.navigate('MainScreen', backParams);
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <BackButton onPress={backHandler} title='Custom' />
            </View>
            <Text style={{ marginBottom: Globals.HR(75) }}></Text>
            <View style={styles.pickerContainer}>
                <TouchableOpacity onPress={() => setShow1(true)}>
                    <Text style={styles.labelText}>Start Date</Text>
                    {dateFormatter(startDate.toString())}
                </TouchableOpacity>
            </View>
            <View style={styles.pickerContainer}>
                <TouchableOpacity onPress={() => setShow3(true)}>
                    <Text style={styles.labelText}>Start Time</Text>
                    <Text>{timeFormatter(startTime.toString())}</Text>
                </TouchableOpacity>
            </View>
            <Text style={{ marginBottom: Globals.HR(65) }}></Text>
            <View style={styles.pickerContainer}>
                <TouchableOpacity onPress={() => setShow2(true)}>
                    <Text style={styles.labelText}>End Date</Text>
                    {dateFormatter(endDate.toString())}
                </TouchableOpacity>
            </View>
            <View style={styles.pickerContainer}>
                <TouchableOpacity onPress={() => setShow4(true)}>
                    <Text style={styles.labelText}>End Time</Text>
                    <Text>{timeFormatter(endTime.toString())}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={selectHandler} style={{
                position: 'absolute',
                bottom: Globals.HR(70), alignSelf: 'center'
            }}>
                <View style={[styles.selectContainer]}>
                    <Text style={styles.selectText}>Select</Text>
                </View>
            </TouchableOpacity>

            <Modal visible={show1} transparent={true} animationType='slide'>
                <View style={styles.dateModal}>
                    <TouchableOpacity onPress={() => setShow1(false)}>
                        <View style={{ backgroundColor: '#d7d7d7', alignItems: 'flex-end', width: '100%' }}>
                            <Text style={{ fontSize: 18, color: '#0085ff', paddingVertical: 8, marginHorizontal: 15 }}>Done</Text>
                        </View>
                    </TouchableOpacity>
                    <DateTimePicker
                        testID = "dateTimePicker"
                        mode="date"
                        value={startDate == 'Anytime' ? today : startDate}
                        onChange={(event, selectedDate) => setStartDate(selectedDate)}
                        minimumDate={new Date()}
                        display = 'spinner'
                        textColor = 'black'
                    />
                </View>
            </Modal>
            <Modal visible={show2} transparent={true} animationType='slide'>
                <View style={styles.dateModal}>
                    <TouchableOpacity onPress={() => setShow2(false)}>
                        <View style={{ backgroundColor: '#d7d7d7', alignItems: 'flex-end', width: '100%' }}>
                            <Text style={{ fontSize: 18, color: '#0085ff', paddingVertical: 8, marginHorizontal: 15 }}>Done</Text>
                        </View>
                    </TouchableOpacity>
                    <DateTimePicker
                        testID = "dateTimePicker"
                        mode="date"
                        value={endDate == 'Anytime' ? today : endDate}
                        onChange={(event, selectedDate) => setEndDate(selectedDate)}
                        minimumDate={new Date()}
                        display = "spinner"
                        textColor = 'black'
                    />
                </View>
            </Modal>
            <Modal visible={show3} transparent={true} animationType='slide'>
                <View style={styles.dateModal}>
                    <TouchableOpacity onPress={() => setShow3(false)}>
                        <View style={{ backgroundColor: '#d7d7d7', alignItems: 'flex-end', width: '100%' }}>
                            <Text style={{ fontSize: 18, color: '#0085ff', paddingVertical: 8, marginHorizontal: 15 }}>Done</Text>
                        </View>
                    </TouchableOpacity>
                    <DateTimePicker
                        testID = "dateTimePicker"
                        mode="time"
                        value={startTime == 'Anytime' ? today : startTime}
                        onChange={(event, selectedTime) => setStartTime(selectedTime)}
                        display = "spinner"
                        textColor = 'black'
                    />
                </View>
            </Modal>
            <Modal visible={show4} transparent={true} animationType='slide'>
                <View style={styles.dateModal}>
                    <TouchableOpacity onPress={() => setShow4(false)}>
                        <View style={{ backgroundColor: '#d7d7d7', alignItems: 'flex-end', width: '100%' }}>
                            <Text style={{ fontSize: 18, color: '#0085ff', paddingVertical: 8, marginHorizontal: 15 }}>Done</Text>
                        </View>
                    </TouchableOpacity>
                    <DateTimePicker
                        testID = "dateTimePicker"
                        mode="time"
                        value={endTime == 'Anytime' ? today : endTime}
                        onChange={(event, selectedTime) => setEndTime(selectedTime)}
                        display = "spinner"
                        textColor = 'black'
                    />
                </View>
            </Modal>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        flexDirection: 'row',
        marginLeft: 20,
        alignItems: 'center',
    },
    pickerContainer: {
        marginLeft: 23,
        marginBottom: Globals.HR(25),
    },
    backText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#0085ff',
        left: 23,
        marginRight: 112,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 25,
        marginVertical: 15,
    },
    introText: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: Globals.HR(50),
        marginLeft: 23,
        marginBottom: 40,
    },
    labelText: {
        fontSize: 17,
        fontWeight: '500',
        opacity: 0.75,
        marginBottom: 5,
    },
    dateText: {
        fontSize: 21,
        fontWeight: '600',
        color: '#09189E',
    },
    dateModal: {
        height: '30%',
        marginTop: 'auto',
        backgroundColor: 'white',
    },

    selectContainer: {
        backgroundColor: '#ffffff',
        alignItems: 'center',
        shadowColor: "#000",
        width: 250,
        alignSelf: 'center',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 50,
    },

    selectText: {
        fontWeight: 'bold',
        fontSize: 26,
        paddingVertical: 10,
        color: '#fab400',
    },
})