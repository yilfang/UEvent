import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Image, Alert} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import MyUpcomingScreen from './MyUpcomingScreen';
import EventsFollowingScreen from './EventsFollowingScreen';
import EventUpdatesScreen from './EventUpdatesScreen';
import IncomingInvScreen from './IncomingInvScreen';
import ProfileButton from '../objects/profileButton';
import Globals from '../../GlobalVariables';
import AppContext from '../objects/AppContext';
import EventDetailsScreen from './EventDetailsScreen';
import InviteScreen from './InviteScreen';
import CreateInviteList from './CreateInviteList';
import InviteListView from './InviteListView';
import InviteUser from './InviteUser';
import InvitePeopleScreen from './InvitePeopleScreen';
import { ManageAttendeesScreen } from './ManageAttendees';
import ManageEventStack from './ManageEvent';
import { useIsFocused } from '@react-navigation/native';
import IgnoredInvScreen from './IgnoredInvScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { NavigationActions } from 'react-navigation';

const HORIZONTALMARGIN = 20.4;

function MainScreen({ navigation }) {
    const myContext = useContext(AppContext);
    const user = { ...myContext.user, ...{ 'avatarsource': require('../assets/profileavatar.png') } }; //that last avatarsource thing is temporary
    const params = { user: user, deleteId: -1 }
    const profileIsFocused = useIsFocused();

    useEffect(() => {
        if (profileIsFocused) {
            myContext.toggleShowNavBar(true);
        }
    }, [profileIsFocused])

    const pressHandler = (screenName) => {
        navigation.navigate(screenName, params);
        myContext.toggleShowNavBar(false);
    }
    const localLogout = async () => {
        try {
            await AsyncStorage.removeItem('@authtoken'); 
            navigation.navigate('SignInScreen');
        }
        catch(e) {
            console.log(e.message);
            navigation.navigate('SignInScreen');
        }
    }
    const logoutHandler = () => {
        fetch(Globals.usersURL + '/deletePushToken',{
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                },
            body: JSON.stringify({
                pushToken: Globals.pushToken
            })
        }).then((response) => response.text())
            .then((text) => {
                console.log(text);
                localLogout();
            })
            .catch((error) => {console.error(error); Alert.alert("Couldn't Log Out","Sorry, we couldn't log you out. Please try again when you have better connection.")});
    } 

    return (
        <View style={styles.screenContainer}>
            <SafeAreaView>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.profileContainer}>
                        <Image source={user.avatarsource} style={styles.image} />
                        <Text style={styles.nameText}>{user.displayName}</Text>
                        <Text style={styles.emailText}>{user.email}</Text>
                        {/*interest icons go here, do later*/}
                    </View>
                    <View style={styles.buttonContainer}>
                        <Text style={styles.headerText}>My Event Info</Text>
                        <ProfileButton onPress={() => pressHandler('MyUpcomingScreen')} title='My Upcoming Events' />
                        <ProfileButton onPress={() => pressHandler('EventsFollowingScreen')} title="Events I Saved" />
                        <ProfileButton onPress={() => pressHandler('EventUpdatesScreen')} title='Event Updates' />
                        <Text style={styles.headerText}>Invitations</Text>
                        <ProfileButton onPress={() => pressHandler('IncomingInvScreen')} title='Incoming Invitations' />
                        <Text style={styles.headerText}>My Account</Text>
                        <ProfileButton onPress={() => {
                            navigation.navigate('Host');
                        }} title='Manage My Events' />
                        <ProfileButton onPress={logoutHandler} title='Logout' />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
const ProfileNavigator = createStackNavigator();

export default function ProfileNavigator1({ navigation }) {

    return (
        <ProfileNavigator.Navigator>
            <ProfileNavigator.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
            <ProfileNavigator.Screen name="MyUpcomingScreen" component={MyUpcomingScreen} options={{ headerShown: false }} />
            <ProfileNavigator.Screen name="EventsFollowingScreen" component={EventsFollowingScreen} options={{ headerShown: false }} />
            <ProfileNavigator.Screen name="EventUpdatesScreen" component={EventUpdatesScreen} options={{ headerShown: false }} />
            <ProfileNavigator.Screen name="IncomingInvScreen" component={IncomingInvScreen} options={{ headerShown: false }} />
            <ProfileNavigator.Screen name="IgnoredInvScreen" component={IgnoredInvScreen} options={{ headerShown: false }} />
            <ProfileNavigator.Screen name="EventDetailsScreen" component={EventDetailsScreen} options={{ headerShown: false }} />
            <ProfileNavigator.Screen name="InviteScreen" component={InviteScreen} options={{ headerShown: false }} />
            <ProfileNavigator.Screen name="CreateInviteList" component={CreateInviteList} options={{ headerShown: false }} />
            <ProfileNavigator.Screen name="InviteListView" component={InviteListView} options={{ headerShown: false }} />
            <ProfileNavigator.Screen name="InviteUser" component={InviteUser} options={{ headerShown: false }} />
            <ProfileNavigator.Screen name="InvitePeopleScreen" component={InvitePeopleScreen} options={{ headerShown: false }} />
            <ProfileNavigator.Screen name="Manage Event" component={ManageEventStack} options={{ headerShown: false }} />
        </ProfileNavigator.Navigator>
    )
}

// const ProfileContainer = createAppContainer(ProfileNavigator1);

// export default function FindScreen() {
//     return (
//         <ProfileContainer/>
//     );
// }
const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    profileContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    scrollContainer: {
        alignItems: 'flex-start',
        paddingBottom: 90
    },
    buttonContainer: {
        flex: 1,
        marginLeft: HORIZONTALMARGIN,
        width: '90%',
    },
    image: {
        flex: 1,
        width: 75,
        height: 75,
        marginTop: 40,
        resizeMode: 'contain',
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    emailText: {
        fontSize: 16,
        opacity: 0.5,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 28,
        marginBottom: 7,
    },
    headerButtonStyle: {
        fontSize: Globals.HR(18),
        color: '#0085FF',
        fontWeight: '700',
        margin: Globals.HR(5)
    }
})
