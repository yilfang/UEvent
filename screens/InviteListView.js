import React, { useState } from 'react';
import MapSearchBar from '../objects/mapSearchBar';
import { StyleSheet, Dimensions, Text, View, Image, TouchableOpacity, ScrollView, Alert, SafeAreaView } from 'react-native';
import PersonButton from '../objects/PersonButton';
import BackButton from '../objects/backButton';
import CreateListButton from '../objects/createListButton';
import { SearchBar } from 'react-native-elements';
import PersonSearchBar from '../objects/PersonSearchBar';
import SendButton from '../objects/sendButton';
import AddPeople from '../objects/addPeople';
import Globals from '../../GlobalVariables';

export default function InviteListView({ navigation, route }) {
    const { currentEvent } = route.params;
    const { event } = route.params; //this is the event to get invitees from
    const [users, setUsers] = useState([]);
    const [isModalVisable, setIsModalVisable] = useState(false);

    const changeModalVisable = (bool) => {
        setIsModalVisable(bool)
    }
    const removeUser = (id) => {
        const newList = users.filter((item) => item.userId !== id);
        setUsers(newList);
    }
    const inviteHandler = () => {
        const inputArray = [];
        for (let i = 0; i < users.length; i++) {
            inputArray.push({ userId: users[i].userId, eventId: currentEvent.id });
        }
        fetch(Globals.inviteesURL + '/json/addListOfInvitees', {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputArray)
        }).then((response) => response.text())
            .then((text) => {
                if (Globals.serverValidation(text)) {
                    getPushTokens();
                }
            })
            .catch((error) => Alert.alert("Something Went Wrong", Globals.serverErrorMessage));
    }
    const handleErrors = async (pushResponse,userPushTokens,last) => {
        await Globals.handleErrors(pushResponse, userPushTokens);
        if(last)
            navigation.pop(2);
    }
    const sendNotis = async (userPushTokens) => {
        //Fetch list of pushTokens
        console.log('sending notifications...');
        let postArray = [];
        for(let i = 0; i < userPushTokens.length; i++) {
            postArray.push({
                "to": userPushTokens[i].pushToken,
                "sound": "default",
                "title": "Event Invitation",
                "body": currentEvent.organizer + " is inviting you to " + currentEvent.name + "! Tap to view the event.",
                "data": {
                    eventId: currentEvent.id,
                    type: 'Invitation',
                }
            })
        }
        console.log('postARray is: ');
        console.log(postArray);
        for(let j=0; j<Math.floor(postArray.length/99) + 1; j++) {
            fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    host: 'exp.host',
                    accept: 'application/json',
                    'accept-encoding': 'gzip, deflate',
                    'content-type': 'application/json'
                },
                body: JSON.stringify(postArray.slice(j*99, Math.min(j*99 + 99, postArray.length)))
            }).then((response) => response.json())
            .then((json) => {
                handleErrors(json, j==Math.floor(postArray.length/99));
            })
                .catch((error) => console.error(error));
            }
    }
    const getPushTokens = () => {
        if(users.length !== 0) {
            let recipientListString = '';
            for (let i = 0; i < users.length; i++) {
                if (i + 1 == users.length) {
                    recipientListString = recipientListString + 'userIds=' + users[i].userId;
                }
                else {
                    recipientListString = recipientListString + 'userIds=' + users[i].userId + '&';
                }    
            }
            console.log(Globals.usersURL + '/getPushToken/listUser?' + recipientListString);

            fetch(Globals.usersURL + '/getPushToken/listUser?' + recipientListString, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
                }).then((response) => response.json())
                .then((json) => {
                    sendNotis(json);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }
    const [fetched, setFetched] = useState(false);
    const getUsers = () => {
        fetch(Globals.inviteesURL + '/getEventInvitees/' + event.id)
            .then((response) => response.json())
            .then((json) => { setUsers(json); setFetched(true) })
            .catch((error) => { Alert.alert("Something Went Wrong", Globals.serverErrorMessage) })
    }
    if (!fetched) {
        getUsers();
        console.log(currentEvent);
    }

    return (
        <SafeAreaView style={{
            flex: 1,
            position: 'absolute',
            backgroundColor: '#ffcb05',
            width: '100%'
        }}>
            <View style={{ flex: 1, backgroundColor: '#ffcb05' }}>
                <View style={{
                    width: '90%',
                    marginLeft: 20.4,
                }}>
                    <BackButton onPress={() => navigation.goBack()} title={event.name} />
                </View>
            </View>
            <View style={{ flex: 2, flexDirection: 'row' }}>
                <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20, marginTop:20, marginBottom: 20}}>
                    <SendButton onPress={inviteHandler} />
                </View>
            </View>
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <ScrollView style={{ marginLeft: 20, height: Dimensions.get('window').height - 100, marginTop: 0, flex: 1, width: '90%', marginRight: 20 }}
                    contentContainerStyle={{ paddingBottom: 120 }}>
                    {users.map((item, index) => {
                        return (
                            <View key={item.userId} style={{
                                backgroundColor: 'white',
                                marginTop: 10,
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: item.isSelected ? '#FFCB05' : '#FFF',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.2,
                                shadowRadius: 1,
                            }}>
                                <View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={styles.button}>
                                            <Text style={styles.buttonText}> {item.userName} </Text>
                                            <View style={{ flexDirection: 'row', marginBottom: 5, marginLeft: 5 }}>
                                                <Text numberOfLines={1}>{item.userEmail}</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity style={{ justifyContent: 'center', marginRight: 10 }}
                                            onPress={() => removeUser(item.userId)}>
                                            <Image style={{ width: 25, height: 25 }} source={require('../assets/minus.png')}></Image>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )
                    })
                    }
                </ScrollView>
            </View>

        </SafeAreaView>

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
        marginTop: 15,
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
