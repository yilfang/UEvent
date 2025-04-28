import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

export default function SendButton({ onPress }) {
    return (
        <TouchableOpacity style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: '#000',
            width: 120,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#434343',
            justifyContent: 'center',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1,
        }}
            onPress={onPress}>
            <View style={{ padding: 7, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ justifyContent: 'center', marginRight: 5, fontWeight: 'bold', color: '#434343', fontSize: 12 }}>ADD MORE</Text>
            </View>
        </TouchableOpacity>
    );
}