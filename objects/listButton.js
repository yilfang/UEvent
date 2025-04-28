import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';


export default function ProfileButton({ onPress, title, members }) {
    return (
        <View style={styles.block}>
            <TouchableOpacity onPress={onPress}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.button}>
                        <Text numberOfLines={1} style={styles.buttonText}> {title} </Text>
                        <View style={{ flexDirection: 'row', marginBottom: 5, marginLeft: 5 }}>
                            <Text numberOfLines={2} style={styles.membersText}>{members}</Text>
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
        paddingVertical: 8,
        marginLeft: 5,
    },
    button: {
        flex: 1,
    },
    icon: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    block: {
        backgroundColor: 'white',
        marginBottom: 5,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    membersText: {
        fontSize: 16,
        marginLeft: 5,
    },
})