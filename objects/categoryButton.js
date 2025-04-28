import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import GlobalVariables from '../../GlobalVariables';

export default function CategoryButton({ id, icon, name, pressHandler, isPressed }) { //icon should be of form require(PATH)
    const [pressed, setPressed] = useState(isPressed);

    let initialColor = '#09189e';
    if (isPressed)
        initialColor = '#fab400';

    const [color, setColor] = useState(initialColor);

    const myPressHandler = () => {
        let success = false;
        if (pressed == false) {
            success = pressHandler(id, icon, name, true);
            if (success)
                setColor('#fab400');
        }
        else {
            success = pressHandler(id, icon, name, false);
            if (success)
                setColor('#09189e');
        }
        if (success)
            setPressed(!pressed);
    }
    return (
        <TouchableOpacity onPress={myPressHandler}>
            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <Image source={icon} style={[styles.icon, { tintColor: color }]} />
                    <Text style={[styles.text, { color: color }]}>{name}</Text>
                </View>
                <Image source={require('../assets/check.png')} style={[styles.check, { opacity: pressed ? 1.0 : 0.0, tintColor: '#fab400' }]} />
            </View>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 367,
        borderBottomColor: 'black',
    },
    icon: {
        position: 'absolute',
        left: 25,
        width: 25,
        height: 25,
    },
    textContainer: {
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor:'yellow'
    },
    text: {
        fontWeight: '600',
        fontSize: 19,
        paddingVertical: 20,
        opacity: 0.9,
    },
    check: {
        width: 24,
        height: 24,
        right: 45,
    },
})