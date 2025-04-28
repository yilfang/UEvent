import React, { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity, Text, View, Dimensions, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SendInviteButton from './sendInviteButton'
import Globals from '../../GlobalVariables';

export default function UpdateButton({ id, event, content, sendTime, type, onPress, trash }) {
    const [expand, setExpand] = useState(false);

    return (
        <View style={styles.block}>
            <View style={{ flexDirection: 'column' }}>
                <Text style={{
                    marginTop: 4, marginBottom: 5, color: type == 'Cancelled' ? 'red' : type == 'Location Change' ? 'blue' : type == 'Time Change' ? 'orange' : '#00b23d',
                    fontSize: 16, fontWeight: 'bold'
                }}> {type} </Text>
                <Text style={{ position: "absolute", top: 5, right: 5, color: '#03a9f4', fontSize: 15, fontWeight: '600' }}> Sent {sendTime} </Text>

                <TouchableOpacity onPress={() => setExpand(!expand)}>
                    <Text style={styles.buttonText}>{event.name}</Text>
                    {expand ? <Ionicons name="chevron-up" size={28} style={styles.dropdown} /> :
                        <Ionicons name="chevron-down" size={28} style={styles.dropdown} />}
                </TouchableOpacity>
            </View>
            {expand ?
                <View>
                    <Text style={styles.content}>{content}</Text>
                    <View style={styles.goToContainer}>
                        <TouchableOpacity style={[styles.goToButton, { marginLeft: 10, backgroundColor: 'red', width: 100 }]} onPress={() => trash(id, { event: event, content: content, type: type })}>
                            <View style={{ padding: 3, flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ justifyContent: 'center', marginRight: 7, color: 'white', fontWeight: '500', fontSize: 13 }}>Delete</Text>
                                <Ionicons name='trash' size={14} color='white' style={{ marginBottom: 2, }} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.goToButton} onPress={onPress}>
                            <View style={{ padding: 3, flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ justifyContent: 'center', marginRight: 7, color: 'white', fontWeight: '500', fontSize: 13 }}>Event Details</Text>
                                <Image source={require('../assets/arrow.png')} style={{ width: 10, height: 10, tintColor: '#f3f3f3', }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                : null}
        </View>
    );
}
const styles = StyleSheet.create({
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#434343',
        marginBottom: 15,
        marginTop: 10,
        maxWidth: Globals.WR(Dimensions.get('window').width - 65),
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
    dropdown: {
        position: 'absolute',
        right: 10,
        bottom: 10,
    },
    content: {
        marginLeft: 5,
        fontWeight: '400',
        fontSize: 15,
        lineHeight: 20,
    },
    goTo: {
        fontSize: 15,
        fontWeight: '500',
        color: '#0085ff',
        textDecorationLine: 'underline',

        marginLeft: 263,
    },
    goToButton: {
        //flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0085ff',
        shadowColor: '#000',
        width: 120,
        borderRadius: 20,
        justifyContent: 'center',
        height: 27,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        alignSelf: 'flex-end',
        marginRight: 10,
    },
    goToContainer: {
        marginBottom: 10,
        marginTop: 20,
        flexDirection: 'row',
        //flex:1,
        width: '100%',
        justifyContent: 'space-between',
    },
    trashButton: {
        //flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0085ff',
        shadowColor: '#000',
        width: 80,
        borderRadius: 20,
        justifyContent: 'center',
        height: 27,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        alignSelf: 'flex-start',
        marginRight: 10,
    },
})
