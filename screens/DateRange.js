import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, } from 'react-native';
import DateButton from '../objects/dateButton';
import BackButton from '../objects/backButton';
import Globals from '../../GlobalVariables';


export default function DateRange({ navigation, route }) {
    const backParams = route.params;
    const [value, setValue] = useState(backParams.TimeRange.value);

    useEffect(() => {
        setValue(backParams.TimeRange.value);
    }, [navigation, route]);

    const setParams = (startString, endString) => {
        backParams.TimeRange.startTime = startString.substr(0, 10) + ' ' + startString.substr(11, 8);
        backParams.TimeRange.endTime = endString.substr(0, 10) + ' ' + endString.substr(11, 8);
    }
    const setBounds = (value) => {
        const today = new Date();
        if (value == 'Today') {
            const startTime = new Date(today);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            //startTime.setHours(startTime.getHours() + 8); //offset by 8 due to server error
            tomorrow.setHours(3, 0, 0, 0); //3 AM bc of late-night partying
            //tomorrow.setHours(tomorrow.getHours() + 8);
            setParams(startTime.toISOString(), tomorrow.toISOString());
        }
        else if (value == 'Tomorrow') {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            const dayAfter = new Date(tomorrow);
            dayAfter.setDate(dayAfter.getDate() + 1);
            dayAfter.setHours(3, 0, 0, 0);
            //tomorrow.setHours(tomorrow.getHours() + 8);
            //dayAfter.setHours(dayAfter.getHours() + 8);
            setParams(tomorrow.toISOString(), dayAfter.toISOString());
        }
        else if (value == 'This Week') {
            const nextWeek = new Date(today);
            nextWeek.setDate(nextWeek.getDate() + 8);
            nextWeek.setHours(3, 0, 0, 0);
            const startTime = new Date(today);
            //startTime.setHours(startTime.getHours() + 8);
            //nextWeek.setHours(nextWeek.getHours()+8)
            setParams(startTime.toISOString(), nextWeek.toISOString());
        }
        else if (value == 'This Weekend') { //Friday 8:00PM through Sunday 11:59PM
            const dayOfWeek = today.getDay();
            const startOfWeekend = new Date(today);
            const endOfWeekend = new Date(today);

            if (dayOfWeek == 0 || dayOfWeek == 6) { //Sunday or Saturday
                const endOffset = (7 - dayOfWeek) % 7;
                endOfWeekend.setDate(endOfWeekend.getDate() + endOffset);
                endOfWeekend.setHours(23, 59, 0, 0);
                //startOfWeekend.setHours(startOfWeekend.getHours() + 8);
                //endOfWeekend.setHours(endOfWeekend.getHours() + 8);
                setParams(startOfWeekend.toISOString(), endOfWeekend.toISOString());
            }
            else if (dayOfWeek == 5) {//Friday 
                if (today.getHours() < 20)
                    startOfWeekend.setHours(20, 0, 0, 0);

                endOfWeekend.setDate(endOfWeekend.getDate() + 2);
                endOfWeekend.setHours(23, 59, 0, 0);
                //startOfWeekend.setHours(startOfWeekend.getHours() + 8);
                //endOfWeekend.setHours(endOfWeekend.getHours() + 8);
                setParams(startOfWeekend.toISOString(), endOfWeekend.toISOString());
            }
            else { //Monday through Thursday
                const startOffset = 5 - dayOfWeek;
                startOfWeekend.setDate(startOfWeekend.getDate() + startOffset);
                startOfWeekend.setHours(20, 0, 0, 0);
                endOfWeekend.setDate(startOfWeekend.getDate() + 2);
                endOfWeekend.setHours(23, 59, 0, 0);
                //startOfWeekend.setHours(startOfWeekend.getHours() + 8);
                //endOfWeekend.setHours(endOfWeekend.getHours() + 8);
                setParams(startOfWeekend.toISOString(), endOfWeekend.toISOString());
            }
        }
        else if (value == 'Anytime') {
            backParams.TimeRange.startTime = '';
            backParams.TimeRange.endTime = '';
        }
    }
    const selectHandler = () => {
        backParams.TimeRange.value = value;
        setBounds(value);
        backParams.SearchType = 'filter';
        backParams.CloseBotSheet = true;
        backParams.CloseBotSheet2 = false;

        if (value == 'Anytime') {
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
    const pressHandler = (name) => {
        setValue(name);
    }
    const customPressHandler = (name) => {
        navigation.navigate('TimeRange', backParams);
    }
    const backHandler = () => {
        navigation.navigate('MainScreen', backParams);
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ backgroundColor: '#FFF', marginBottom: 30, }}>
                <View style={{ alignItems: 'center', marginLeft: 20, flexDirection: 'row' }}>
                    <BackButton onPress={backHandler} title='Date/Time' />
                </View>
                <View style={{ marginLeft: 35 }}>
                    <Text style={{
                        fontSize: 22,
                        color: '#434343',
                        fontWeight: 'bold',
                        marginTop: 28,
                        marginBottom: 7,
                    }}>Show Events Happening -</Text>
                </View>
            </View>
            <View style={styles.buttonContainer}>

                <DateButton name='Anytime' value={value} pressHandler={pressHandler} />
                <DateButton name='Today' value={value} pressHandler={pressHandler} />
                <DateButton name='Tomorrow' value={value} pressHandler={pressHandler} />
                <DateButton name='This Week' value={value} pressHandler={pressHandler} />
                <DateButton name='This Weekend' value={value} pressHandler={pressHandler} />
                <DateButton name='Custom' value={value} pressHandler={customPressHandler} />

            </View>
            <TouchableOpacity onPress={selectHandler} style={{
                position: 'absolute',
                bottom: Globals.HR(70), alignSelf: 'center'
            }}>
                <View style={[styles.selectContainer]}>
                    <Text style={styles.selectText}>Select</Text>
                </View>
            </TouchableOpacity>
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
        alignItems: 'center',
        marginBottom: 40,
    },
    backText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#0085ff',
        left: 23,
        marginRight: 108,
    },
    headerText: {
        fontWeight: '600',
        fontSize: 22,
        marginVertical: 15,
    },
    introText: {
        fontSize: 20,
        fontWeight: '500',
        marginLeft: 97,
        marginBottom: 60,
    },
    buttonContainer: {
        alignItems: 'flex-start',
        marginLeft: 20,
        marginRight: 20
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
