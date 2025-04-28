import React, { useContext, useState } from 'react';
import { StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Text, View, SafeAreaView, ScrollView, Modal, TextInput, Pressable, Alert, Dimensions } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import AppContext from '../objects/AppContext';
import Globals from '../../GlobalVariables';
import { ManageAttendeesScreen } from './ManageAttendees';
import { createStackNavigator } from '@react-navigation/stack';
import EditEventScreen from './EditEvent';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../objects/backButton';
import ProfileButton from '../objects/profileButton';
import CreateInviteList from './CreateInviteList';
import InviteListView from './InviteListView';
import InvitePeopleScreen from './InvitePeopleScreen';
import InviteScreen from './InviteScreen';
import CheckBox from '../objects/FormObjects/CheckBox';
import * as MailComposer from 'expo-mail-composer';
import { setNotificationChannelAsync } from 'expo-notifications';
import { ref } from 'yup';

function ManageEventScreen({ navigation, route }) {
    const myContext = useContext(AppContext);
    const { item } = route.params;
    const { goToFind } = route.params;
    const { fromEdit } = route.params;

    const [modalVisible, setModalVisible] = useState(false);
    const [announcement, setAnnoucement] = useState(''); //mispelled bruh
    const [emailChecked, setEmailChecked] = useState(false);

    const getEmails = (json) => {
        let emails = [];
        json.map((item) => emails.push(item.userEmail));
        return emails;
    }
    const sendEmail = (emails,cancel) => {
        MailComposer.composeAsync({
            recipients: emails,
            subject: item.name + ' - ' + 'Event Update',
            body: announcement,
        }).then((response) => {
            setRecipientsForNotis(cancel);
        }).catch((error) => { console.error(error); Alert.alert("Couldn't Send Email", "Sorry, we couldn't email your attendees. Something must have gone wrong in our servers.") })
    }
    const getRecipients = (cancel) => {
        let fetchurl = Globals.attendeesURL + '/getEventAttendees/' + item.id;
        fetch(fetchurl)
            .then((response) => response.json())
            .then((json) => { sendEmail(getEmails(json),cancel) })
            .catch((error) => { console.error(error); Alert.alert("Something Went Wrong", Globals.serverErrorMessage) })
    }
    const setRecipientsForNotis = (cancel) => {
        let fetchurl = Globals.attendeesURL + '/getEventAttendees/' + item.id;
        fetch(fetchurl)
            .then((response) => response.json())
            .then((json) => {  
                getAllTokens(json,cancel);
            })
            .catch((error) => { console.error(error); Alert.alert("Something Went Wrong", Globals.serverErrorMessage) })
    }
    const getAllTokens = (recipients, cancel) => {
        if(recipients.length !== 0) {
            let recipientListString = '';
            for (let i = 0; i < recipients.length; i++) {
                if (i + 1 == recipients.length) {
                    recipientListString = recipientListString + 'userIds=' + recipients[i].userId;
                }
                else {
                    recipientListString = recipientListString + 'userIds=' + recipients[i].userId + '&';
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
                    sendNotis(json, cancel);
                })
                .catch((error) => console.error(error));  
        }
        else {
            if(cancel) {
                cancelEvent();
            }
            else {
                setAnnoucement('');
                setEmailChecked(false);
                setModalVisible(false);
            }
        }
    }
    const sendNotis = (userPushTokens, cancel) => {
        let postArray = [];
        for(let i = 0; i < userPushTokens.length; i++) {
            postArray.push({
                "to": userPushTokens[i].pushToken,
                "sound": 'default',
                "title": item.name + ' - Event Update',
                "body": cancel?'This event has been cancelled :(':announcement.trim(),
                "data": {
                    eventId: item.id,
                    type: 'Update'
                }
            })
        }
        console.log('postARray is: ');
        console.log(postArray);
        console.log(Math.floor(postArray.length/99));
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
                    handleErrors(json,userPushTokens,cancel,j== Math.floor(postArray.length/99));
                })
                .catch((error) => console.error(error));
        }
    }
    const handleErrors = async (pushResponse,userPushTokens,cancel,last) => {
        await Globals.handleErrors(pushResponse, userPushTokens);
        if(last) {
            if(cancel) {
                cancelEvent();
            }
            else {
                setAnnoucement('');
                setEmailChecked(false);
                setModalVisible(false);
            }
        }
    }
    const SendUpdate = () => {
        const sendTime = new Date();
        const sendTimeString = sendTime.toISOString().slice(0, -1);

        if (announcement === '') {
            Alert.alert('Error', 'Cannot send empty update');
            // width - 428
            // height - 926
        }
        else {
            // post to api
            fetch(Globals.updatesURL + '/json/add', {
                method: 'post',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    updates: announcement.trim() + '!@#$%^&*()' + sendTimeString + '!@#$%^&*()Info Update',
                    eventId: item.id,
                }
                )
            })
                .then((response) => response.text())
                .then((text) => {
                    if (emailChecked) {
                        getRecipients(false);
                    }
                    else {
                        setRecipientsForNotis(false);
                    }
                })
                .catch((error) => { console.error(error); Alert.alert("Something Went Wrong", Globals.serverErrorMessage) });        
            // update is in announcement variable
            // clear announcement
            // exit
        }
    }
    const cancelEvent = () => {
        fetch(Globals.eventsURL + '/delete/' + item.id, { method: 'delete', })
            .then((response) => response.text())
            .then((text) => {
                if (goToFind) {
                    navigation.dangerouslyGetParent().navigate('Find',
                        { screen: 'MainScreen', params: { CloseBotSheet: true, CloseBotSheet2: true } });
                }
                else {
                    navigation.pop(2);
                }
                myContext.toggleShowNavBar(true);
            })
            .catch((error) => Alert.alert("Something Went Wrong", Globals.serverErrorMessage));
    }
    const confirmCancel = () => {
        Alert.alert(
            "Confirm Cancel",
            "Are you sure you want to cancel this event? All attendees will be notified.",
            [
                {
                    text: "No",
                },
                { text: "Yes", style: 'cancel',onPress: () => sendCancelUpdate() }
            ]
        );
    }
    const sendCancelUpdate = () => {
        const sendTime = new Date();
        const sendTimeString = sendTime.toISOString().slice(0, -1);
        fetch(Globals.updatesURL + '/json/add', {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                updates: 'This event has been cancelled :(!@#$%^&*()' + sendTimeString + '!@#$%^&*()Cancelled',
                eventId: item.id,
            }
            )
        })
            .then((response) => response.text())
            .then((text) => {
                //check for error response
                setRecipientsForNotis(true);
            })
            .catch((error) => Alert.alert("Something Went Wrong", Globals.serverErrorMessage));
    } 
    return (
        <SafeAreaView style={{ backgroundColor: '#fff' }} >
            <View style={{ backgroundColor: '#FFF', marginBottom: 20, }}>
                <View style={{ alignItems: 'center', marginLeft: 20, flexDirection: 'row' }}>
                    <BackButton onPress={() => {
                        if (goToFind && fromEdit) {
                            navigation.navigate('MainScreen', { refreshCurrent: true, currEvent: item });
                        }
                        else {
                            if (fromEdit) {
                                navigation.navigate({
                                    name: 'EventDetailsScreen',
                                    params: { currentEvent: item },
                                    merge: true,
                                })
                            }
                            else
                                navigation.goBack();
                        }
                    }} title={item.name} />
                </View>
                <View style={{ marginLeft: 35 }}>
                    <Text style={{
                        fontSize: 22,
                        color: '#434343',
                        fontWeight: 'bold',
                        marginTop: Globals.HR(28),
                        marginBottom: 0,
                    }}>Statistics -</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginTop: Globals.HR(20) }}>
                    <View style={{ flex: 1 }}>
                        <Image source={require('../assets/star.png')} style={{ alignSelf: 'center', height: 20, width: 20, tintColor: '#09189f', marginBottom: 10, }} />
                        <Text style={{ textAlign: 'center', fontSize: Globals.HR(18), color: '#09189f', fontWeight: '600' }}>{item.numOfFollower}</Text>
                        <Text style={{ textAlign: 'center', fontSize: Globals.HR(18), color: '#09189f', fontWeight: '600' }}>Saves</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Image source={require('../assets/attendees.png')} style={{ alignSelf: 'center', height: 20, width: 20, tintColor: '#09189f', marginBottom: 10, }} />
                        <Text style={{ textAlign: 'center', fontSize: Globals.HR(18), color: '#09189f', fontWeight: '600' }}>{item.numOfAttendee}</Text>
                        <Text style={{ textAlign: 'center', fontSize: Globals.HR(18), color: '#09189f', fontWeight: '600' }}>Attendees</Text>
                    </View>
                </View>
            </View>
            <View style={{ marginLeft: 35, marginBottom: 20 }}>
                <Text style={{
                    fontSize: 22,
                    color: '#434343',
                    fontWeight: 'bold',
                    marginTop: Globals.HR(20),
                    marginBottom: 10,
                }}>Manage Event -</Text>
            </View>
            <ScrollView style={{ marginLeft: 20, marginRight: 20, height: '100%' }}>
                <View style={{
                    flex: 1,
                }}>


                    <TouchableOpacity style={{
                        backgroundColor: '#FFF',
                        borderRadius: 8,
                        borderColor: '#09189f',
                        borderWidth: 1,
                        height: 55,
                        justifyContent: 'center',
                        marginHorizontal: 15,
                        marginBottom: Globals.HR(25),
                    }}
                        onPress={() => { navigation.navigate('Edit Event', { screen: 'Form', params: { item: item } }) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={require('../assets/edit.png')}
                                style={{ height: 21, width: 17, marginLeft: 20, marginRight: 10, tintColor: '#09189f' }}
                            ></Image>
                            <Text style={{
                                fontSize: 17,
                                fontWeight: 'bold',
                                color: '#09189f',
                            }}>Edit Event</Text>
                        </View>
                    </TouchableOpacity>
                    <Modal
                        visible={modalVisible}
                        transparent={true}
                        animationType='fade'
                    >
                        <SafeAreaView style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <View style={styles.modalClose}>
                                    <AntDesign name='closecircleo' style = {{margin: 7}}size={28} onPress={() => { setModalVisible(false); setAnnoucement(''); setEmailChecked(false) }} />
                                </View>
                                <View style = {{marginTop: -2}}>
                                    <Text style={{textAlign: 'center', fontSize: 22, fontWeight: '500' }}>Send an Event Update</Text>
                                </View>
                                <Text style={{ textAlign: 'auto', fontSize: 15.5, fontWeight: '500', marginTop: Globals.HR(10) }}>Enter the update here:</Text>
                                <TouchableWithoutFeedback onPress = {() => this.textIn.focus()}>
                                    <View style={styles.textAreaContainer}>
                                        <TextInput
                                            ref={(input) => { this.textIn = input;}}
                                            multiline={true}
                                            style={{ margin: 10 }}
                                            placeholder='All followers will be notified'
                                            onChangeText={(text) => setAnnoucement(text)}
                                            autoFocus = {true}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                                <View style={{ marginTop: 10, marginBottom: 0, alignSelf: 'flex-start', marginLeft: 20, }}>
                                    <CheckBox title="Email Attendees" value={emailChecked} onPress={() => setEmailChecked(!emailChecked)} />
                                </View>
                                <TouchableOpacity onPress={SendUpdate}>
                                    <View style={styles.UpdateContainer}>
                                        <Text style={styles.UpdateText}>Send Update</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </Modal>

                    <TouchableOpacity style={{
                        backgroundColor: '#FFF',
                        borderRadius: 8,
                        borderColor: '#09189f',
                        borderWidth: 1,
                        height: 55,
                        justifyContent: 'center',
                        marginHorizontal: 15,
                        marginBottom: Globals.HR(25),
                    }}
                        onPress={() => navigation.navigate('Manage Attendees', { apiData: item })}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={require('../assets/attendees.png')}
                                style={{ height: 18, width: 18, marginLeft: 20, marginRight: 10, tintColor: '#09189f' }}
                            ></Image>
                            <Text style={{
                                fontSize: 17,
                                fontWeight: 'bold',
                                color: '#09189f',
                            }}>Manage Attendees</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        backgroundColor: '#FFF',
                        borderRadius: 8,
                        borderColor: '#09189f',
                        borderWidth: 1,
                        height: 55,
                        justifyContent: 'center',
                        marginHorizontal: 15,
                        marginBottom: Globals.HR(25),
                    }}
                        onPress={() => setModalVisible(true)} title='Make Announcement'>
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={require('../assets/announcement.png')}
                                style={{ height: 16, width: 18, marginLeft: 20, marginRight: 10, alignSelf: 'center', tintColor: '#09189f' }}
                            ></Image>
                            <Text style={{
                                fontSize: 17,
                                fontWeight: 'bold',
                                color: '#09189f',
                            }}>Make Announcement</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        backgroundColor: '#FFF',
                        borderRadius: 8,
                        borderColor: 'red',
                        borderWidth: 1,
                        height: 55,
                        justifyContent: 'center',
                        marginHorizontal: 15,
                        marginBottom: Globals.HR(20),
                    }}
                        onPress={confirmCancel}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={require('../assets/cancel.png')}
                                style={{ height: 18, width: 18, marginLeft: 20, marginRight: 10, alignSelf: 'center', tintColor: 'red' }}
                            ></Image>
                            <Text style={{
                                fontSize: 17,
                                fontWeight: 'bold',
                                color: 'red',
                            }}>Cancel Event</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const Stack = createStackNavigator()

