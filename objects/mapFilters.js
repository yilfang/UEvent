import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AppContext from './AppContext';
import { Ionicons } from '@expo/vector-icons';

export default function mapFilters({ navigation, searchParams, visible }) {
    const myContext = useContext(AppContext);
    const catlength = searchParams.Categories.length;
    const timeFilterValue = searchParams.TimeRange.value;
    const showDefault = myContext.resetFindScreen;

    const clearFilters = () => {
        if (catlength != 0 || timeFilterValue != 'Anytime') {
            searchParams.Categories.length = 0;
            searchParams.TimeRange = { startTime: '', endTime: '', value: 'Anytime' };
            searchParams.OtherFilters = [];
            searchParams.SearchType = 'text';

            if (searchParams.SearchText == '')
                searchParams.SearchType = 'none';

            searchParams.CloseBotSheet = true;
            navigation.navigate('MainScreen', searchParams);
        }
    }
    const pressHandler = (screenName) => {
        myContext.toggleShowNavBar(false);
        navigation.navigate(screenName, searchParams);
    }
    if (visible) {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={[styles.filterButton, { backgroundColor: timeFilterValue == 'Anytime' ? 'white' : '#0085ff' }]} onPress={() => pressHandler('DateRange')}>
                    <Image source={require('../assets/time.png')} style={[styles.icon, { tintColor: showDefault || timeFilterValue == 'Anytime' ? 'black' : 'white' }]} />
                    {timeFilterValue == 'Anytime' ? <Text style={styles.filterText}>Date/Time</Text> :
                        timeFilterValue == 'Custom Date/Time Range' ? <Text style={[styles.filterText, { color: 'white' }]}>Custom Date/Time</Text> :
                            <Text style={[styles.filterText, { color: 'white' }]}>{timeFilterValue}</Text>}
                    <Ionicons name='ios-chevron-down' size={16} style={[styles.arrow, { color: timeFilterValue == 'Anytime' ? 'black' : 'white' }]} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.filterButton, { backgroundColor: catlength == 0 ? 'white' : '#0085ff' }]} onPress={() => pressHandler('CategoryList')}>
                    <Image source={require('../assets/categories.png')} style={[styles.icon, { tintColor: showDefault || catlength == 0 ? 'black' : 'white', }]} />
                    {catlength == 0 ? <Text style={styles.filterText}>Categories</Text> :
                        catlength > 1 ? <Text style={[styles.filterText, { color: 'white' }]}>{catlength} Categories</Text> :
                            <Text style={[styles.filterText, { color: 'white' }]}>1 Category</Text>}
                    <Ionicons name='ios-chevron-down' size={16} style={[styles.arrow, { color: catlength == 0 ? 'black' : 'white' }]} />
                </TouchableOpacity>
                {/*
                <TouchableOpacity style = {styles.clearButton} onPress = {clearFilters}>
                    <Text style = {[styles.filterText,{color:'white'}]}>Clear</Text>
                </TouchableOpacity>
                */}
            </View>
        );
    }
    else {
        return null;
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginLeft: 20,
        marginTop: 5,
    },
    filterButton: {
        flexDirection: 'row',
        backgroundColor: '#fafafa',
        alignItems: 'center',
        marginRight: 5,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    filterText: {
        fontSize: 15,
        fontWeight: '500',
        color: 'black',
        paddingVertical: 7,
        paddingHorizontal: 4,
    },
    icon: {
        width: 18,
        height: 18,
        marginLeft: 12,
        marginRight: 3,
        tintColor: 'black',
    },
    arrow: {
        marginRight: 7,
        //marginLeft: -2,
    },
    clearButton: {
        flexDirection: 'row',
        backgroundColor: 'red',
        alignItems: 'center',
        marginRight: 5,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
})