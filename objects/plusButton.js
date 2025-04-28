import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

export default function PlusButton({ onPress }) {
    return (
        <TouchableOpacity style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1,
        }}
            onPress={onPress}>
            <Image source={require('../assets/plus.png')} style={{ width: 60, height: 60, tintColor: 'gold', }} />
        </TouchableOpacity>

    );
}