export default function ManageEventStack({ navigation }) {
    const nav = useNavigation();
    return (
        <Stack.Navigator>
            <Stack.Screen name="Manage Event" component={ManageEventScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Edit Event" component={EditEventScreen} options={{ headerShown: false }} />
            <Stack.Screen name="InviteScreen" component={InviteScreen} options={{ headerShown: false }} />
            <Stack.Screen name="InvitePeopleScreen" component={InvitePeopleScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CreateInviteList" component={CreateInviteList} options={{ headerShown: false }} />
            <Stack.Screen name="InviteListView" component={InviteListView} options={{ headerShown: false }} />
            <Stack.Screen name="Manage Attendees" component={ManageAttendeesScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



const styles = StyleSheet.create({
    selectContainer: {
        backgroundColor: '#ffffff',
        marginHorizontal: Globals.WR(50),
        margin: '3%',
        width: '75%',
        alignItems: 'center',
        top: 0,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        borderRadius: Globals.HR(10),
    },
    selectText: {
        fontWeight: '500',
        fontSize: Globals.HR(22),
        paddingVertical: Globals.HR(15),
        color: '#0085FF',
    },
    cancelContainer: {
        backgroundColor: '#FF4646',
        margin: '8%',
        width: '100%',
        alignItems: 'center',

        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        borderRadius: Globals.HR(10),
    },
    cancelText: {
        fontWeight: 'bold',
        fontSize: Globals.HR(22),
        paddingVertical: Globals.HR(15),
        paddingHorizontal: Globals.WR(60),
        color: '#FFFFFF',
    },
    NewEventButton: {

    },
    close: {
        position: 'absolute',
        left: windowWidth - 40,
        top: 10,
    },
    modalView: {
        margin: windowHeight / 132.6,
        backgroundColor: "#FFF9F9",
        borderRadius: windowHeight / 46.3,
        padding: windowHeight / 30.46,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: '65%',
        width: '85%'
    },
    modalClose: {
        position: 'absolute',
        right: 5,
        top: 5,
    },
    centeredView: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        alignItems: "center",
    },
    textAreaContainer: {
        height: '60%',
        width: '85%',
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#EEEEEE'
    },
    UpdateContainer: {
        backgroundColor: '#ffcb05',
        margin: '7%',
        width: '100%',
        alignItems: 'center',

        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        borderRadius: windowHeight / (windowHeight / 10),
    },
    UpdateText: {
        fontWeight: 'bold',
        fontSize: windowHeight / 42.06,
        paddingVertical: windowHeight / 61.73,
        paddingHorizontal: windowWidth / 7.13,
        color: '#FFFFFF',
    },
    checkboxBase: {
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 0,
        borderColor: '#000000',
        borderWidth: 0.5,
        backgroundColor: 'transparent',
    },
    checkboxChecked: {
        backgroundColor: '#0085FF',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10
    },

    checkboxLabel: {
        marginLeft: 13,
        fontWeight: '500',
        fontSize: 18,
    },
    headerButtonStyle: {
        fontSize: Globals.HR(18),
        color: '#0085FF',
        fontWeight: '700',
        margin: Globals.HR(5)
    },
})
