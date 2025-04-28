import React, { useContext, useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AppContext from '../objects/AppContext';
import Globals from '../../GlobalVariables';
//import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ManageEventScreen from './ManageEvent';
import { useIsFocused } from '@react-navigation/native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const EventBox = ({ navigation, myContext, item }) => {

    return (
        <TouchableOpacity onPress={() => { myContext.toggleShowNavBar(false); navigation.navigate('EventDetailsScreen', { user: myContext.user, currentEvent: item, from: 'Upcoming Events' }); }} style={styles.box}>
            <View style={{ flex: 2, flexDirection: 'row' }}>
                <Image style={styles.realImageStyle} source={item.hasOwnProperty('eventImagePath') ?
                    { uri: Globals.imageBase + '/' + item.eventImagePath.replace(/\\/g, "/") } :
                    require('../assets/avatar.png')} />
            </View>
            <View style={{ flex: 6 }}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <Text style={{ fontWeight: '500', fontSize: 13, color: '#09189f', marginBottom: '3%' }}>
                        {Globals.extraFormat(Globals.formatDate(item.startTime), Globals.formatDate(item.endTime))}</Text>
                    {/* <Image style={{ resizeMode: 'contain', flex: 1 }} source={require('../assets/NotificationBell.png')} /> */}
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "500", fontSize: 16, marginBottom: '3%' }}>{item.name}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={{ fontWeight: '500', fontSize: 13, color: '#0085ff' }}>{Globals.getLocationName(item.location)}</Text>
                </View>
            </View>

        </TouchableOpacity>


    );
}
function UpcomingEventsScreen({ navigation }) {
    const myContext = useContext(AppContext);
    const UpcomingIsFocused = useIsFocused();
    // event handler function
    const createEventHandler = () => {
        myContext.toggleShowNavBar(false);
        navigation.navigate('Create a New Event');
    }
    const [UpcomingEvents, setUpcomingEvents] = useState([]);
    const [alerted, setAlerted] = useState(false);

    const getEvents = () => {
        let fetchurl = Globals.eventsURL + '/getHostedEvents/' + myContext.user.id;
        fetch(fetchurl)
            .then((response) => response.json())
            .then((json) => {

                const upcomingData = json.filter(function (events) {
                    let dateobj = Globals.createDateAsUTC(events.endTime.substr(0, 4), events.endTime.substr(5, 2), events.endTime.substr(8, 2),
                        events.endTime.substr(11, 2), events.endTime.substr(14, 2), events.endTime.substr(17, 2));

                    return new Date() < dateobj;
                });
                setUpcomingEvents(upcomingData);
            })
            .catch((error) => {
                if(!alerted) {
                    Alert.alert('Something Went Wrong', Globals.serverErrorMessage);
                    setAlerted(true);
                }
            })
    }
    useEffect(() => {
        if (UpcomingIsFocused) {
            getEvents();
            myContext.toggleShowNavBar(true);
        }

    }, [navigation, UpcomingIsFocused]);

    const renderItem = ({ item }) => {
        return (
            <EventBox item={item} navigation={navigation} myContext={myContext} />
        )

    };
    const EmptyListMessage = () => {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: Globals.HR(24), lineHeight: 35, textAlign: 'center', padding: Globals.HR(20), justifyContent: 'center', flex: 1, fontWeight: '500', color: 'rgba(0, 0, 0, 0.5)', width: '80%' }}>
                    You aren't hosting any upcoming events. Create one below!</Text>
            </View>
        );
    }
    return (
        <SafeAreaView style={{ backgroundColor: '#fff', height: '100%' }}>
            <View style={{ height: '92%' }}>

                <FlatList
                    data={UpcomingEvents}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    style={{ height: '100%' }}
                    //onScroll = {({nativeEvent}) => handleVisibility(nativeEvent)}
                    //onMomentumScrollBegin = {() => {if(up){setVisible(true);fadeIn()}}}
                    //onEndReachedThreshold = {0.01}
                    //onEndReached = {() => {if(offset > 5){console.log('end');fadeOut()}}}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    ListEmptyComponent={EmptyListMessage}
                />
                <View style={{
                    position: 'absolute',
                    alignSelf: 'center',
                    bottom: (Dimensions.get('window').height < 700 || Dimensions.get('window').height > 950) ? 40 : 30,
                }}>
                    <TouchableOpacity onPress={createEventHandler} activeOpacity={0.5}>
                        <View style={styles.selectContainer}>
                            <Text style={[styles.selectText, { paddingHorizontal: Globals.WR(50) }]}>+ Create New Event</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
export default UpcomingEventsScreen;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        padding: 5,
        flexDirection: 'column',
        flexWrap: 'wrap',
    },
    NewEventButton: {
        backgroundColor: '#fff9f3'
    },
    box: {
        width: '95%',
        padding: 10,
        margin: 10,
        flexDirection: 'row',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        backgroundColor: '#fff',
        flex: 1,
        borderRadius: 11

    },
    inner1: {
        flex: 2,

    },
    inner2: {
        flex: 3
    },
    realImageStyle: {
        height: Globals.WR(70),
        alignSelf: 'center',
        width: Globals.WR(70),
    },
    selectContainer: {
        backgroundColor: '#ffffff',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 50,
    },
    selectInvisible: {
        backgroundColor: '#ffffff',
        position: 'absolute',
        marginHorizontal: 50,
        bottom: 20,
        width: '0%',
        alignItems: 'center',
    },
    selectText: {
        fontWeight: '600',
        fontSize: Globals.formFontAdj(21),
        paddingVertical: 15,
        color: '#fab400',
    }

})
