import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Alert, Dimensions } from 'react-native';
import BackButton from '../objects/backButton';
import UpdateButton from '../objects/UpdateButton';
import { useIsFocused } from '@react-navigation/native';
import Globals from '../../GlobalVariables';
import IgnoredButton from '../objects/IgnoredButton';

export default function IgnoredInvScreen({ navigation, route }) {
  const { user } = route.params;
  const [invitations, setInvitations] = useState([]);
  const [hasPending, setHasPending] = useState(false);
  const invitationsIsFocused = useIsFocused();

  const getInvitations = () => {
    fetch(Globals.inviteesURL + '/invites/' + user.id)
      .then((response) => response.json())
      .then((json) => { setInvitations(json) })
      .catch((error) => Alert.alert("Something Went Wrong", Globals.serverErrorMessage));
  }
  const deleteInvitation = (userId, eventId) => { //mark as declined
    setInvitations((prevInvitations) => { return prevInvitations.filter((invitation) => { return invitation.event.id != eventId }) })
  }
  useEffect(() => {
    if (invitationsIsFocused) {
      getInvitations();
    }
  }, [invitationsIsFocused])

  const shouldDisplay = (invitation) => {
    if (invitation.status.id == 3) {
      if (!hasPending)
        setHasPending(true);
      return true;
    }
    return false;
  }
  return (
    <SafeAreaView style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} title='Ignored Invitations' />
      <ScrollView style={{ height: Dimensions.get('window').height - (Dimensions.get('window').height > 700 ? 90 : 70) }}
        contentContainerStyle={{ paddingBottom: 50 }}>
        {invitations.map((item) => {
          if (shouldDisplay(item)) {
            return (
              <View key={item.event.id} style={styles.invitation}>
                <IgnoredButton onPress={() => navigation.navigate('EventDetailsScreen', { user: user, currentEvent: item.event, from: 'IgnoredInvScreen' })
                } title={item.name} event={item.event} user={user} deleteInvitation={deleteInvitation} />
              </View>
            )
          }
        })}
        {!hasPending ?
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: Globals.HR(24), lineHeight: 35, textAlign: 'center', padding: Globals.HR(20), justifyContent: 'center', flex: 1, fontWeight: '500', color: 'rgba(0, 0, 0, 0.5)', width: '80%' }}>
              No ignored invitations.</Text>
          </View> : null
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    width: '90%',
    marginLeft: 20.4
  },
  invitation: {
    marginTop: 8,
  }
})