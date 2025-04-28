import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Text, View } from 'react-native';


export default function CreateListButton({ onPress, numPersons }) {

    return (
        <TouchableOpacity style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFF',
            shadowColor: '#000',
            width: 120,
            borderRadius: 20,
            justifyContent: 'center',
            height: 40,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1,
        }}
            onPress={onPress}>
            <View style={{ padding: 7, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ justifyContent: 'center', marginRight: 10, color: '#FFCB05', fontWeight: 'bold', fontSize: 14 }}>Invite</Text>
                <Image source={require('../assets/arrow.png')} style={{ width: 14, height: 14, tintColor: '#FFCB05', }} />
            </View>
        </TouchableOpacity>

    );
}
const styles = StyleSheet.create({
    buttonText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#434343',
        marginBottom: 5,
        marginTop: 5,
    },
    button: {
        flex: 1,
    },
    icon: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
})