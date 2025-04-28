import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, SafeAreaView, FlatList, Image, Dimensions } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Globals from '../../GlobalVariables';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import HeaderCheckBox from '../objects/HeaderCheckBox';

function BackButton({ onPress, title }) {
    return (
        <View style={styles.button}>
            <View style={styles.icon}>
                <TouchableOpacity onPress={onPress}>
                    <AntDesign name='left' size={24} color='#000000' />
                </TouchableOpacity>
            </View>

            <Text style={styles.buttonText}> {title} </Text>
        </View>
    );
}

export const ManageAttendeesScreen = ({ navigation, route }) => {
    const { apiData } = route.params;
    const [attendees, setAttendees] = useState([]);
    const [eventInfo, setEventInfo] = useState(apiData);

    const getEventAttendees = () => {
        let fetchurl = Globals.attendeesURL + '/getEventAttendees/' + apiData.id;
        fetch(fetchurl)
            .then((response) => response.json())
            .then((json) => { setAttendees(json); setMasterDataSource(json); })
            .catch((error) => Alert.alert("Something Went Wrong", Globals.serverErrorMessage))
    }
    useEffect(() => {
        getEventAttendees();
    }, []);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState('');
    const [masterDataSource, setMasterDataSource] = useState([]);

    const handleSearch = (text) => {
        // const formatQuery = text.toLowerCase();
        setQuery(text);
    }

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = masterDataSource.filter(function (item) {
                const itemData = item.userName
                    ? item.userName.toLowerCase()
                    : ''.toLowerCase();
                const itemData1 = item.userEmail
                    ? item.userEmail.toLowerCase()
                    : ''.toLowerCase();
                const textData = text.toLowerCase();
                return (itemData.indexOf(textData) > -1) || (itemData1.indexOf(textData) > -1);
            });
            setAttendees(newData);
            setQuery(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setAttendees(masterDataSource);
            setQuery(text);
        }
    };

    const updateAttendees = (attendeeId) => {
        // get removed attendee out of array
        const filteredData = attendees.filter(item => item.userId !== attendeeId);
        setAttendees(filteredData);
        setMasterDataSource(filteredData);

        fetch(Globals.attendeesURL + '/delete/?eventId=' + apiData.id + '&userId=' + attendeeId, { method: 'delete', })
            .then((response) => { })
            .catch((error) => Alert.alert("Something Went Wrong", Globals.serverErrorMessage));
    }
    const EmptyListMessage = () => {
        if (query == '') {
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: Globals.HR(24), textAlign: 'center', lineHeight: 35, padding: Globals.HR(20), justifyContent: 'center', flex: 1, fontWeight: '500', color: 'rgba(0, 0, 0, 0.5)', width: '80%' }}>You currently have no attendees for your event. Invite people or share the event to get people to come!</Text>
                </View>
            );
        }
        else {
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: Globals.HR(24), textAlign: 'center', padding: Globals.HR(20), justifyContent: 'center', flex: 1, fontWeight: '500', color: 'rgba(0, 0, 0, 0.5)', width: '80%' }}>No Results Found</Text>
                </View>
            );
        }
    }
    const [notify, setNotify] = useState(eventInfo.hasOwnProperty('hostNotis')?eventInfo.hostNotis:false); //use event's hostNotis, also check user's pushPermission
    const checkPress = () => {
        console.log(Globals.eventsURL + '/updateHostNotis/' + eventInfo.id + '/' + !notify);
        fetch(Globals.eventsURL + '/updateHostNotis/' + eventInfo.id + '/' + !notify, {
            method: 'put',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        }).then((response) => response.text())
          .then((text) => {console.log(text)})
          .catch((error) => console.error(error));
        eventInfo.hostNotis = !notify;
        apiData.hostNotis = !notify;
        setNotify(!notify);
    }
    const iconColor = '#adadad';
    return (
        <View style={{ backgroundColor: '#ffcb05', height: '100%', width: '100%' }}>

            <View>
                <SafeAreaView style={{ alignItems: 'center', marginLeft: 20, flexDirection: 'row',marginBottom: 10}}>
                    <BackButton onPress={() => navigation.goBack()} title='Confirmed Attendees' />
                </SafeAreaView>
                <View style={{ marginLeft: 20, marginRight: 20, marginBottom: 20}}>
                    <View style = {{position: 'absolute',left:8, top: 5, zIndex: 1}}>
                        <HeaderCheckBox title = 'Notify Me' value = {notify} onPress = {checkPress}/>
                    </View>
                    <View style={{ alignItems: 'flex-end',}}>
                        <TouchableOpacity style={{
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
                            onPress={() => navigation.navigate('InvitePeopleScreen', { event: apiData })}>
                            <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ justifyContent: 'center', marginRight: 5, fontWeight: 'bold', color: '#ffcb05', fontSize: 14 }}>Invite More</Text>
                                <Image source={require('../assets/add.png')} style={{ height: 12, width: 12, tintColor: '#ffcb05' }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
            <View style={{ backgroundColor: '#fff' }}>
                <SearchBar
                    containerStyle={{ backgroundColor: '#fff', marginBottom: 10 }}
                    inputContainerStyle={{ backgroundColor: 'white' }}
                    placeholder='Names or Emails'
                    onChangeText={(text) => searchFilterFunction(text)}
                    onClear={(text) => searchFilterFunction('')}
                    lightTheme
                    round
                    platform='default'
                    value={query}
                    inputStyle={styles.input}
                    inputContainerStyle={styles.inputContainer2}
                    containerStyle={styles.searchContainer1}

                    searchIcon={<Image source={require('../assets/search.png')} style={{ width: 26, height: 27, tintColor: iconColor, marginLeft: 2, }} />}
                    clearIcon={<Ionicons name='close-outline' size={28} color={iconColor}
                        onPress={() => searchFilterFunction('')} />}
                />
                <FlatList
                    data={attendees}
                    keyExtractor={item => item.userId.toString()}
                    style={{ height: Dimensions.get('window').height - (Dimensions.get('window').height > 700 ? 220 : 200), backgroundColor: 'white' }}
                    renderItem={({ item }) => (
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
                                    <View style={styles.button2}>
                                        <Text style={styles.buttonText2}> {item.userName} </Text>
                                        <View style={{ flexDirection: 'row', marginBottom: 5, marginLeft: 5 }}>
                                            <Text numberOfLines={1}>{item.userEmail}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={{ justifyContent: 'center', marginRight: 30 }}
                                        onPress={() => updateAttendees(item.userId)}>
                                        <View>
                                            <Image style={{ width: 25, height: 25 }} source={require('../assets/minus.png')}></Image>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={EmptyListMessage}
                    ListFooterComponent={() => (<Text style={{ marginBottom: 50 }}></Text>)}
                />
            </View>
        </View>

    );

}

const styles = StyleSheet.create({
    headerButtonStyle: {
        fontSize: 18,
        color: '#0085FF',
        fontWeight: '700'
    },
    box: {
        width: '90%',
        padding: 10,
        margin: 10,
        flexDirection: 'row',
        backgroundColor: '#fff',
        flex: 1

    },
    realImageStyle: {
        height: '100%',
        resizeMode: 'contain',
        width: '100%'

    },
    InviteContainer: {
        backgroundColor: '#0085FF',
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
        borderRadius: 10,
    },
    InviteText: {
        fontWeight: 'bold',
        fontSize: 22,
        paddingVertical: 15,
        paddingHorizontal: 60,
        color: '#FFFFFF',
    },
    delete: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FF5E5E',
        resizeMode: 'contain',
        alignSelf: 'center',

    },
    button: {
        paddingBottom: 20.4,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    icon: {

    },
    buttonText: {
        marginLeft: 20.4,
        fontSize: 24,
        fontWeight: 'bold'
    },
    buttonText2: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#434343',
        marginBottom: 5,
        marginTop: 5,
    },
    button2: {
        flex: 1,
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
})
