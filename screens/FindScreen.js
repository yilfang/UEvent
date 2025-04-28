import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { Dimensions, StyleSheet, Text, View, useColorScheme, TouchableOpacity, Image, Share, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import MapSearchBar from '../objects/mapSearchBar';
import CategoryList from './CategoryList';
import DateRange from './DateRange';
import TimeRange from './TimeRange';
import MapView from 'react-native-map-clustering';
//import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import LocationPin from '../objects/locationPin';
import AppContext from '../objects/AppContext';
import Globals from '../../GlobalVariables';
import SearchResult from '../objects/searchResult';
import EventDetailsScreen from './EventDetailsScreen';
import ManageEventStack from './ManageEvent';
import InviteScreen from './InviteScreen';
import InvitePeopleScreen from './InvitePeopleScreen';
import InviteListView from './InviteListView';
import CreateInviteList from './CreateInviteList';
import Report from '../objects/Report';
import { SafeAreaView } from 'react-native-safe-area-context';
//import { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Linking from 'expo-linking';

function MainScreen({ navigation, route }) {
  const DarkTheme = useColorScheme();
  const myContext = useContext(AppContext);
  /*
  Geocoder.init('AIzaSyCwpmhlqGnuN1m-MdKp0FOpVZwFR1QFqug');
  Geocoder.from("2281 Bonisteel Blvd, Ann Arbor, MI, 48109")
  .then(json => {
    var location = json.results[0].geometry.location;
  })
  .catch(error => console.warn(error));
  */
  const [currentEvent, setCurrentEvent] = useState({
    "id": 1,
    "name": "OSU Pregame Tailgate",
    "Email": "",
    "disabled": false,
    "Images": "",
    "location": "None",
    "privateEvent": "Public",
    "organizerWebsite": "",
    "Invitees": "",
    "latitude": "42.27475",
    "Attendees": "",
    "longitude": "-83.72904",
    "organizer": "None",
    "endTime": "7/8/2021 19:30",
    "description": "None",
    "locationName": "None",
    "locationDetails": "None",
    "mainCategoryId": "Parties",
    "registrationLink": "",
    "startTime": "7/8/2021",
    "virtualEvent": "In Person",
    "categoryIds": "Greek Life Social Food/Drink ",
    "host": {
      "id": -1,
    },
    "hostNotis": false,
    "isFollower": false,
    "isAttendee": false,
    "isInvitee": false,
  });
  const [index, setIndex] = useState(-1);
  const windowHeight = Dimensions.get('window').height;
  const bs = useRef();
  const bs2 = useRef();
  const mapRef = useRef(null);
  const fall = new Animated.Value(1);
  const fall2 = new Animated.Value(1);

  const renderCategories = () => {
    const imgSource = currentEvent.hasOwnProperty('mainCategory') ? Globals.categoryAssets[currentEvent.mainCategory.replace(/\W/g, '')] : require('../assets/categories.png');
    return (
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={imgSource}
          style={{ width: 18, height: 18, tintColor: '#fab400' }}>
        </Image>
        <Text numberOfLines={currentEvent.hasOwnProperty('mainCategory') && currentEvent.mainCategory.indexOf('/') == -1 ? 1 : 2}
          style={{ marginLeft: 5, fontSize: 16, fontWeight: '600', color: '#fab400', maxWidth: Globals.formFontAdj(160) }}>{currentEvent.mainCategory}</Text>
      </View>
    )
  }
  const registration = () => {
    if (currentEvent.registrationLink != '') {
      return (
        <View>
          <Text style={{ fontWeight: '600', fontSize: 18, marginBottom: 10,}}>Registration</Text>
          <Text style={{ fontSize: 15, marginBottom: 15, color: '#0085ff', textDecorationLine: 'underline' }}
            onPress={() => Linking.openURL(currentEvent.registrationLink)} numberOfLines = {2}> 
            {currentEvent.registrationLink}
          </Text>
        </View>
      )
    }
  }
  const moreDetails = () => {
    if (currentEvent.organizerEmail != '' && currentEvent.organizerWebsite != '') {
      return (
        <View>
          <Text style={{ fontWeight: '600', fontSize: 18, marginBottom: 10, }}>More Details</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 15 }}>Email: </Text>
            <Text style={{ fontSize: 15, marginBottom: 8, }}>{currentEvent.organizerEmail}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 15, marginBottom: 5, }}>Website: </Text>
            <Text style={{ fontSize: 15, marginBottom: 10, color: '#0085ff', textDecorationLine: 'underline' }}
              onPress={() => Linking.openURL(currentEvent.organizerWebsite)}>
              {currentEvent.organizerWebsite.substr(0, 35) + (currentEvent.organizerWebsite.length > 35 ? '...' : '')}
            </Text>
          </View>
        </View>
      )
    } else if (currentEvent.organizerEmail != '') {
      return (
        <View>
          <Text style={{ fontWeight: '600', fontSize: 18, marginBottom: 10, }}>More Details</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 15 }}>Email: </Text>
            <Text style={{ fontSize: 15, marginBottom: 5, }}>{currentEvent.organizerEmail}</Text>
          </View>
        </View>
      )
    } else if (currentEvent.organizerWebsite != '') {
      return (
        <View>
          <Text style={{ fontWeight: '600', fontSize: 18, marginBottom: 10, }}>More Details</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 15, marginBottom: 5, }}>Website: </Text>
            <Text style={{ fontSize: 15, marginBottom: 10, color: '#0085ff', textDecorationLine: 'underline' }}
              onPress={() => Linking.openURL(currentEvent.organizerWebsite)}>
              {currentEvent.organizerWebsite.substr(0, 35) + (currentEvent.organizerWebsite.length > 35 ? '...' : '')}
            </Text>
          </View>
        </View>
      )
    }
    else {
      return null;
    }
  }
  const buttonColor1 = currentEvent.isFollower ? '#FFCB05' : '#FFF';

  const modifyApi = (follow, add) => {
    const fetchurl = follow ? Globals.followersURL : Globals.attendeesURL;
    if (add) {
      fetch(fetchurl + '/json/add', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: myContext.user.id,
          eventId: currentEvent.id,
        })
      }).then((response) => response.json())
        .then((json) => {
          if (index != -1) {
            let temp = [...myContext.eventList];
            if (follow) {
              temp[index] = JSON.parse(JSON.stringify({ ...currentEvent, ...{ isFollower: true } }));
            }
            else {
              temp[index] = JSON.parse(JSON.stringify({ ...currentEvent, ...{ isAttendee: true } }));
              if(currentEvent.hasOwnProperty('hostNotis') && currentEvent.hostNotis == true)
                Globals.sendOrganizerNoti(currentEvent.host.id, currentEvent.id, currentEvent.name, myContext.user.displayName);
            }
            myContext.updateEventList(temp);
          }
          setCurrentEvent((prevCurrentEvent) => { //server validation is checked by converting to json and catching error
            if (follow)
              return ({ ...prevCurrentEvent, ...{ isFollower: true } })
            else
              return ({ ...prevCurrentEvent, ...{ isAttendee: true } })
          })
          const startingTime = new Date(currentEvent.startTime.substr(0,10) + 'T' + currentEvent.startTime.substr(11,8));
          startingTime.setHours(startingTime.getHours()-5); //server error offset, with DST = 4, without = 5
          Globals.scheduleNoti(currentEvent.id, currentEvent.name, startingTime);
        }
        )
        .catch((error) => /*Alert.alert('Server Error', "Sorry, we're unable to process your request. Please try again later :(")*/
                          Alert.alert("Server Error",error));
    }
    else { //delete
      fetch(fetchurl + '/delete?eventId=' + currentEvent.id + '&userId=' + myContext.user.id, {
        method: 'delete',
      }
      ).then((response) => response.text())
        .then((text) => {
          if (Globals.serverValidation(text)) {
            if (index != -1) {
              let temp = [...myContext.eventList];
              if (follow)
                temp[index] = JSON.parse(JSON.stringify({ ...currentEvent, ...{ isFollower: false } }));
              else {
                temp[index] = JSON.parse(JSON.stringify({ ...currentEvent, ...{ isAttendee: false } }));
              }
              myContext.updateEventList(temp);
            }
            setCurrentEvent((prevCurrentEvent) => {
              if (follow) {
                return ({ ...prevCurrentEvent, ...{ isFollower: false } })
              }
              else
                return ({ ...prevCurrentEvent, ...{ isAttendee: false } })
            })
            if((follow && !currentEvent.isAttendee) || (!follow && !currentEvent.isFollower))
              Globals.cancelNoti(currentEvent.id);
          }
        })
        .catch((error) => Alert.alert('Server Error', "Sorry, we're unable to process your request. Please try again later :("));
    }
  }
  const toggle1 = () => {
    if (buttonColor1 == '#FFF') {
      modifyApi(true, true);
    }
    else {
      modifyApi(true, false);
    }
  }
  const buttonColor2 = currentEvent.isAttendee ? '#FFCB05' : '#FFF';

  const toggle2 = () => {
    if (buttonColor2 == '#FFF') {
      modifyApi(false, true);
    } else {
      modifyApi(false, false);
    }
  }
  const onShare = async () => {
    if (!currentEvent.privateEvent || currentEvent.host.id == myContext.user.id) {
      try {
        const result = await Share.share({
          title: 'Event Link',
          message: 'Check out this event!',
          url: Linking.createURL('uevent.app/noApp.html', { //used to be event instead of noApp.html
            queryParams: {
              eventId: (parseInt(currentEvent.id) - 10351)
            },
          })
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        alert(error.message);
      }
    }
    else {
      Alert.alert('Private Event', "Sorry, you can't share private events unless you're the host.");
    }
  }
  const [buttonColor3, setButtonColor3] = useState('#FFF')
  const toggle3 = () => {
    onShare();
  }
  const borderColor = (buttonColor) => {
    if (buttonColor == '#FFF') {
      return 'black'
    } else {
      return 'white'
    }
  }
  const [showReadMore, setShowReadMore] = useState(false);
  const [isTruncated, setIsTruncated] = useState(true);
  const resultString = currentEvent.description;
  const readMore = isTruncated ? 'Read More' : 'Read Less'
  const toggle = () => {
    setIsTruncated(!isTruncated);
  }
  const onTextLayout = useCallback(e => {
    setShowReadMore(e.nativeEvent.lines.length >= 4);
  },[])
  const renderButton = () => {
    if (showReadMore) {
      return (
        <TouchableOpacity onPress={toggle}>
          <Text style={{ color: '#FFCB05', marginBottom: 10 }}>{readMore}</Text>
        </TouchableOpacity>
      );
    }
  }
  const renderTime = () => {
    return Globals.extraFormat(Globals.formatDate(currentEvent.startTime), Globals.formatDate(currentEvent.endTime));
  }
  const openMap = () => {
    const scheme = 'maps:0,0?q=';
    const latLng = `${currentEvent.latitude},${currentEvent.longitude}`;
    const label = Globals.getLocationName(currentEvent.location);
    const url = `${scheme}${label}@${latLng}`
    Linking.openURL(url);
  }
  const [reportVisible, setReportVisible] = useState(false);

  const renderInner = () => (
    <View style={{padding: 20,
      backgroundColor: DarkTheme === 'dark' ? '#414446' : 'white',
      paddingTop: 20,}}>
      <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 20}}>
        <View>
          <Text style={{
            fontSize: 24,
            width: Dimensions.get('window').width - 105,
            marginRight: 10,
            fontWeight: '500',
            color: DarkTheme === 'dark' ? 'white' : '#2b2d2f'
          }}
            numberOfLines={2}>
            {currentEvent.name}
          </Text>
        </View>
        <View style={{ borderRadius: 5, borderWidth: 1, borderColor: DarkTheme === 'dark' ? 'white' : '#2b2d2f', padding: 5, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: DarkTheme === 'dark' ? 'white' : '#2b2d2f', }}>{currentEvent.privateEvent ? "Private" : "Public"}</Text>
        </View>

      </View>
      <View style={styles.panelHost}>
        <Image
          source={require('../assets/Vector.png')}
          style={{ width: 19, height: 19, tintColor: '#fab400' }}>
        </Image>
        <Text style={{ marginLeft: 5, maxWidth: Globals.formFontAdj(200), marginRight: 15, fontSize: 16, fontWeight: '600', color: '#fab400', marginBottom: 3}}>{currentEvent.organizer}</Text>
        {renderCategories()}
      </View>
      <View style={styles.panelDate}>
        <Image
          source={require('../assets/CalendarIcon.png')}
          style={{ width: 18, height: 18, tintColor: '#f8546c' }}
        ></Image>
        <Text numberOfLines={2} style={{ marginLeft: 5, fontSize: 16, fontWeight: '600', color: '#f8546c', maxWidth: Dimensions.get('window').width - 60 }}>{renderTime()}</Text>
      </View>

      {myContext.user.id != currentEvent.host.id ?
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 20 }}>
          <TouchableOpacity style={{
            backgroundColor: buttonColor1,
            borderRadius: 8,
            borderColor: borderColor(buttonColor1),
            borderWidth: 1,
            width: (Dimensions.get('window').width - 81.6) / 3,
            height: 55,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 15,
          }}
            onPress={toggle1}>
            <View>
              <Image
                source={require('../assets/star.png')}
                style={{ height: 18, width: 18, alignSelf: 'center', tintColor: borderColor(buttonColor1) }}
              ></Image>
              <Text style={{
                fontSize: 17,
                fontWeight: 'bold',
                color: borderColor(buttonColor1),
              }}>Save</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{
            backgroundColor: buttonColor2,
            borderRadius: 8,
            borderColor: borderColor(buttonColor2),
            borderWidth: 1,
            width: (Dimensions.get('window').width - 81.6) / 3,
            height: 55,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 15,
          }}
            onPress={toggle2}>
            <View>
              <Image
                source={require('../assets/check2.png')}
                style={{ height: 19, width: 18.2, alignSelf: 'center', tintColor: borderColor(buttonColor2) }}
              ></Image>
              <Text style={{
                fontSize: 17,
                fontWeight: 'bold',
                color: borderColor(buttonColor2),
              }}>I'm Going</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{
            backgroundColor: buttonColor3,
            borderRadius: 8,
            borderColor: borderColor(buttonColor3),
            borderWidth: 1,
            width: (Dimensions.get('window').width - 81.6) / 3,
            height: 55,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 15,
          }}
            onPress={toggle3}>
            <View>
              <Image
                source={require('../assets/share2.png')}
                style={{ height: 23, width: 23, marginTop: -2, alignSelf: 'center', tintColor: borderColor(buttonColor3) }}
              ></Image>
              <Text style={{
                fontSize: 17,
                fontWeight: 'bold',
                color: borderColor(buttonColor3),
              }}>Share</Text>
            </View>
          </TouchableOpacity>
        </View> :
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 20 }}>
          <TouchableOpacity style={{
            backgroundColor: buttonColor1,
            borderRadius: 8,
            borderColor: borderColor(buttonColor1),
            borderWidth: 1,
            width: (Dimensions.get('window').width - 81.6) / 3,
            height: 55,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 15,
          }}
            onPress={() => { navigation.navigate('Manage Event', { screen: 'Manage Event', params: { item: currentEvent, goToFind: true, fromEdit: false } }) }}>
            <View>
              <Image
                source={require('../assets/manage.png')}
                style={{ height: 18, width: 21.5, alignSelf: 'center', tintColor: borderColor(buttonColor1) }}
              ></Image>
              <Text style={{
                fontSize: 17,
                fontWeight: 'bold',
                color: borderColor(buttonColor1),
              }}>Manage</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{
            backgroundColor: buttonColor3,
            borderRadius: 8,
            borderColor: borderColor(buttonColor3),
            borderWidth: 1,
            width: (Dimensions.get('window').width - 81.6) / 3,
            height: 55,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 15,
          }}
            onPress={() => navigation.navigate('InviteScreen', { event: currentEvent })}>
            <View>
              <Image
                source={require('../assets/invitation.png')}
                style={{ height: 18, width: 18, alignSelf: 'center', tintColor: borderColor(buttonColor3) }}
              ></Image>
              <Text style={{
                fontSize: 17,
                fontWeight: 'bold',
                color: borderColor(buttonColor3),
              }}>Invite</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{
            backgroundColor: buttonColor3,
            borderRadius: 8,
            borderColor: borderColor(buttonColor3),
            borderWidth: 1,
            width: (Dimensions.get('window').width - 81.6) / 3,
            height: 55,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 15,
          }}
            onPress={toggle3}>
            <View>
              <Image
                source={require('../assets/share2.png')}
                style={{ height: 21, width: 16, alignSelf: 'center', tintColor: borderColor(buttonColor3) }}
              ></Image>
              <Text style={{
                fontSize: 17,
                fontWeight: 'bold',
                color: borderColor(buttonColor3),
              }}>Share</Text>
            </View>
          </TouchableOpacity>
        </View>
      }
      <View>
        <Image source={currentEvent.hasOwnProperty('eventImagePath') ?
          { uri: Globals.imageBase + '/' + currentEvent.eventImagePath.replace(/\\/g, "/") } :
          require('../assets/avatar.png')}
          resizeMode='cover'
          style={{ width: Dimensions.get('window').width - 40.8, height: Dimensions.get('window').height >700?230:200, marginBottom: 15 }}>
        </Image>
      </View>
      <Text style={{ color: DarkTheme === 'dark' ? 'white' : '#2b2d2f',fontWeight: '600', fontSize: 18, marginBottom: 10 }}>Event Description</Text>
      <View>
        <Text onTextLayout = {onTextLayout} numberOfLines={isTruncated?4:40} style={{ color: DarkTheme === 'dark' ? 'white' : '#2b2d2f',fontSize: 15, marginBottom: 10, lineHeight: 20,}}>{resultString}</Text>
        {renderButton()}
      </View>
      <Text style={{ color: DarkTheme === 'dark' ? 'white' : '#2b2d2f',fontWeight: '600', fontSize: 18, marginBottom: 10 }}>Location</Text>
      {/*<Text style = {{fontSize: 15, marginBottom: 3}}>{currentEvent.locationName}</Text>*/}
      <Text style={{ color: DarkTheme === 'dark' ? 'white' : '#2b2d2f',fontSize: 15, marginBottom: currentEvent.locationDetails == '' ? 15 : 5, color: '#0085ff', textDecorationLine: 'underline' }}
        onPress={openMap}>
        {currentEvent.location}
      </Text>
      {currentEvent.locationDetails != '' ? <Text style={{ fontSize: 15, marginBottom: 15, }}>({currentEvent.locationDetails})</Text> : null}
      {registration()}
      {moreDetails()}

      <TouchableOpacity style={{ flexDirection: 'row' }}>
        {/*
              <Image
                source={require('../assets/CalendarIcon.png')}
                style={{width:18, height: 18, marginBottom: 5}}>
              </Image>
              */}
        {/*<Text style={{marginLeft: 5, maxWidth: 200, marginRight: 15, fontSize: 16, color: '#03a9f4'}}>Add Event to Calendar</Text>*/}
      </TouchableOpacity>
      <TouchableOpacity style={{ flexDirection: 'row', marginBottom: Dimensions.get('window').height>926 ? 600 : 200 }}
        onPress={() => setReportVisible(true)}>
        <Image
          source={require('../assets/report.png')}
          style={{ width: 18, height: 18, tintColor: '#f8546c', marginTop: 10, }}>
        </Image>
        <Text style={{ marginLeft: 5, maxWidth: 200, marginRight: 15, marginTop: 9, fontSize: 16, color: '#f8546c' }}>Report</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={{backgroundColor: DarkTheme === 'dark' ? '#414446' : 'white',
    shadowColor: '#333333',
    shadowOffset: { width: -1, height: -2 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,}}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle}>
        </View>
      </View>
    </View>
  );
  const renderInner2 = () => (
    <View style={{ backgroundColor: 'white' }}>
      {myContext.eventList.map((item, index) => {
        return (
          <View key={item.id} style={{ marginTop: 10, }}>
            <SearchResult onPress={() => {
              bs2.current.snapTo(1);
              setSnapPosition2(1);
              mapRef.current.animateToRegion({ latitude: item.latitude, longitude: item.longitude, latitudeDelta: 0.003, longitudeDelta: 0.0015 }, 500);
              openBottomSheet(item, index);
            }}
              title={item.name} organizer={item.organizer}
              time={Globals.extraFormat(Globals.formatDate(item.startTime), Globals.formatDate(item.endTime))} />
          </View>
        )
      })}
      {myContext.eventList.length == 0 ?

        <Text style={{ color: DarkTheme === 'dark' ? 'white' : '#2b2d2f',alignSelf: 'center', fontWeight: '600', color: 'rgba(0, 0, 0, 0.5)', fontSize: 21, marginTop: Globals.HR(40) }}>No Results Found :(</Text> :
        null
      }
      <Text style={{ color: DarkTheme === 'dark' ? 'white' : '#2b2d2f',marginBottom: Dimensions.get('window').height, }}></Text>
    </View>
  )

  const renderHeader2 = () => (
    <View style={{
      backgroundColor: '#fff',
      shadowColor: '#333333',
      shadowOffset: { width: -1, height: -2 },
      shadowRadius: 2,
      shadowOpacity: 0.4,
      paddingTop: 15,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      zIndex: 1,
    }}>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View>
          <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 16, marginLeft: 10, marginBottom: 15, }}>Search Results</Text>
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity style={{ width: 80, alignSelf: 'flex-end' }}
            onPress={() => {
              searchParams.SearchType = 'none'; searchParams.SearchText = ''; myContext.changeMapSearchText('');
              searchParams.Categories.length = 0; searchParams.TimeRange.startTime = ''; searchParams.TimeRange.endTime = '';
              searchParams.TimeRange.value = 'Anytime'; bs2.current.snapTo(0); setSnapPosition2(0); myContext.toggleShowNavBar(true);
              navigation.navigate('MainScreen', searchParams)
            }
            }>
            <Text style={{ fontWeight: 'bold', color: 'red', fontSize: 16, marginBottom: 15, }}>CLEAR</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );

  const [snapPosition, setSnapPosition] = useState(0);

  const openBottomSheet = (event, index) => {
    if (snapPosition == 1) {
      setCurrentEvent(event);
      setIndex(index);
      setIsTruncated(true);
    }
    else if (snapPosition == 0) {
      myContext.toggleShowNavBar(false);
      bs.current.snapTo(1);
      setCurrentEvent(event);
      setIndex(index);
      setSnapPosition(1);
      setIsTruncated(true);
    }
  }

  const [snapPosition2, setSnapPosition2] = useState(0);

  const openBottomSheet2 = () => {
    if (snapPosition2 == 1) {

    }
    else if (snapPosition2 == 0) {
      myContext.toggleShowNavBar(false);
      bs2.current.snapTo(1);
      setSnapPosition2(1);
    }
  }
  const compareEvents = (event1, event2) => {
    let score1 = 0;
    let score2 = 0;

    if (searchParams.SearchText != '') {
      if (event1.name.indexOf(searchParams.SearchText) != -1)
        score1 += 12;
      if (event2.name.indexOf(searchParams.SearchText) != -1)
        score2 += 12;
    }
    if (searchParams.Categories.length > 0) {
      for (let i = 0; i < searchParams.Categories.length; i++) {
        if (event1.mainCategoryId == searchParams.Categories[i].id)
          score1 += 5;
        if (event2.mainCategoryId == searchParams.Categories[i].id)
          score2 += 5;
      }
    }
    if (searchParams.TimeRange.value != 'Anytime') {
      const startTime = new Date(searchParams.TimeRange.startTime.substr(0, 10) + 'T' + searchParams.TimeRange.startTime.substr(11, 8));
      const endTime = new Date(searchParams.TimeRange.endTime.substr(0, 10) + 'T' + searchParams.TimeRange.endTime.substr(11, 8));

      const eventStart1 = new Date(event1.startTime.substr(0, 10) + 'T' + event1.startTime.substr(11, 8));
      const eventEnd1 = new Date(event1.endTime.substr(0, 10) + 'T' + event1.endTime.substr(11, 8));
      const eventStart2 = new Date(event2.startTime.substr(0, 10) + 'T' + event2.startTime.substr(11, 8));
      const eventEnd2 = new Date(event2.endTime.substr(0, 10) + 'T' + event2.endTime.substr(11, 8));

      if (eventStart1 > startTime && eventEnd1 < endTime)
        score1 += 7;
      else if (eventStart1 > startTime)
        score1 += 4;
      else if (eventEnd1 < endTime)
        score1 += 2;

      if (eventStart2 > startTime && eventEnd2 < endTime)
        score2 += 7;
      else if (eventStart2 > startTime)
        score2 += 4;
      else if (eventEnd2 < endTime)
        score2 += 2;
    }
    return score1 < score2;
  }
  const searchParams = route.params;
  const [alerted,setAlerted] = useState(false);
  const getEvents = () => { //gets ONLY eventId, name, lat, lng, virtualEvent, and mainCategoryId,  

    if (searchParams.SearchType == 'none') {
      let fetchurl = Globals.eventsURL + '/active/' + myContext.user.id;
      //let fetchurl = Globals.eventsURL;
      fetch(fetchurl)
        .then((response) => response.json())
        .then((json) => {
          myContext.updateEventList(json);

          if (searchParams.OpenBottomSheet == true && searchParams.currEvent.hasOwnProperty("id")) {
            let index = -1;
            for (let i = 0; i < json.length; i++) {
              if (searchParams.currEvent.id == json[i].id) {
                index = i;
                break;
              }
            }
            if (index != -1) {
              mapRef.current.animateToRegion({ latitude: json[index].latitude, longitude: json[index].longitude, latitudeDelta: 0.005, longitudeDelta: 0.0025 });
              openBottomSheet(json[index], index);
            }
            else {
              if (searchParams.currEvent.disabled)
                Alert.alert('Event Cancelled', 'Sorry, the event you were linked to was cancelled earlier.');

              else {
                const now = new Date();
                const eventEnd = new Date(searchParams.currEvent.endTime.substr(0, 10) + 'T' + searchParams.currEvent.endTime.substr(11, 8));
                eventEnd.setHours(eventEnd.getHours() - 4);

                if (now > eventEnd)
                  Alert.alert('Event Expired', 'Sorry, the event you were linked to has already happened.');

                else {
                  if (searchParams.currEvent.privateEvent) {
                    //since getting here means the event is private and inaccessible, there should be no way the user follows, attends, or was
                    //invited to this event. Therefore:
                    searchParams.currEvent.isFollower = false;
                    searchParams.currEvent.isAttendee = false;
                    searchParams.currEvent.isInvitee = false;
                    const ind = myContext.eventList.length;
                    myContext.updateEventList([...myContext.eventList, searchParams.currEvent]);
                    mapRef.current.animateToRegion({ latitude: searchParams.currEvent.latitude, longitude: searchParams.currEvent.longitude, latitudeDelta: 0.005, longitudeDelta: 0.0025 });
                    openBottomSheet(searchParams.currEvent, ind);
                    Alert.alert('Private Event',
                      'Please ask the event organizer for an invitation to this event. Until you are invited, you will only be be able to ' +
                      'access this event through the link.')
                  }
                }
              }
            }
            searchParams.OpenBottomSheet = false;
          }
        })
        .catch((error) => {
          if(!alerted) {
            Alert.alert("Something Went Wrong", Globals.serverErrorMessage);
            console.error(error);
            setAlerted(true);
          }
        });
    }

    else if (searchParams.SearchType == 'text') {
      let fetchurl = Globals.eventsURL + '/search?userId=' + myContext.user.id + '&keyword=' + searchParams.SearchText;

      if (searchParams.Categories.length > 0) {
        for (let i = 0; i < searchParams.Categories.length; i++) {
          fetchurl += '&catIds=' + searchParams.Categories[i].id;
        }
      }
      if (searchParams.TimeRange.value != 'Anytime') {
        fetchurl += '&startTime=' + searchParams.TimeRange.startTime + '&endTime=' + searchParams.TimeRange.endTime;
      }

      fetch(fetchurl)
        .then((response) => response.json())
        .then((json) => {
          myContext.updateEventList(json.sort(compareEvents));
          if (json.length == 1) {
            mapRef.current.animateToRegion({ latitude: json[0].latitude, longitude: json[0].longitude, latitudeDelta: 0.005, longitudeDelta: 0.0025 })
          }
          else if (json.length > 1) {
            let coordarray = [];
            for (let i = 0; i < json.length; i++) {
              coordarray.push({ latitude: json[i].latitude, longitude: json[i].longitude })
            }
            mapRef.current.fitToCoordinates(coordarray, { animated: true })
          }
        })
        .catch((error) => {console.error(error);Alert.alert("Something Went Wrong", Globals.serverErrorMessage)});
    }
    else if (searchParams.SearchType == 'filter') {
      let fetchurl = Globals.eventsURL + '/search?userId=' + myContext.user.id;

      if (searchParams.SearchText != "") {
        fetchurl += '&keyword=' + searchParams.SearchText;
      }
      if (searchParams.Categories.length > 0) {
        for (let i = 0; i < searchParams.Categories.length; i++) {
          fetchurl += '&catIds=' + searchParams.Categories[i].id;
        }
      }
      if (searchParams.TimeRange.value != 'Anytime') {
        fetchurl += '&startTime=' + searchParams.TimeRange.startTime + '&endTime=' + searchParams.TimeRange.endTime;
      }
      fetch(fetchurl)
        .then((response) => response.json())
        .then((json) => {
          myContext.updateEventList(json.sort(compareEvents));
          if (json.length == 1) {
            mapRef.current.animateToRegion({ latitude: json[0].latitude, longitude: json[0].longitude, latitudeDelta: 0.005, longitudeDelta: 0.0025 })
          }
          else if (json.length > 1) {
            let coordarray = [];
            for (let i = 0; i < json.length; i++) {
              coordarray.push({ latitude: json[i].latitude, longitude: json[i].longitude })
            }
            mapRef.current.fitToCoordinates(coordarray, { animted: true })
          }
        })
        .catch((error) => {console.error(error);Alert.alert("Something Went Wrong", Globals.serverErrorMessage)});
    }
  }
  const findIsFocused = useIsFocused();

  useEffect(() => {
    if (findIsFocused) {
      if (searchParams.back == true)
        searchParams.back = false;
      else
        getEvents();
    }
    if (findIsFocused && myContext.postedEvent.inUse) {
      mapRef.current.animateToRegion({
        latitude: myContext.postedEvent.latitude - 0.0002,
        longitude: myContext.postedEvent.longitude,
        latitudeDelta: 0.0028,
        longitudeDelta: 0.0014,
      }, 1000);

      openBottomSheet(myContext.postedEvent, -1) //this index is bullshit but I think i can get away with it because index is only needed for saving/going to events
      myContext.changePostedEvent({ inUse: false })
    }

    else {
      if (findIsFocused) {
        if (searchParams.CloseBotSheet == true) {
          bs.current.snapTo(0);
          setSnapPosition(0);
          searchParams.CloseBotSheet = false;
        }
        if (searchParams.CloseBotSheet2 == true) { //only true if no search
          bs2.current.snapTo(0);
          setSnapPosition2(0);
          searchParams.CloseBotSheet2 = false;
        }
        if (searchParams.SearchType != 'none') {
          openBottomSheet2();
        }
        if (searchParams.refreshCurrent == true && searchParams.currEvent.hasOwnProperty("id")) {
          setCurrentEvent(searchParams.currEvent);
          searchParams.refreshCurrent = false;
          searchParams.currEvent = {};
        }
        if (snapPosition == 0 && searchParams.SearchType == 'none')
          myContext.toggleShowNavBar(true);
        else
          myContext.toggleShowNavBar(false);
      }
    }

  }, [navigation, route, findIsFocused]);

  const matchesCriteria = (event) => {
    if (event.virtualEvent == 'In Person') { //first line of basic checks
      if (searchParams.SearchType == 'text') {
        if (event.name == searchParams.SearchText)
          return true;
        return false;
      }
      else if (searchParams.SearchType == 'filter') {
        if (searchParams.Categories.length > 0 && event.mainCategoryId == searchParams.Categories[0].name) {
          return true;
        }
        return false;
      }
      else { //searchtype == none
        return true;
      }
    }
    return false;
  }

  const renderEvents = () => {
    return (
      myContext.eventList.map((item, index) => {
        //if(matchesCriteria(item)) {
        if (!item.name || !item.id || !item.latitude || !item.longitude || !item.mainCategory) {
          Alert.alert("Something Went Wrong", "Something went wrong. Our fault. Sorry about this.");
        }
        return (
          <Marker key={item.id}
            coordinate={{ latitude: parseFloat(item.latitude), longitude: parseFloat(item.longitude) }}
            onPress={() => openBottomSheet(item, index)}>
            <LocationPin title={item.name} mainCategory={item.mainCategory} />
          </Marker>
        )
        //}
      })
    )
  }
  return (
    <View style={styles.container}>
      <MapView style={styles.map}
        //provider = {PROVIDER_GOOGLE}
        //customMapStyle = {mapStyle}
        ref={mapRef}
        initialRegion={{
          latitude: 42.278,
          longitude: -83.728,
          latitudeDelta: 0.056,
          longitudeDelta: 0.028,
        }}
        showCompass={false}
        showsPointsOfInterest={true}
        rotateEnabled={false}
        clusterColor = '#f8546c'
        //userInterfaceStyle = 'dark'
      >
        {renderEvents()}
      </MapView>

      <SafeAreaView style={styles.topbar}>
        <MapSearchBar navigation={navigation} route={route} searchDefaultParams={searchParams} />
      </SafeAreaView>
      <View style={styles.pullup}>
        <BottomSheet
          ref={bs2}
          snapPoints={[searchParams.SearchType == 'none' ? 0 : 105, 285, windowHeight + 10]}
          renderContent={renderInner2}
          renderHeader={renderHeader2}
          initialSnap={0}
          callbackNode={fall2}
          enabledGestureInteraction={true}
          onCloseEnd={() => { setSnapPosition2(0) }} //this time, the navbar is taken care of in the clear button onPress
        />
        <Animated.View style={{
          margin: 20,
          opacity: Animated.add(0.1, Animated.multiply(fall2, 1.0)),
        }}>
        </Animated.View>
      </View>
      <View style={styles.pullup}>
        <BottomSheet
          ref={bs}
          snapPoints={[0, 325, windowHeight + 45]}
          renderContent={renderInner}
          renderHeader={renderHeader}
          initialSnap={0}
          callbackNode={fall}
          enabledGestureInteraction={true}
          onCloseEnd={() => {
            setSnapPosition(0);
            if (searchParams.SearchType == 'none')
              myContext.toggleShowNavBar(true);
          }}
        />
        <Animated.View style={{
          margin: 20,
          opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
        }}>
        </Animated.View>
      </View>
      <Report modalVisible={reportVisible} setModalVisible={setReportVisible} event={currentEvent} />
    </View>
  );
}
const FindNavigator = createStackNavigator();

