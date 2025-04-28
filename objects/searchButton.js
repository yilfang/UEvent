import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function SearchButton({ onPress }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.searchButton}>
                <Image
                    source={require('../assets/search_icon.png')}
                    style={{ width: 25, height: 25, tintColor: '#00274C' }}
                />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    searchButton: {
        flex: 1
    }
})