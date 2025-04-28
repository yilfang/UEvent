import React, { useState } from 'react';
import { StyleSheet, Image } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';


export default function PersonSearchBar({ navigation, parentScreen }) {
    const [iconColor, setIconColor] = useState('#adadad');
    const [searchText, setSearchText] = useState('');

    const clear = () => {
        setSearchText('');
        // searchParams.SearchText = '';
        // navigation.navigate(parentScreen,searchParams)
    }
    const submit = () => {
        // searchParams.SearchText = searchText;
        // navigation.navigate(parentScreen,searchParams);
    }
    return (
        <SearchBar
            //ref={search => this.search = search}
            placeholder='Search names or emails'
            value={searchText}
            onChangeText={(search) => setSearchText(search)}
            onSubmitEditing={submit}
            autoCorrect={false}
            inputStyle={styles.input}
            inputContainerStyle={styles.inputContainer2}
            containerStyle={styles.searchContainer1}
            searchIcon={<Image source={require('../assets/search.png')} style={{ width: 26, height: 27, tintColor: iconColor, marginLeft: 2, }} />}
            clearIcon={<Ionicons name='close-outline' size={28} color={iconColor} onPress={clear} />}
        />
    );

}

const styles = StyleSheet.create({
    headerContainer1: {

    },
    headerContainer2: {
        backgroundColor: 'white',
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
        marginTop: 10,
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
