import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, ScrollView, Alert } from 'react-native';
import BackButton from '../objects/backButton';
import UpcomingEventButton from '../objects/UpcomingEventButton';
import Globals from '../../GlobalVariables';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { render } from 'react-dom';


export default function MainScreen({ navigation, route }) {
  // const {user} = navigation.getParam('user');
  const { user } = route.params;
  const { deleteId } = route.params;
  //const eventIds = [6,7,10];
  const [eventList, setEventList] = useState([]);
  const [gotEvents, setGotEvents] = useState(false);

  const compareTimes = (firstEl, secondEl) => {
    const firstTime = new Date(firstEl.startTime.substr(0, 10) + 'T' + firstEl.startTime.substr(11, 8));
    const secondTime = new Date(secondEl.startTime.substr(0, 10) + 'T' + secondEl.startTime.substr(11, 8));
    return firstTime > secondTime;
  }
  const getUserEvents = () => {
    let fetchurl = Globals.attendeesURL + '/attendingEvents/' + user.id;

    fetch(fetchurl)
      .then((response) => response.json())
      .then((json) => { setEventList(json.sort(compareTimes)) })
      .catch((error) => Alert.alert("Something Went Wrong", Globals.serverErrorMessage))
  }
  const renderEvents = () => {
    if (eventList.length > 0) {
      return (
        eventList.map((event) => {
          return (
            <View key={event.id} style={{ marginTop: 8, }}>
              <UpcomingEventButton title={event.name}
                location={Globals.getLocationName(event.location)}
                time={Globals.extraFormat(Globals.formatDate(event.startTime), Globals.formatDate(event.endTime))}
                onPress={() => navigation.navigate('EventDetailsScreen', { user: user, currentEvent: event, from: 'MyUpcomingScreen' })} />
            </View>
          )
        }
        )
      )
    }
    else {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: Globals.HR(24), lineHeight: 35, textAlign: 'center', padding: Globals.HR(20), justifyContent: 'center', flex: 1, fontWeight: '500', color: 'rgba(0, 0, 0, 0.5)', width: '80%' }}>You don't have any upcoming events</Text>
        </View>
      );
    }
  }
  useEffect(() => {
    if (!gotEvents) {
      getUserEvents();
      setGotEvents(true);
    }
    if (deleteId.attend != -1) {
      setEventList((prevEventList) => {
        return prevEventList.filter((prevEvent) => { return prevEvent.id != deleteId.attend })
      })
    }
  }, [navigation, route])

  return (
    <SafeAreaView style={styles.button}>
      <BackButton onPress={() => navigation.navigate('MainScreen')} title='My Upcoming Events' />
      <ScrollView style={{ height: Dimensions.get('window').height - (Dimensions.get('window').height > 700 ? 90 : 70) }}
        contentContainerStyle={{ paddingBottom: 50 }}>
        {renderEvents()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    position: 'absolute',
    width: '90%',
    marginLeft: 20.4
  }
})
