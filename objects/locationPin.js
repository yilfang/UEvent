import React from 'react';
import { View, Image, StyleSheet, Text, Alert } from 'react-native';
import Globals from '../../GlobalVariables';


{/* Map marker icon */ }
export default function LocationPin({ title, mainCategory }) {
    const catName = mainCategory.replace(/\W/g, '');
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.titleText}>{title}</Text>
            </View>
            <View style={styles.triangle}>
            </View>
            <View style={{ alignItems: 'center' }}>
                <Image style={styles.mapMarkerStyle} source={require('../assets/placeholder.png')} />
                <Image source={Globals.categoryAssets[catName]} style={{ position: 'absolute', top: 5, width: 16, height: 16, tintColor: 'white' }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    mapMarkerStyle: {
        height: 35,
        width: 35,
        tintColor: 'red',
    },
    titleText: {
        fontSize: 11,
        fontWeight: '500',
        paddingHorizontal: 4,
        paddingVertical: 2,
        maxWidth: 120,
    },
    textContainer: {
        backgroundColor: 'white',
        borderRadius: 5,
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: 7,
        borderRightWidth: 7,
        borderBottomWidth: 0,
        borderLeftWidth: 7,
        borderTopColor: "white",
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        marginBottom: 0,
    },
})

