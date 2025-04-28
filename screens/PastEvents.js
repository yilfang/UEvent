import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Dimensions, StyleSheet, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import AppContext from '../objects/AppContext';
import Globals from '../../GlobalVariables';
import { useFocusEffect } from '@react-navigation/native';

//import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ManageEventScreen from './ManageEvent';
import { useIsFocused } from '@react-navigation/native';


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const EventBox = ({ navigation, myContext, item }) => {
    return (
        <TouchableOpacity onPress={() => { myContext.toggleShowNavBar(false); navigation.navigate('EventDetailsScreenPast', { user: myContext.user, currentEvent: item, from: 'Past Events' }) }} style={styles.box}>
            <View style={{ flex: 2, flexDirection: 'row' }}>
                <Image style={styles.realImageStyle} source={require('../assets/avatar.png')} />
            </View>
            <View style={{ flex: 6 }}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <Text style={{ fontWeight: '500', fontSize: 13, color: '#0085FF', marginBottom: '3%' }}>
                        {Globals.extraFormat(Globals.formatDate(item.startTime), Globals.formatDate(item.endTime))}</Text>
                    {/* <Image style={{ resizeMode: 'contain', flex: 1 }} source={require('../assets/NotificationBell.png')} /> */}
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "500", fontSize: 16, marginBottom: '3%' }}>{item.name}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={{ fontWeight: '500', fontSize: 13, color: '#09189F' }}>{Globals.getLocationName(item.location)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
function PastEventsScreen({ navigation }) {
    const myContext = useContext(AppContext);
    const PastIsFocused = useIsFocused();

    // event handler function
    const createEventHandler = () => {
        myContext.toggleShowNavBar(false);
        navigation.navigate('Create a New Event');
    }

    const [PastEvents, setPastEvents] = useState([]);

    const getEvents = () => {
        let fetchurl = Globals.eventsURL + '/getHostedEvents/' + myContext.user.id;
        fetch(fetchurl)
            .then((response) => response.json())
            .then((json) => {
                const pastData = json.filter(function (events) {
                    let dateobj = Globals.createDateAsUTC(events.endTime.substr(0, 4), events.endTime.substr(5, 2), events.endTime.substr(8, 2),
                        events.endTime.substr(11, 2), events.endTime.substr(14, 2), events.endTime.substr(17, 2));

                    return new Date() > dateobj;
                });
                setPastEvents(pastData);

            })
            .catch((error) => Alert.alert("Something Went Wrong", Globals.serverErrorMessage))
    }
    const [fetched, setFetched] = useState(false);
    useEffect(() => {
        if (PastIsFocused) {
            getEvents();
            myContext.toggleShowNavBar(true);
        }

    }, [navigation, PastIsFocused]);

    const renderItem = ({ item }) => (
        <EventBox item={item} navigation={navigation} myContext={myContext} />
    );

    const EmptyListMessage = () => {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: Globals.HR(24), lineHeight: 35, textAlign: 'center', padding: Globals.HR(20), justifyContent: 'center', flex: 1, fontWeight: '500', color: 'rgba(0, 0, 0, 0.5)', width: '80%' }}>
                    You haven't organized any events before. Create one below!</Text>
            </View>

        );
    }
    return (
        <SafeAreaView style={{ backgroundColor: '#fff', height: '100%' }}>
            <View style={{ height: '92%' }}>
                <FlatList
                    data={PastEvents}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    style={{ height: '100%' }}
                    ListEmptyComponent={EmptyListMessage}
                    contentContainerStyle={{ paddingBottom: 80 }}
                />
                <View style={{
                    position: 'absolute',
                    alignSelf: 'center',
                    bottom: (Dimensions.get('window').height < 700 || Dimensions.get('window').height > 1300) ? 40 : 30,
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
export default PastEventsScreen;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        padding: Globals.HR(5),
        flexDirection: 'column',
        flexWrap: 'wrap',
    },
    NewEventButton: {
        backgroundColor: '#fff',
        flex: 1
    },
    box: {
        width: '95%',
        padding: Globals.HR(10),
        margin: Globals.HR(10),
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
