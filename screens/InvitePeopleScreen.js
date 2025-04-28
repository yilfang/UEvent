import React, { useState, useContext } from 'react';
import MapSearchBar from '../objects/mapSearchBar';
import { StyleSheet, Dimensions, Text, View, SafeAreaView, Image, Keyboard, TouchableOpacity, ScrollView, Alert } from 'react-native';
import ListButton from '../objects/listButton';
import BackButton from '../objects/backButton';
import PlusButton from '../objects/plusButton';
import SendInviteButton from '../objects/sendInviteButton';
import PersonSearchBar from '../objects/PersonSearchBar';
import { SearchBar } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import Globals from '../../GlobalVariables';
import InviteeButton from '../objects/InviteeButton';
import AppContext from '../objects/AppContext';

export default function InvitePeopleScreen({ navigation, route }) {

    // const event = navigation.getParam('event');
    const { event } = route.params;
    const [existingInvites, setExistingInvites] = useState(route.params.existingInvites);
    const [users, setUsers] = useState([]); //users listed, which is all users returned by search minus selectedusers
    const [selectedUsers, setSelectedUsers] = useState([]); //list of users selected
    const [Names, setNames] = useState([]);
    const [hasActualList, setHasActualList] = useState(false);

    if (typeof (existingInvites) == 'undefined' || typeof (existingInvites) == null) {
        fetch(Globals.inviteesURL + '/getEventInvitees/' + event.id)
            .then((response) => response.json())
            .then((json) => { setExistingInvites(json) })
            .catch((error) => { setExistingInvites([]) });
    }
    const inUsers = (user) => {
        for (let i = 0; i < users.length; i++) {
            if (users[i].id == user.userId)
                return true;
        }
        return false;
    }
    const remove = (item) => {
        let newSelected = selectedUsers.filter((prevSelected) => prevSelected.userId !== item.userId);
        setSelectedUsers(newSelected);

        if (searchText != '' && (item.email.indexOf(searchText.toLowerCase()) != -1 || item.name.toLowerCase().indexOf(searchText.toLowerCase()) != -1)
            && !inUsers(item)) {
            setUsers((prevUsers) => {
                for (let i = 0; i < prevUsers.length; i++) {
                    if (item.name < prevUsers[i].displayName) {
                        prevUsers.splice(i, 0, { id: item.userId.toString(), displayName: item.name, email: item.email });
                        break;
                    }
                }
                return prevUsers;
            })
        }
    }
    const add = (userItem) => {
        if(selectedUsers.length < 50) {
            let already = inExisting(userItem);
            if (!already) {
                setSelectedUsers((prevSelectedUsers) => {
                    return [{ userId: userItem.id.toString(), name: userItem.displayName, email: userItem.email, eventId: event.id.toString() }, ...prevSelectedUsers]
                })
            }
            setUsers((prevUsers) => { return prevUsers.filter((prevUser) => { return prevUser.id != userItem.id }) });
        }
        else {
            Alert.alert("Too Many Invitations", "Sorry, you can only invite 50 users at a time. Send these invitations out before inviting more.");
        }
    }
    const inExisting = (searchUser) => {
        for (let i = 0; i < existingInvites.length; i++) {
            if (existingInvites[i].userId == searchUser.id)
                return true;
        }
        for (let j = 0; j < selectedUsers.length; j++) {
            if (selectedUsers[j].userId == searchUser.id)
                return true;
        }
        return false;
    }
    const renderResponse = () => {
        return <Text style={{ position: 'absolute', top: Globals.WR(17), right: Globals.HR(30), color: '#fab400', fontSize: 16, fontWeight: '600' }}>Invited</Text>;
    }
    const renderBottom = () => {
        if (pressed) {
            return (
                <ScrollView style={{ marginLeft: 20, height: Dimensions.get('window').height - 100, marginTop: 10, width: '90%', marginRight: 20 }}
                >
                    {users.map((item, index) => {
                        const exists = inExisting(item);
                        if(myContext.user.email.toLowerCase() == 'asjian@umich.edu' || (item.email.toLowerCase() != 'eventhubtestinguser@gmail.com' && item.email.toLowerCase() != 'ueventdemo@gmail.com')) {
                            return (
                                <View key={item.id} style={{
                                    backgroundColor: 'white',
                                    marginBottom: 5,
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: '#FFF',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 1,
                                }}>
                                    <TouchableOpacity onPress={() => { add(item) }} disabled={exists}>
                                        <View style={{ flexDirection: 'row', opacity: exists ? 0.33 : 1 }}>
                                            <View style={[styles.button]}>
                                                <Text style={styles.buttonText}> {item.displayName} </Text>
                                                <View style={{ flexDirection: 'row', marginBottom: 5, marginLeft: 5 }}>
                                                    <Text numberOfLines={1}>{item.email}</Text>
                                                </View>
                                            </View>
                                            {exists ? renderResponse() : null}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                    })
                    }
                    {<Text style={{ marginBottom: Math.min(selectedUsers.length / 2.25 * 50, Globals.HR(280) + 50) + 200 }}></Text>}
                </ScrollView>
            );
        }
        else {
            return (
                <View>
                    <View style={{ marginLeft: 20, width: '90%', marginRight: 20, marginTop: 15, }}>
                        <Text style={styles.headerText}>Previous Invite Lists</Text>
                        <ScrollView style={{ height: Dimensions.get('window').height - 100 }}
                            contentContainerStyle={{ paddingBottom: 50 }}>
                            {events.map((item) => {
                                if (parseInt(item.numOfInvitee) > 0 && item.id != event.id) {
                                    if (!hasActualList)
                                        setHasActualList(true);
                                    return (
                                        <View key={item.id} style={{ marginBottom: 5 }}>
                                            <ListButton title={item.name} members={item.numOfInvitee + " Invitees"}
                                                onPress={() => navigation.navigate("InviteListView", { currentEvent: event, event: item })} />
                                        </View>
                                    )
                                }
                            })
                            }
                            {!hasActualList ?
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: Globals.HR(24), lineHeight: 40, textAlign: 'center', padding: Globals.HR(20), justifyContent: 'center', flex: 1, fontWeight: '500', color: 'rgba(0, 0, 0, 0.5)', width: '80%' }}>
                                        You don't have any previous invite lists. Once you invite people to an event, they will be saved to a list for reuse in other events you host.
                                    </Text>
                                </View> : null
                            }
                            <Text style={{ marginBottom: events.length * 12 + 10 }}></Text>
                        </ScrollView>
                    </View>
                </View>
            );
        }
    }
    const iconColor = '#adadad';
    const [searchText, setSearchText] = useState('');
    const [finalSearch, setFinalSearch] = useState('');
    const [pressed, setPressed] = useState(false);
    const [focused, setFocused] = useState(false);

    const changeTextHandler = (search) => {
        setSearchText(search);
    }
    const clear = () => {
        setSearchText('');
        setFinalSearch('');
        setUsers([]);
        if (!focused) {
            setPressed(false);
        }
    }
    const compareUsersRemove = (firstEl, secondEl) => {
        return firstEl.displayName > secondEl.displayName;
    }
    const compareUsers = (firstEl, secondEl) => {
        if (inExisting(firstEl))
            return true;
        if (inExisting(secondEl))
            return false;

        return firstEl.displayName > secondEl.displayName;
    }
    const submit = () => {
        setFinalSearch(searchText);
        setFocused(false);
        if (searchText.trim() == '') {
            setPressed(false);
        }
        else {
            fetch(Globals.usersURL + '/json/search/' + searchText)
                .then((response) => response.json())
                .then((json) => { setUsers(json.sort(compareUsers)) })
                .catch((error) => Alert.alert("Something Went Wrong", Globals.serverErrorMessage));
        }
    }
    const handleErrors = async (pushResponse,userPushTokens) => {
        await Globals.handleErrors(pushResponse,userPushTokens);
        navigation.goBack();
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
                "body": event.organizer + " is inviting you to " + event.name + "! Tap to view the event.",
                "data": {
                    eventId: event.id,
                    type: 'Invitation',
                }
            })
        }
        console.log('postARray is: ');
        console.log(postArray);
        fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                host: 'exp.host',
                accept: 'application/json',
                'accept-encoding': 'gzip, deflate',
                'content-type': 'application/json'
            },
            body: JSON.stringify(postArray)
        }).then((response) => response.json())
          .then((json) => {
               handleErrors(json, userPushTokens);
          })
            .catch((error) => console.error(error));
    }
    const getPushTokens = () => {
        if(selectedUsers.length !== 0) {
            let recipientListString = '';
            for (let i = 0; i < selectedUsers.length; i++) {
                if (i + 1 == selectedUsers.length) {
                    recipientListString = recipientListString + 'userIds=' + selectedUsers[i].userId;
                }
                else {
                    recipientListString = recipientListString + 'userIds=' + selectedUsers[i].userId + '&';
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
                    setSelectedUsers([]);
                    setNames([]);
                    clear();
                })
                .catch((error) => {
                    console.error(error);
                    setSelectedUsers([]);
                    setNames([]);
                    clear();
                });
        }
    }
    const inviteHandler = () => {
        fetch(Globals.inviteesURL + '/json/addListOfInvitees', {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedUsers)

        }).then((response) => response.text())
            .then((text) => {
                if (text != "Fail" && text != 'Validation Error') {
                    getPushTokens();
                }
            })
            .catch((error) => Alert.alert("Something Went Wrong", Globals.serverErrorMessage));
    }
    const myContext = useContext(AppContext);
    const [events, setEvents] = useState([]);
    const [fetched, setFetched] = useState(false);

    const getEvents = () => {
        let fetchurl = Globals.eventsURL + '/getHostedEvents/' + myContext.user.id;
        fetch(fetchurl)
            .then((response) => response.json())
            .then((json) => { setEvents(json.reverse()); setFetched(true) })
            .catch((error) => Alert.alert("Something Went Wrong", Globals.serverErrorMessage))
    }
    if (!fetched)
        getEvents();

    return (
        <View style={{ backgroundColor: '#fff', flex: 1 }}>
            <SafeAreaView style={{
                flex: 1,
                position: 'absolute',
                backgroundColor: '#ffcb05',
                width: '100%'
            }}>
                <View style={{ flex: 1, backgroundColor: '#ffcb05' }}>
                    <View style={{
                        marginLeft: 20.4,
                    }}>
                        <BackButton onPress={() => navigation.goBack()} title='Invite People' />
                    </View>
                    <ScrollView style={{ marginLeft: 20, marginRight: 20, width: Dimensions.get('window').width - 40, maxHeight: Globals.HR(280), }}>

                        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>
                            You have selected:
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
                            {selectedUsers.map((item, index) => {
                                return (
                                    <View key={item.userId} style={{ flexDirection: 'row' }}>
                                        <InviteeButton onPress={() => remove(item)} Name={item.name} />
                                    </View>
                                )
                            })}
                        </View>
                    </ScrollView>
                    <View style={{ alignItems: 'flex-end', marginRight: 20, marginBottom: 20 }}>
                        <SendInviteButton onPress={inviteHandler} />
                    </View>
                </View>
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    <SearchBar
                        //ref={search => this.search = search}
                        placeholder='Search names or emails'
                        value={searchText}
                        onChangeText={(search) => changeTextHandler(search)}
                        onSubmitEditing={submit}
                        autoCorrect={false}
                        onFocus={() => { setPressed(true); setFocused(true); }}

                        inputStyle={styles.input}
                        inputContainerStyle={pressed ? styles.inputContainer1 : styles.inputContainer2}
                        containerStyle={pressed ? styles.searchContainer2 : styles.searchContainer1}

                        searchIcon={focused ? <Ionicons name='chevron-back' size={30} color={iconColor}
                            onPress={() => { Keyboard.dismiss(); setSearchText(finalSearch); if (finalSearch == '') setPressed(false); setFocused(false) }} /> :
                            <Image source={require('../assets/search.png')} style={{ width: 26, height: 27, tintColor: iconColor, marginLeft: 2, }} />}

                        clearIcon={<Ionicons name='close-outline' size={28} color={iconColor}
                            onPress={clear} />}
                    />
                    {renderBottom()}
                </View>

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
        marginBottom: 15,
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
    searchContainer1: {
        justifyContent: 'flex-start',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 15,
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    searchContainer2: {
        justifyContent: 'flex-start',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 15,
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
    },
    input: {
        color: '#000000',
    },
    inputContainer1: {
        borderRadius: 24,
        borderColor: '#e2e2e2',
        backgroundColor: '#ffffff',
        borderWidth: 1.5,
        borderBottomWidth: 1.5,
        height: 45,
    },
    inputContainer2: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        height: 45,
    },
    close: {
        position: 'absolute',
        left: 360,
        top: 6,
    },
})
