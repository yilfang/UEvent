import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, Keyboard, Dimensions, FlatList, TouchableOpacity, SliderBase } from 'react-native';
import AppContext from './AppContext';
import { SearchBar } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import MapFilters from './mapFilters';

export default function mapSearchBar({ navigation, route, searchDefaultParams }) {
    const myContext = useContext(AppContext);
    const [iconColor, setIconColor] = useState('#adadad');
    const [pressed, setPressed] = useState(false);
    /*
    const backParams = {
        SearchType: searchDefaultParams.SearchType,
        SearchText: searchDefaultParams.SearchText,
        Categories: JSON.parse(JSON.stringify(searchDefaultParams.Categories)),
        TimeRange: JSON.parse(JSON.stringify(searchDefaultParams.TimeRange)),
        OtherFilters: JSON.parse(JSON.stringify(searchDefaultParams.OtherFilters)),
        CloseBotSheet: searchDefaultParams.CloseBotSheet,
        CloseBotSheet2: searchDefaultParams.CloseBotSheet2,
    }*/
    const backParams = route.params;
    //const [searchText, setSearchText] = useState(backParams.SearchText);

    const clearHandler = () => {
        backParams.SearchText = '';
        backParams.CloseBotSheet = true;
        backParams.CloseBotSheet2 = false;
        backParams.SearchType = 'filter';

        if (backParams.Categories.length == 0 && backParams.TimeRange.startTime == '' &&
            backParams.TimeRange.endTime == '') {
            backParams.SearchType = 'none';
            backParams.CloseBotSheet2 = true;
        }
        /*
        if(backParams.BotSheetInfo.snapPos == 0) {
            myContext.toggleShowNavBar(true);
        }
        */
        navigation.navigate('MainScreen', backParams);
    }
    const submitHandler = (searchText) => {
        backParams.SearchType = 'text';
        backParams.CloseBotSheet2 = false;

        if (searchText == '') {
            if (backParams.Categories.length == 0 && backParams.TimeRange.startTime == '' &&
                backParams.TimeRange.endTime == '') {
                backParams.SearchType = 'none';
                backParams.CloseBotSheet2 = true;
            }
            else
                backParams.SearchType = 'filter';
        }
        backParams.SearchText = searchText;
        backParams.CloseBotSheet = true;
        navigation.navigate('MainScreen', backParams);
    }
    const onFocusHandler = () => {
        setPressed(true);
    }
    return (
        <View style={pressed ? styles.headerContainer2 : styles.headerContainer1}>
            <SearchBar
                ref={search => this.search = search}
                placeholder='Search Here'
                onChangeText={(search) => { myContext.changeMapSearchText(search) }}
                value={myContext.mapSearchText}
                onSubmitEditing={() => { setPressed(false); submitHandler(myContext.mapSearchText) }}
                autoCorrect={false}
                onFocus={onFocusHandler}

                inputStyle={styles.input}
                inputContainerStyle={pressed ? styles.inputContainer1 : styles.inputContainer2}
                containerStyle={pressed ? styles.searchContainer2 : styles.searchContainer1}
                searchIcon={pressed ? <Ionicons name='chevron-back' size={30} color={iconColor} onPress={() => { Keyboard.dismiss(); myContext.changeMapSearchText(searchDefaultParams.SearchText); setPressed(false); }} /> :
                    <Image source={require('../assets/search.png')} style={{ width: 26, height: 27, tintColor: iconColor, marginLeft: 2, }} />}
                clearIcon={<Ionicons name='close-outline' size={28} color={iconColor} onPress={() => {this.search.clear();clearHandler()}} />}
            />
            <MapFilters navigation={navigation} searchParams={backParams} visible={!pressed} />
            {
                <View style={{
                    opacity: pressed ? 1.0 : 0.0, height: pressed ? Dimensions.get('window').height : 0,
                    backgroundColor: 'white', zIndex: 2,
                }}>
                    <Text style={styles.suggestionsText}>Suggestions</Text>
                    {
                    <FlatList
                        data = {myContext.eventList} 
                        renderItem = {({item}) => {
                            if(myContext.mapSearchText != '' && item.name.toLowerCase().indexOf(myContext.mapSearchText.toLowerCase()) != -1)
                            return (
                                <TouchableOpacity onPress = {() => {
                                    myContext.changeMapSearchText(item.name);
                                    Keyboard.dismiss();
                                    setPressed(false);
                                    submitHandler(item.name);
                                }}>
                                    <View style = {{borderBottomColor: '#d3d3d3', borderBottomWidth:1.5, justifyContent:'center'}}>
                                        <Text style = {{fontWeight:'500',fontSize:16,opacity:0.8,paddingVertical:20}}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                        keyExtractor = {item => item.id.toString()}
                        contentContainerStyle = {{
                            marginLeft: 23,
                            marginTop: 10,
                            height: 100,
                        }}
                        keyboardShouldPersistTaps = 'always'
                        scrollEnabled = {false}
                    />
                    }
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer1: {

    },
    headerContainer2: {
        backgroundColor: 'white',
        marginTop: -50,
    },
    searchContainer1: {
        justifyContent: 'flex-start',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 15,
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    searchContainer2: {
        justifyContent: 'flex-start',
        marginTop: 60,
        marginLeft: 10,
        marginRight: 15,
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
    },
    input: {
        color: '#000000',
    },
    inputContainer1: {
        borderRadius: 24,
        borderColor: '#e2e2e2',
        backgroundColor: '#ffffff',
        borderWidth: 1.5,
        borderBottomWidth: 1.5,
        height: 45,
    },
    inputContainer2: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        height: 45,
    },
    close: {
        position: 'absolute',
        left: 360,
        top: 6,
    },
    suggestionsText: {
        fontSize: 18,
        fontWeight: '500',
        marginLeft: 20.4,
        marginTop: 15,
    },
})