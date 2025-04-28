import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Text, View, Dimensions, } from 'react-native';
import Globals from '../../GlobalVariables';

export default function ProfileButton({ onPress, title, location, time }) {
    return (
        <View style={styles.block}>
            <TouchableOpacity onPress={onPress}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>{title}</Text>
                        <View style={{ flexDirection: 'column' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    source={require('../assets/MapMarker.png')}
                                    style={{ width: 24, height: 24, tintColor: 'orange', marginTop: -2, marginRight: -2 }}>
                                </Image>
                                <Text style={{
                                    marginBottom: 7, color: 'orange', fontSize: 16,
                                    fontWeight: '600', maxWidth: Globals.WR(Dimensions.get('window').width - 50)
                                }}>{location}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    source={require('../assets/CalendarIcon.png')}
                                    style={{ width: 16, height: 16, marginLeft: 5, tintColor: '#09189f' }}>
                                </Image>
                                <Text numberOfLines={1} style={{ marginBottom: 5, color: '#09189f', fontSize: 16, fontWeight: '600', maxWidth: '90%' }}> {time} </Text>
                            </View>
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
        fontWeight: '600',
        color: '#434343',
        marginBottom: 7,
        marginTop: 5,
        marginLeft: 7,
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
})
