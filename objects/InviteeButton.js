import React from 'react';
import { Image, TouchableOpacity, Text } from 'react-native';

export default function InviteeButton({ onPress, Name }) {
    return (
        <TouchableOpacity style={{
            flexDirection: 'row',
            backgroundColor: '#fafafa',
            alignItems: 'center',
            marginRight: 10,
            marginBottom: 10,
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
            padding: 7, flexDirection: 'row', alignItems: 'center'
        }}
            onPress={onPress}>

            <Text style={{ marginRight: 10, color: '#FFCB05', fontWeight: 'bold', fontSize: 14 }}>{Name}</Text>
            <Image source={require('../assets/minus.png')} style={{ width: 14, height: 14, tintColor: '#FFCB05' }} />

        </TouchableOpacity>
    );
}
