import React from 'react';
import { Text, View, TouchableOpacity, Dimensions } from 'react-native';
import Globals from '../../GlobalVariables';

export default function DateButton({ name, value, pressHandler }) {
    return (
        <TouchableOpacity style={{
            justifyContent: 'center',
            marginHorizontal: 15,
            marginBottom: Globals.HR(50),
            width: Dimensions.get('window').width - 80
        }}
            onPress={() => { pressHandler(name) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{
                    fontSize: 25,
                    fontWeight: '600',
                    color: name == value ? '#fab400' : '#09189f',
                }}>{name}</Text>
            </View>
        </TouchableOpacity>
    );
}
