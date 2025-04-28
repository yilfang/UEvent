import React, { useState, useEffect } from 'react';
import MapSearchBar from '../objects/mapSearchBar';
import { StyleSheet, Dimensions, Text, View, SafeAreaView, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import ListButton from '../objects/listButton';
import BackButton from '../objects/backButton';
import PlusButton from '../objects/plusButton';
import PersonSearchBar from '../objects/PersonSearchBar';
import { useIsFocused } from '@react-navigation/native';
import Globals from '../../GlobalVariables';

export default function InviteScreen({ navigation, route }) {

    // const event = navigation.getParam('event');
    const { event } = route.params;
    const isFocused = useIsFocused();
    const [invites, setInvites] = useState([]);

    const compareUsers = (firstEl, secondEl) => {
        return firstEl.userName > secondEl.userName;
    }
    const getInvites = () => {
        fetch(Globals.inviteesURL + '/getEventInvitees/' + event.id)
            .then((response) => response.json())
            .then((json) => { setInvites(json.sort(compareUsers)) })
            .catch((error) => { Alert.alert("Something Went Wrong", Globals.serverErrorMessage) })
    }
    useEffect(() => {
        if (isFocused) {
            getInvites();
        }
    }, [isFocused])

    const removeUser = (userId) => {
        fetch(Globals.inviteesURL + '/delete?eventId=' + event.id + '&userId=' + userId, {
            method: 'delete',
        }).then((response) => {
            if (response != 'Fail' && response != 'Validation Error') {
                setInvites((prevInvites) => { return prevInvites.filter((invitation) => { return invitation.userId != userId }) });

                if (event.privateEvent) {
                    fetch(Globals.attendeesURL + '/delete/?eventId=' + event.id + '&userId=' + userId, {
                        method: 'delete',
                    }).then((response) => { })
                        .catch((error) => { });

                    fetch(Globals.followersURL + '/delete/?eventId=' + event.id + '&userId=' + userId, {
                        method: 'delete',
                    }).then((response) => { })
                        .catch((error) => { });
                }
            }
            else
                Alert.alert('Something Went Wrong', "Sorry, we couldn't process your request, please try again later.");
        }).catch((error) => Alert.alert('Something Went Wrong', "Sorry, we couldn't process your request, please try again later."));
    }

    const renderResponse = (statusId) => {
        if (statusId == 4) {
            return <Text style={{ position: 'absolute', top: Globals.WR(17), right: Globals.HR(84), color: 'green', fontSize: 16, fontWeight: '600' }}>Accepted</Text>;
        }
        else if (statusId == 2) {
            return <Text style={{ position: 'absolute', top: Globals.WR(17), right: Globals.HR(90), color: 'red', fontSize: 16, fontWeight: '600' }}>Declined</Text>;
        }
    }
    return (
        <View style={{ backgroundColor: '#fff', flex: 1 }}>
            <SafeAreaView style={{
                flex: 1,
                position: 'absolute',
                backgroundColor: '#ffcb05',
                width: '100%'
            }}>
                <View style={{ backgroundColor: '#ffcb05' }}>
                    <View style={{
                        width: '90%',
                        marginLeft: 20
                    }}>
                        <BackButton onPress={() => navigation.goBack()} title='Current Invites' />
                    </View>
                    <View style={{ marginLeft: 20, marginRight: 20, marginBottom: 20 }}>

                        <View style={{ alignItems: 'flex-end' }}>
                            <TouchableOpacity style={{
                                flex: 1,
                                flexDirection: 'row',
                                backgroundColor: '#fff',
                                alignItems: 'center',
                                shadowColor: '#000',
                                width: 120,
                                borderRadius: 20,
                                justifyContent: 'center',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.2,
                                shadowRadius: 1,
                            }}
                                onPress={() => navigation.navigate('InvitePeopleScreen', { event: event, existingInvites: invites })}>
                                <View style={{ padding: 7, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ justifyContent: 'center', marginRight: 5, fontWeight: 'bold', color: '#ffcb05', fontSize: 14 }}>ADD MORE</Text>
                                    <Image source={require('../assets/add.png')} style={{ height: 12, width: 12, tintColor: '#ffcb05' }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {/*<PersonSearchBar navigation={navigation} parentScreen='InviteScreen' />*/}
                {/*<View style = {{borderBottomColor: '#d4d4d4',borderBottomWidth: 1.5,marginTop: 0,marginBottom:0,marginHorizontal:-23,}}/>*/}
                <ScrollView style={{ height: Dimensions.get('window').height - (Dimensions.get('window').height > 700 ? 140 : 120), backgroundColor: '#fff', }}
                    contentContainerStyle={{ paddingBottom: 50 }}>
                    <Text style={{ marginTop: 5 }}></Text>
                    {invites.map((item) => {
                        return (
                            <View key={item.userId} style={{
                                backgroundColor: 'white',
                                marginBottom: 5,
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: item.isSelected ? '#FFCB05' : '#fff9f3',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.2,
                                shadowRadius: 1,
                                marginTop: 5,
                            }}>
                                <View>
                                    <View style={{ flexDirection: 'row', marginLeft: 20, }}>
                                        <View style={styles.button}>
                                            <Text style={styles.buttonText}> {item.userName} </Text>
                                            <View style={{ flexDirection: 'row', marginBottom: 5, marginLeft: 5 }}>
                                                <Text numberOfLines={1}>{item.userEmail}</Text>
                                            </View>
                                        </View>
                                        {renderResponse(item.status.id)}
                                        <TouchableOpacity style={{ justifyContent: 'center', marginRight: 30 }}
                                            onPress={() => removeUser(item.userId)}>
                                            <View>
                                                <Image style={{ width: 25, height: 25 }} source={require('../assets/minus.png')}></Image>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )
                    })}
                    {invites.length == 0 ?
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: Globals.HR(24), lineHeight: 35, textAlign: 'center', padding: Globals.HR(20), justifyContent: 'center', flex: 1, fontWeight: '500', color: 'rgba(0, 0, 0, 0.5)', width: '80%' }}>
                                You haven't invited anyone to your event yet. Start by pressing the Add More button up top!
                            </Text>
                        </View> : null
                    }
                </ScrollView>

            </SafeAreaView>
        </View>

    );

}

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        marginLeft: 20,
        width: '90%',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 28,
        marginBottom: 7,
    },
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
