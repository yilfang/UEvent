import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Text, View, Dimensions, Alert, } from 'react-native';
import Globals from '../../GlobalVariables';

export default function IgnoredButton({ onPress, event, user, status, deleteInvitation }) {
    const accept = () => {
        if (!event.isAttendee) {
            fetch(Globals.attendeesURL + '/json/add', {
                method: 'post',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.id,
                    eventId: event.id,
                })
            }).then((response) => response.json())
                .then((json) => {
                    fetch(Globals.inviteesURL + '/update', {
                        method: 'put',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            eventId: event.id,
                            userId: user.id,
                            statusId: 4,
                        })
                    }).then((response) => response.json())
                        .then((json) => { 
                            const startingTime = new Date(event.startTime.substr(0,10) + 'T' + event.startTime.substr(11,8));
                            startingTime.setHours(startingTime.getHours()-5); //server error offset, 4 with DST, 5 without
                            Globals.scheduleNoti(event.id, event.name, startingTime); 
                            if(event.hasOwnProperty('hostNotis') && event.hostNotis == true)
                                Globals.sendOrganizerNoti(event.host.id, event.id, event.name, user.displayName);
                            deleteInvitation(user.id, event.id); 
                        })
                        .catch((error) => { Alert.alert("Something Went Wrong", Globals.serverErrorMessage) })
                })
                .catch((error) => { Alert.alert("Something Went Wrong", Globals.serverErrorMessage) })
        }
        else {
            fetch(Globals.inviteesURL + '/update', {
                method: 'put',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    eventId: event.id,
                    userId: user.id,
                    statusId: 4,
                })
            }).then((response) => response.json())
                .then((json) => { deleteInvitation(user.id, event.id) })
                .catch((error) => { Alert.alert("Something Went Wrong", Globals.serverErrorMessage) })
        }
    }
    const decline = () => {
        fetch(Globals.inviteesURL + '/update', {
            method: 'put',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                eventId: event.id,
                userId: user.id,
                statusId: 2,
            })
        }).then((response) => response.json())
            .then((json) => { deleteInvitation(user.id, event.id) })
            .catch((error) => { Alert.alert('Something Went Wrong', 'Sorry, something went wrong, please try again later.') })
    }
    const ignore = () => {
        fetch(Globals.inviteesURL + '/update', {
            method: 'put',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                eventId: event.id,
                userId: user.id,
                statusId: 1,
            })
        }).then((response) => response.json())
            .then((json) => { deleteInvitation(user.id, event.id) })
            .catch((error) => { Alert.alert('Something Went Wrong', 'Sorry, something went wrong, please try again later.') })
    }
    return (
        <View style={styles.block}>
            <View onPress={onPress}>
                <View style={{ flexDirection: 'column' }}>
                    <TouchableOpacity style={{ flexDirection: 'row' }} onPress={onPress}>
                        <View>
                            <Text style={styles.buttonText}>{event.name}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    source={require('../assets/Vector.png')}
                                    style={{ width: 16, height: 16, marginLeft: 7, tintColor: 'orange', marginTop: 1, }}>
                                </Image>
                                <Text style={{ marginBottom: 10, marginLeft: 4, color: 'orange', fontSize: 16, marginRight: 10, fontWeight: 'bold', maxWidth: Dimensions.get('window').width - 100 }}>{event.organizer}</Text>
                            </View>
                        </View>
                        <View style={{ justifyContent: 'center', flex: 1 }}>
                            <Image source={require('../assets/rightArrow.png')} style={{ height: 15, width: 15, alignSelf: 'flex-end', marginRight: 10 }}>
                            </Image>

                        </View>

                    </TouchableOpacity>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        marginBottom: 5
                    }}>
                        <TouchableOpacity onPress={accept} style={{
                            borderColor: '#ffcb05',
                            borderWidth: 1,
                            borderRadius: 8,
                            width: (Dimensions.get('window').width - 81.6) / 3,
                            height: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#fff'
                        }}>
                            <Text style={{
                                fontSize: 17,
                                fontWeight: 'bold',
                                color: '#ffcb05',
                            }}>Accept</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={decline} style={{
                            borderColor: 'red',
                            borderWidth: 1,
                            borderRadius: 8,
                            width: (Dimensions.get('window').width - 81.6) / 3,
                            height: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#fff'
                        }}>
                            <Text style={{
                                fontSize: 17,
                                fontWeight: 'bold',
                                color: 'red',
                            }}>Decline</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={ignore} disabled={true}
                            style={{
                                opacity: 0.33,
                                borderColor: '#434343',
                                borderWidth: 1,
                                borderRadius: 8,
                                width: (Dimensions.get('window').width - 81.6) / 3,
                                height: 40,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#fff'
                            }}>
                            <Text style={{
                                fontSize: 17,
                                fontWeight: 'bold',
                                color: '#434343',
                            }}>Ignore</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>

    );
}
const styles = StyleSheet.create({
    buttonText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#434343',
        marginBottom: 5,
        marginTop: 5,
        marginLeft: 7,
        maxWidth: Globals.WR(Dimensions.get('window').width - 65)
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
