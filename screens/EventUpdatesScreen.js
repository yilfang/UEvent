import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Alert, Dimensions } from 'react-native';
import BackButton from '../objects/backButton';
import UpdateButton from '../objects/UpdateButton';
import { useIsFocused } from '@react-navigation/native';
import Globals from '../../GlobalVariables';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EventUpdatesScreen({ navigation, route }) {
  const { user } = route.params;
  const updatesIsFocused = useIsFocused();
  const [updates, setUpdates] = useState([]);
  const [existing, setExisting] = useState([]);

  const compareTimes = (firstEl, secondEl) => {
    const parts1 = firstEl.updates.split('!@#$%^&*()');
    const parts2 = secondEl.updates.split('!@#$%^&*()');

    let firstTime = new Date();
    let secondTime = new Date();
    firstTime.setDate(firstTime.getDate() - 20);
    secondTime.setDate(secondTime.getDate() - 20);

    if (parts1[1])
      firstTime = new Date(parts1[1]);

    if (parts2[1])
      secondTime = new Date(parts2[1]);

    if (firstTime < secondTime)
      return true;
    return false;
  }
  const getUpdates = () => {
    fetch(Globals.updatesURL + '/users/' + user.id)
      .then((response) => response.json())
      .then((json) => { setUpdates(json.sort(compareTimes)) })
      .catch((error) => Alert.alert("Something Went Wrong", Globals.serverErrorMessage));
  }
  const getTrash = async () => {
    try {
      const value = await AsyncStorage.getItem('@updates');
      if (value !== null) {
        setExisting(JSON.parse(value));
      }
    } catch (e) {
      console.error(e);
    }
  }
  const moveToTrash = async (id, update) => {
    try {
      await AsyncStorage.setItem('@updates', JSON.stringify([...existing, id]));
      setExisting([...existing, id]);
      //AsyncStorage.clear();
    } catch (e) {
      console.error(e);
    }
    setUpdates((prevUpdates) => {
      return prevUpdates.filter((update) => update.updatesId != id);
    })
  }
  useEffect(() => {
    if (updatesIsFocused) {
      getUpdates();
      getTrash();
    }
  }, [updatesIsFocused])

  return (
    <SafeAreaView style={styles.button}>
      <View>
        <BackButton onPress={() => navigation.navigate('MainScreen')} title='Event Updates' />
      </View>
      <ScrollView style={{ height: Dimensions.get('window').height - (Dimensions.get('window').height > 700 ? 90 : 70) }}
        contentContainerStyle={{ paddingBottom: 50 }}>
        {updates.map((item) => {
          const parts = item.updates.split('!@#$%^&*()');
          if (parts.length >= 2) {
            const id = item.updatesId;
            if (existing.indexOf(id) == -1) {
              return (
                <View key={id} style={{ marginTop: 10, }}>
                  <UpdateButton id={id} event={item.event} content={parts[0]} sendTime={parts[1] ? Globals.formatDate(parts[1]).substring(5) : 'Aug 25, 5:00 PM'}
                    type={parts[2] ? parts[2] : "Info Update"} onPress={() => navigation.navigate('EventDetailsScreen', { user: user, currentEvent: item.event, from: 'EventUpdatesScreen' })}
                    trash={moveToTrash} />
                </View>
              )
            }
            else {
              return null;
            }
          }
          else
            return null;
        })}
        {updates.length == 0 ?
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: Globals.HR(24), lineHeight: 35, textAlign: 'center', padding: Globals.HR(20), justifyContent: 'center', flex: 1, fontWeight: '500', color: 'rgba(0, 0, 0, 0.5)', width: '80%' }}>No updates for any events! :)</Text>
          </View> : null
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    width: '90%',
    marginLeft: 20.4,
    position: 'absolute',
  }
})