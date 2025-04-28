import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
export default function CheckBox({ title, value, onPress }) {

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.container}>
                <View style={{ borderWidth: 2, borderColor: value ? '#0085ff' : 'gray', borderRadius: 3, height: 24, width: 24, backgroundColor: value ? '#0085ff' : '#fffbf2', }}>
                    {value ? <Ionicons name='checkmark-sharp' color='white' size={27} style={{ marginTop: -4, marginLeft: -3 }} /> : <Text></Text>}
                </View>
                <Text style={{ marginLeft: 15, fontSize: 16, fontWeight: '500', color: value ? '#0085ff' : '#000000' }}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
})