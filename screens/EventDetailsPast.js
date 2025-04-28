import React, { useState, useContext, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, SafeAreaView, Share, Alert } from 'react-native';
import Animated from 'react-native-reanimated';
import BackButton from '../objects/backButton';
import Globals from '../../GlobalVariables';
import AppContext from '../objects/AppContext';
import { FormikProvider } from 'formik';
import Report from '../objects/Report';
import * as Linking from 'expo-linking';


export default function EventDetailsScreen({ navigation, route }) {
  const myContext = useContext(AppContext);
  const { user } = route.params;
  const { from } = route.params;
  const [currentEvent, setCurrentEvent] = useState(route.params.currentEvent);
  const [deleteId, setDeleteId] = useState({ follow: -1, attend: -1 });

  useEffect(() => {
    setCurrentEvent(route.params.currentEvent);
  }, [navigation, route])

  const renderCategories = () => {
    const imgSource = currentEvent.hasOwnProperty('mainCategory') ? Globals.categoryAssets[currentEvent.mainCategory.replace(/\W/g, '')] : require('../assets/categories.png');
    return (
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={imgSource}
          style={{ width: 18, height: 18, tintColor: 'orange' }}>
        </Image>
        <Text numberOfLines={currentEvent.hasOwnProperty('mainCategory') && currentEvent.mainCategory.indexOf('/') == -1 ? 1 : 2}
          style={{ marginLeft: 5, fontSize: 16, fontWeight: 'bold', color: 'orange', maxWidth: Globals.formFontAdj(160) }}>{currentEvent.mainCategory}</Text>
      </View>
    )
  }
  const registration = () => {
    if (currentEvent.registrationLink != '') {
      return (
        <View>
          <Text style={{ fontWeight: '600', fontSize: 18, marginBottom: 10 }}>Registration</Text>
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
          <Text style={{ fontWeight: '600', fontSize: 18, marginBottom: 5, }}>More Details</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 15 }}>Email: </Text>
            <Text style={{ fontSize: 15, marginBottom: 5, }}>{currentEvent.organizerEmail}</Text>
          </View>
        </View>
      )
    } else if (currentEvent.organizerWebsite != '') {
      return (
        <View>
          <Text style={{ fontWeight: '600', fontSize: 18, marginBottom: 5, }}>More Details</Text>
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
  const initialButtonColor = (buttonNumber) => {
    if (buttonNumber == 1) {
      if (from == 'EventsFollowingScreen' || currentEvent.isFollower)
        return '#FFCB05';
      else
        return '#fff';
    }
    else { //buttonNumber == 2
      if (from == 'MyUpcomingScreen' || from == 'EventUpdatesScreen' || currentEvent.isAttendee)
        return '#FFCB05';
      else
        return '#fff';
    }
  }
  const [buttonColor1, setButtonColor1] = useState(initialButtonColor(1));

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
          setCurrentEvent((prevCurrentEvent) => { //server validation is checked by converting to json and catching error
            if (follow)
              return ({ ...prevCurrentEvent, ...{ isFollower: true } })
            else
              return ({ ...prevCurrentEvent, ...{ isAttendee: true } })
          })
          if (follow) {
            setButtonColor1('#FFCB05');
            setDeleteId({ follow: -1, attend: deleteId.attend });
          }
          else {
            setButtonColor2('#FFCB05');
            setDeleteId({ follow: deleteId.follow, attend: -1 });
          }
        })
        .catch((error) => { Alert.alert("Something Went Wrong", Globals.serverErrorMessage) });
    }
    else { //delete
      fetch(fetchurl + '/delete?eventId=' + currentEvent.id + '&userId=' + myContext.user.id, {
        method: 'delete',
      }
      ).then((response) => response.text())
        .then((text) => {
          if (Globals.serverValidation(text)) {
            setCurrentEvent((prevCurrentEvent) => {
              if (follow)
                return ({ ...prevCurrentEvent, ...{ isFollower: false } })
              else
                return ({ ...prevCurrentEvent, ...{ isAttendee: false } })
            })
            if (follow) {
              setButtonColor1('#fff');
              setDeleteId({ follow: currentEvent.id, attend: deleteId.attend });
            }
            else {
              setButtonColor2('#fff');
              setDeleteId({ follow: deleteId.follow, attend: currentEvent.id });
            }
          }
        })
        .catch((error) => Alert.alert('Server Error', "Sorry, we're unable to process your request. Please try again later :("));
    }
  }
  const toggle1 = () => {
    if (buttonColor1 == '#fff') {
      modifyApi(true, true);
    }
    else {
      modifyApi(true, false);
    }
  }
  const [buttonColor2, setButtonColor2] = useState(initialButtonColor(2))

  const toggle2 = () => {
    if (buttonColor2 == '#fff') {
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
          url: Linking.createURL('/event', {
            queryParams: {
              eventId: (parseInt(currentEvent.id) - 10351)
            }
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
  const [buttonColor3, setButtonColor3] = useState('#fff')
  const toggle3 = () => {
    onShare();
  }
  const borderColor = (buttonColor) => {
    if (buttonColor == '#fff') {
      return 'black'
    } else {
      return 'white'
    }
  }
  const [isTruncated, setIsTruncated] = useState(true);
  const resultString = (isTruncated && currentEvent.description.length > 200) ? currentEvent.description.slice(0, 150) : currentEvent.description;
  const readMore = isTruncated ? 'Read More' : 'Read Less'
  const toggle = () => {
    setIsTruncated(!isTruncated);
  }
  const renderButton = () => {
    if (currentEvent.description.length > 200) {
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
  const renderButtons = () => {
    if (myContext.user.id == currentEvent.host.id) {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: Globals.HR(20) }}>
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
          //onPress={() => navigation.navigate('Manage Event', { screen: 'Manage Event', params: {item: currentEvent, user: user, goToFind:false, fromEdit: false}})}
          >
            <View>
              <Image
                source={require('../assets/attendees.png')}
                style={{ height: 18, width: 18, alignSelf: 'center', tintColor: borderColor(buttonColor1) }}
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
          /*onPress={() => navigation.navigate('InviteScreen',{event:currentEvent})}*/
          >
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
          /*onPress={toggle3}*/
          >
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

        </View>
      )
    }
    else {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: Globals.HR(20) }}>
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
                style={{ height: 18, width: 18, alignSelf: 'center', tintColor: borderColor(buttonColor2) }}
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
                style={{ height: 18, width: 18, alignSelf: 'center', tintColor: borderColor(buttonColor3) }}
              ></Image>
              <Text style={{
                fontSize: 17,
                fontWeight: 'bold',
                color: borderColor(buttonColor3),
              }}>Share</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
  }
  return (
    <SafeAreaView style={{
      flex: 1,
      position: 'absolute',
      backgroundColor: '#fff'
    }}>

      <View style={{
        width: '90%',
        marginLeft: 20.4
      }}>
        <BackButton onPress={() => {
          navigation.navigate(from, { deleteId: deleteId });
        }} title='Event Details' />
      </View>

      <ScrollView style={styles.panel}>
        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 10 }}>
          <View>
            <Text style={{
              fontSize: 24,
              width: Dimensions.get('window').width - 105,
              marginRight: 8
            }}
              numberOfLines={2}>
              {currentEvent.name}
            </Text>
          </View>
          <View style={{ borderRadius: 5, borderWidth: 1, borderColor: 'black', padding: 4, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: 'black' }}>{currentEvent.privateEvent ? "Private" : "Public"}</Text>
          </View>
        </View>
        <View style={styles.panelHost}>
          <Image
            source={require('../assets/Vector.png')}
            style={{ width: 18, height: 18, tintColor: 'orange' }}>
          </Image>
          <Text style={{ marginLeft: 5, maxWidth: Globals.formFontAdj(200), marginRight: 15, fontSize: 16, fontWeight: 'bold', color: 'orange' }}>{currentEvent.organizer}</Text>
          {renderCategories()}
        </View>
        <View style={styles.panelDate}>
          <Image
            source={require('../assets/CalendarIcon.png')}
            style={{ width: 18, height: 18, tintColor: '#0085ff', }}
          ></Image>
          <Text numberOfLines={2} style={{ marginLeft: 5, fontSize: 16, fontWeight: 'bold', color: '#03a9f4', maxWidth: Dimensions.get('window').width - 60 }}>{renderTime()}</Text>
        </View>
        {renderButtons()}
        <View>
          <Image source={require('../assets/avatar.png')}
            resizeMode='cover'
            style={{ width: Dimensions.get('window').width - 40.8, height: Dimensions.get('window').height>700?225:200, marginBottom: 20 }}>
          </Image>
        </View>
        <Text style={{ fontWeight: '600', fontSize: 18, marginBottom: 10 }}>Event Description</Text>
        <View>
          <Text style={{ fontSize: 15, marginBottom: 10, lineHeight: 20, }}>{resultString}</Text>
          {renderButton()}
        </View>
        <Text style={{ fontWeight: '600', fontSize: 18, marginBottom: 10 }}>Location</Text>
        {/*<Text style = {{fontSize: 15, marginBottom: 3}}>{currentEvent.locationName}</Text>*/}
        <Text style={{ fontSize: 15, marginBottom: currentEvent.locationDetails == '' ? 15 : 5, color: '#0085ff', textDecorationLine: 'underline' }}
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
          <Text style={{marginLeft: 5, maxWidth: 200, marginRight: 15, fontSize: 16, color: '#03a9f4'}}>Add Event to Calendar</Text>*/}
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', marginBottom: 200, }}>
          <Image
            source={require('../assets/report.png')}
            style={{ width: 18, height: 18, tintColor: 'red', marginTop: Globals.HR(10), }}>
          </Image>
          <Text style={{ marginLeft: 5, maxWidth: 200, marginRight: 15, marginTop: 9, fontSize: 16, color: 'red' }}>Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
  },
  container: {
    flex: 1,
  },
  topbar: {
    position: 'absolute',
    top: 50,
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
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#fff',
    height: Dimensions.get('window').height,
    //flex: 1,
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
