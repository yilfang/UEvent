import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function ProfileButton({ onPress, title }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.button}>
                <Text style={styles.buttonText}> {title} </Text>
                <View style={styles.icon}>
                    <AntDesign name='right' size={24} color='#434343' />
                </View>
            </View>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    buttonText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#434343',
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#cdcdcd',
        flexDirection: 'row',
        width: '100%',
        height: 57,
    },
    icon: {
        flex: 1,
        marginTop: 1,
        alignItems: 'flex-end',
    }
})