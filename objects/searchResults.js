import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Text, View, Dimensions, } from 'react-native';


export default function ProfileButton({ onPress, title, location, time }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={{ flexDirection: 'row' }}>
                <View style={styles.button}>
                    <Text style={styles.buttonText}> {title} </Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            source={require('../assets/Vector.png')}
                            style={{ width: 16, height: 16, marginLeft: 5 }}>
                        </Image>
                        <Text style={{ marginBottom: 5, color: 'orange', fontSize: 16, marginRight: 10, fontWeight: 'bold' }}> {location} </Text>
                        <Image
                            source={require('../assets/CalendarIcon.png')}
                            style={{ width: 16, height: 16 }}>
                        </Image>
                        <Text style={{ marginBottom: 5, color: '#03a9f4', fontSize: 16, fontWeight: 'bold' }}> {time} </Text>
                    </View>
                </View>
                <View style={{ justifyContent: 'center' }}>
                    <Image source={require('../assets/rightArrow.png')}
                        style={{ width: 20, height: 20 }}>
                    </Image>
                </View>
            </View>
            <View style={{ borderTopColor: '#f2f2f2', borderTopWidth: 1 }} />
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    buttonText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#434343',
        marginBottom: 5,
        marginTop: 5
    },
    button: {
        flex: 1,
        width: Dimensions.get('window').width - 50
    },
    icon: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center'
    }
})