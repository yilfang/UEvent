import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, Text, View, SafeAreaView, ScrollView, Alert, Dimensions,Image} from 'react-native';
import BackButton from '../objects/backButton';
import UpdateButton from '../objects/UpdateButton';
import { useIsFocused } from '@react-navigation/native';
import Globals from '../../GlobalVariables';
import InvitationButton from '../objects/InvitationButton';
import SendButton from '../objects/sendButton';

export default function IncomingInvScreen({navigation, route}) {
    const {user} = route.params;
    const invitationsIsFocused = useIsFocused();
    const [invitations, setInvitations] = useState([]);
    const [hasPending, setHasPending] = useState(false);
    const [statuses,setStatuses] = useState([1]);

    const getInvitations = () => {
      fetch(Globals.inviteesURL + '/invites/' + user.id)
      .then((response) => response.json())
      .then((json) => {setInvitations(json)})
      .catch((error) => Alert.alert("Something Went Wrong",Globals.serverErrorMessage));
    }
    const deleteInvitation = (userId, eventId) => { //mark as declined
      setInvitations((prevInvitations) => {return prevInvitations.filter((invitation) => {return invitation.event.id != eventId})});
    }
    useEffect(() => {
      getInvitations();
    },[navigation,route])

    const shouldDisplay = (invitation) => {
      if(statuses.includes(invitation.status.id)) {
        if(!hasPending)
          setHasPending(true);
        return true;
      }
      return false;
    }
    return (
        <SafeAreaView style={styles.container}>
          <BackButton onPress={() => navigation.navigate('MainScreen')} title = 'Incoming Invitations'/>
          <View style = {{alignItems:'flex-end',marginBottom:10}}>
          <TouchableOpacity style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'gray',
            shadowColor: '#000',
            width: 130,
            borderRadius: 20,
            justifyContent: 'center',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1,}}
            onPress={() => navigation.navigate('IgnoredInvScreen',{user:user})}>
                <View style={{padding:7, flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{justifyContent: 'center', marginRight: 5, color: 'white', fontWeight: 'bold', fontSize: 14,paddingHorizontal:2}}>View Ignored</Text>
                    <Image source={require('../assets/arrow.png')} style={{width: 14, height: 14, tintColor: 'white', }}/>
                </View>  
          </TouchableOpacity>
          </View>
          <ScrollView style={{height: Dimensions.get('window').height - (Dimensions.get('window').height>700?90:70)}}
                      contentContainerStyle = {{paddingBottom:50}}>
              {invitations.map((item) => {
                if(shouldDisplay(item)) {
                  return (
                    <View key = {item.event.id} style = {styles.invitation}>
                      <InvitationButton onPress = {() => navigation.navigate('EventDetailsScreen',{user:user,currentEvent:item.event,from:'IncomingInvScreen'})
                          } title = {item.name} event = {item.event} user = {user} deleteInvitation = {deleteInvitation}/>
                    </View>
                  )
                }
              })}
              {!hasPending? 
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontSize: Globals.HR(24), lineHeight: 35, textAlign: 'center', padding: Globals.HR(20), justifyContent: 'center', flex: 1, fontWeight: '500', color: 'rgba(0, 0, 0, 0.5)', width: '80%'}}>
                      No pending invitations. Have your friends invite you to their events!</Text>
                </View>:null
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