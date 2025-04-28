import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';


export default function ProfileButton({ onPress, name, email }) {

    return (
        <View style={{
            backgroundColor: 'white',
            marginBottom: 5,
            borderRadius: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1,
        }}>
            <TouchableOpacity onPress={onPress}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}> {name} </Text>
                        <View style={{ flexDirection: 'row', marginBottom: 5, marginLeft: 5 }}>
                            <Text numberOfLines={1}>{email}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>

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