export default function FindScreen() {
  return (
    <FindNavigator.Navigator>
      <FindNavigator.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} initialParams={{
        SearchType: 'none',
        SearchText: '',
        Categories: [],
        TimeRange: { startTime: '', endTime: '', value: 'Anytime' },
        OtherFilters: [],
        CloseBotSheet: false,
        CloseBotSheet2: false,
        refreshCurrent: false,
        currEvent: {},
        back: false,
        OpenBottomSheet: false,
      }} />
      <FindNavigator.Screen name="CategoryList" component={CategoryList} options={{ headerShown: false }} />
      <FindNavigator.Screen name="DateRange" component={DateRange} options={{ headerShown: false }} />
      <FindNavigator.Screen name="TimeRange" component={TimeRange} options={{ headerShown: false }} />
      <FindNavigator.Screen name="EventDetailsScreen" component={EventDetailsScreen} options={{ headerShown: false }} />
      <FindNavigator.Screen name="Manage Event" component={ManageEventStack} options={{ headerShown: false }} />
      <FindNavigator.Screen name="InviteScreen" component={InviteScreen} options={{ headerShown: false }} />
      <FindNavigator.Screen name='InvitePeopleScreen' component={InvitePeopleScreen} options={{ headerShown: false }} />
      <FindNavigator.Screen name='InviteListView' component={InviteListView} options={{ headerShown: false }} />
      <FindNavigator.Screen name='CreateInviteList' component={CreateInviteList} options={{ headerShown: false }} />
    </FindNavigator.Navigator>
  );
}
const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  container: {
    flex: 1,
  },
  topbar: {
    position: 'absolute',
    top: -5,
    width: Dimensions.get('window').width,
  },
  header: {
    backgroundColor: '#fff',
    shadowColor: '#333333',
    shadowOffset: { width: -1, height: -2 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center'
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: 20,
    //height: '100%',
    //paddingBottom: Dimensions.get('window').height,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
    marginRight: 10,
    width: Dimensions.get('window').width - 100
  },
  panelHost: {
    flexDirection: 'row',
    marginBottom: 10
  },
  panelDate: {
    flexDirection: 'row',
    marginBottom: 20
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
})
