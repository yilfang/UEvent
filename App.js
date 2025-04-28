import React, { useState, useEffect, useRef } from 'react';
import { StatusBar, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
//import NavBar from './app/routes/navBar';
import AppContext from './app/objects/AppContext';
import InitialNav from './app/routes/initialNav';
import Globals from './GlobalVariables';
import * as Linking from 'expo-linking';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';

const App = () => {
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content.data.eventId && lastNotificationResponse.notification.request.content.data.type &&
      lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      console.log('notification response caught!!');
      updateNotification({
        eventId: lastNotificationResponse.notification.request.content.data.eventId,
        type: lastNotificationResponse.notification.request.content.data.type
      });
    }
  }, [lastNotificationResponse]);
  const [showNavBar, setShowNavBar] = useState(true);
  const toggleShowNavBar = (value) => {
    setShowNavBar(value);
  }

  const [user, setUser] = useState({ id: -1, displayName: '', email: 'nan@umich.edu', });
  const initializeUser = (value) => {
    setUser(value);
  }

  const [mapSearchText, setMapSearchText] = useState(''); //NOTHING SHOULD TOUCH THIS EXCEPT MAPSEARCHBAR AND THE CLEAR BUTTON
  const changeMapSearchText = (value) => {
    setMapSearchText(value);
  }

  const [eventList, setEventList] = useState([]);
  const updateEventList = (value) => {
    setEventList(value);
  }

  const [postedEvent, setPostedEvent] = useState({ inUse: false });
  const changePostedEvent = (value) => {
    setPostedEvent(value);
  }

  const [originalEventLocation, setOriginalEventLocation] = useState({ latitude: 42.278, longitude: -83.738, inUse: false });
  const changeOriginalEventLocation = (value) => {
    setOriginalEventLocation(value);
  }

  const [notification, setNotification] = useState(null);
  const updateNotification = (value) => {
    setNotification(value);
  }
  const globals = {
    navBarVisible: showNavBar,
    toggleShowNavBar,

    user: user,
    initializeUser,

    mapSearchText: mapSearchText,
    changeMapSearchText,

    eventList: eventList,
    updateEventList,

    postedEvent: postedEvent,
    changePostedEvent,

    originalEventLocation: originalEventLocation,
    changeOriginalEventLocation,

    notification: notification,
    updateNotification,
  }
  const [fetchedCategories, setFetchedCategories] = useState(false);
  const adjust = (catArr) => {
    let adjArr = [];
    let otherId = -1;
    for (let i = 0; i < catArr.length; i++) {
      if (catArr[i].name != 'Other') {
        adjArr.push(catArr[i])
      }
      else {
        otherId = catArr[i].id;
      }
    }
    if (otherId != -1)
      adjArr.push({ id: otherId, name: 'Other' });

    return adjArr;
  }
  const compareCats = (firstEl,secondEl) => {
    return firstEl.priority > secondEl.priority;
  }
  //fetch categories
  if (!fetchedCategories) {
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {  
        return ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        })
      },
    });
    fetch(Globals.categoriesURL)
      .then((response) => response.json())
      .then((json) => { Globals.categories = json.sort(compareCats); setFetchedCategories(true) })
      .catch((error) => console.error(error));
    }
  StatusBar.setBarStyle('dark-content', true);

  return (
    //<WelcomeNavigator />
    <AppContext.Provider value={globals}>
      <NavigationContainer>
        <InitialNav />
      </NavigationContainer>
    </AppContext.Provider>
    //<WelcomeScreen/>
  );
}
export default App;
