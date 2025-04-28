import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import FindScreen from '../screens/FindScreen';
import HostScreen from '../screens/HostScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AppContext from '../objects/AppContext';
import Globals from '../../GlobalVariables';
import * as Linking from 'expo-linking';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const Tab = createBottomTabNavigator();

const NavBar = ({ navigation }) => {
    const myContext = useContext(AppContext);
    const [handledLink, setHandledLink] = useState(false);

    const resetAndGo = async(json) => {
        const resetAction = CommonActions.reset({
            index: 0,
            routes: [{name: "Find",
                params: {
                    screen: "MainScreen",
                    params: {
                        OpenBottomSheet: true,
                        currEvent: json,
                    }
                }
            }],
            });
            navigation.dispatch(resetAction); 
    }
    const handleOpenLink = ({url}) => {
        if(!handledLink) {
        setHandledLink(true);
        //Linking.removeEventListener('url',handleOpenLink);

        if (url == null) {

        }
        else {
            const { queryParams } = Linking.parse(url);
            if (!queryParams || !queryParams.eventId) {

            }
            else {
                fetch(Globals.eventsURL + '/get/' + (parseInt(queryParams.eventId) + 10351))
                    .then((response) => response.json())
                    .then((json) => {
                        resetAndGo(json);
                    }).catch((error) => {
                        console.error(error);
                    })
            }
        }
        }
    };
    const goToUpdates = () => {
        const resetAction = CommonActions.reset({
            routes: [
                {
                    name: "Profile",
                    state: {
                        routes: [
                            {name:'MainScreen'},
                            {name: 'EventUpdatesScreen', params: {user: myContext.user}}
                        ],
                        index: 1
                    }
                }
            ],
            index: 0
          });
        myContext.toggleShowNavBar(false);
        navigation.dispatch(resetAction);
    }
    const getEvent = (eventId, screen) => {
        fetch(Globals.eventsURL + '/get/' + eventId)
        .then((response) => response.json())
        .then((json) => {
            resetAndGo(json);
        }).catch((error) => {
            console.error(error);
        })
    }
    useEffect(() => {
        console.log('mounting navBar.js');
        Linking.addEventListener('url',handleOpenLink);
        async function removeNoti() {
            await AsyncStorage.removeItem('@event' + myContext.notification.eventId);
        }
        if(myContext.notification != null) {
            if(myContext.notification.type == 'Reminder') {
                try {
                    removeNoti();
                    myContext.updateNotification(null);
                    getEvent(myContext.notification.eventId, "Find");
                } catch(e) {
                    myContext.updateNotification(null);
                    console.error(e);
                }
            }
            else if(myContext.notification.type == 'Invitation') {
                myContext.updateNotification(null);
                getEvent(myContext.notification.eventId, "Find");
            }
            else if(myContext.notification.type == 'Update' || myContext.notification.type == 'Cancellation') {
                myContext.updateNotification(null);
                goToUpdates();
            }
            else if(myContext.notification.type == 'Attendee') {
                myContext.updateNotification(null);
                getEvent(myContext.notification.eventId, "Attendees");
            }
        }
        return () => {
            console.log('unmounting navBar.js');
            Linking.removeEventListener('url',handleOpenLink);
        }
    },[myContext.notification])

    return (
        <Tab.Navigator
            tabBarOptions={{
                showLabel: false,
                style: {
                    position: 'absolute',
                    elevation: 0,
                    flex: 1,
                    backgroundColor: '#fff',
                    borderRadius: 0,
                    height: Math.min(95,Globals.HR(95)),
                    ...styles.shadow
                }
            }}
        >
            <Tab.Screen name="Find" component={FindScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', top: Globals.HR(5) }}>
                            <Image
                                source={require('../assets/findevents.png')}

                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: focused ? '#FFCB05' : 'black',
                                    marginBottom: 5,
                                }}
                            />
                            <View style={{ width: 70, }}>
                                <Text
                                    style={{ alignSelf: 'center', marginLeft: 1, color: focused ? '#FFCB05' : 'black', fontSize: 12 }}>
                                    FIND
                                </Text>
                            </View>

                        </View>
                    ),
                    tabBarVisible: myContext.navBarVisible,
                }}
            />
            <Tab.Screen name="Host" component={HostScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', top: Globals.HR(4) }}>
                            <Image
                                source={require('../assets/host.png')}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: focused ? '#FFCB05' : 'black',
                                    marginBottom: 5,
                                }}
                            />
                            <View style={{ width: 70, }}>
                                <Text
                                    style={{ alignSelf: 'center', marginLeft: 1, color: focused ? '#FFCB05' : 'black', fontSize: 12 }}>
                                    HOST
                                </Text>
                            </View>
                        </View>
                    ),
                    tabBarVisible: myContext.navBarVisible
                }}
            />
            <Tab.Screen name="Profile" component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', top: Globals.HR(4) }}>
                            <Image
                                source={require('../assets/profile.png')}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: focused ? '#FFCB05' : 'black',
                                    marginBottom: 5,
                                }}
                            />
                            <View style={{ width: 70, }}>
                                <Text
                                    style={{ alignSelf: 'center', marginLeft: 1, color: focused ? '#FFCB05' : 'black', fontSize: 12 }}>
                                    MY INFO
                                </Text>
                            </View>
                        </View>
                    ),
                    tabBarVisible: myContext.navBarVisible
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#00274C',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    }
})

export default NavBar;
