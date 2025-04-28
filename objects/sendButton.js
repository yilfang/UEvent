import React from 'react';
import { Image, TouchableOpacity, Text, View } from 'react-native';

export default function SendButton({ onPress }) {
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
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1,
        }}
            onPress={onPress}>
            <View style={{ padding: 7, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ justifyContent: 'center', marginRight: 10, color: '#ffcb05', fontWeight: 'bold', fontSize: 14, paddingVertical: 3, }}>INVITE ALL</Text>
                <Image source={require('../assets/arrow.png')} style={{ width: 14, height: 14, tintColor: '#ffcb05', }} />
            </View>
        </TouchableOpacity>
    );
}