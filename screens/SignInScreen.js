import React, { useContext, useState, useEffect, useRef } from 'react';
import {View,Text,TouchableOpacity,Platform,StyleSheet,StatusBar,Alert,Image,ActivityIndicator} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useTheme } from 'react-native-paper';
import * as Google from "expo-google-app-auth";
import * as GoogleSignIn from "expo-google-sign-in";
import Globals from '../../GlobalVariables';
import AppContext from '../objects/AppContext';
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { validateYupSchema } from 'formik';
import * as Device from 'expo-device';

const SignInScreen = ({ navigation }) => {
    const myContext = useContext(AppContext);
    const { colors } = useTheme();
    const [openedURL, setOpenedURL] = useState(false);
    const [initedGoogle,setInitedGoogle] = useState(false);
    const [loading, setLoading] = useState(false);
    const IOS_CLIENT_ID = '343030781035-hndrhauj2kucaubkih4gn94o2lukqkcb.apps.googleusercontent.com'; //NOT REVERSED

    const getFromAsync = async() => {
        try {
            const jsonValue = await AsyncStorage.getItem('@authtoken');
            if (jsonValue !== null) {
              const value = JSON.parse(jsonValue);
              myContext.initializeUser({
                  id: value.id,
                  displayName: value.displayName,
                  email: value.email,
              })
              if(!Device.isDevice) {
                  handleLink(false);
              }
              else {
              const finalStatus = await checkPermissions();
              if (finalStatus == 'granted') {
                  const token = (await Notifications.getExpoPushTokenAsync()).data;
                  Globals.pushToken = token;
                  
                  const resetDate = new Date(2021,11,2);
                  console.log(resetDate.toLocaleString());

                  if (!value.hasOwnProperty('hasPushToken') || !value.hasPushToken || !value.hasOwnProperty('timestamp')) {
                      saveToAsync({id:value.id,displayName:value.displayName,email:value.email},token);
                      sendPushToken({id:value.id,displayName:value.displayName,email:value.email},token,true,false); //last arg was false
                  }
                  else if(value.hasOwnProperty('timestamp')) {
                     const today = new Date();
                     const tsDate = new Date(value.timestamp);

                     if(Math.floor((today - tsDate)/(1000*60*60*24)) <= 7) {
                        if(tsDate < resetDate) {
                            saveToAsync({id:value.id,displayName:value.displayName,email:value.email},token,value.timestamp);   
                            sendPushToken({id:value.id,displayName:value.displayName,email:value.email},token,true,false); //last arg was false
                        }
                        else {
                            saveToAsync({id:value.id,displayName:value.displayName,email:value.email},"N/A",value.timestamp);
                            handleLink(false);    
                        }
                     }
                  }
                  else {
                    saveToAsync({id:value.id,displayName:value.displayName,email:value.email},"N/A");
                    handleLink(false);
                  }
              }
              else {
                //maybe edit the permission or delete the pushToken?
                handleLink(false);
              }
              }
            }
            else {

            }
          } catch (e) {
        }
    }
    const initGoogle = async() => {
        try {
            await GoogleSignIn.initAsync({
              clientId: IOS_CLIENT_ID,
              // Provide other custom options...
            });
          } catch ({ message }) {
            Alert.alert('Google SignIn Error' + message);
          }
    }
    if(!initedGoogle /*&& Constants.appOwnership != 'expo'*/) {
        initGoogle();
        setInitedGoogle(true);
        getFromAsync();  
    }
    const handleLink = async (welcome) => {     
        Linking.getInitialURL().then((url) => {
            if (url == null || openedURL == true) {
                setLoading(false);
                if (welcome) 
                    navigation.navigate('WelcomeScreen');
                else 
                    navigation.navigate('NavBar'); //was 'NavBar'
            }
            else {
                const { queryParams } = Linking.parse(url);
                if (!queryParams || !queryParams.eventId) {
                    setOpenedURL(true);
                    setLoading(false);
                    if (welcome) 
                        navigation.navigate('WelcomeScreen'); 
                    else 
                        navigation.navigate('NavBar');
                }
                else {
                    fetch(Globals.eventsURL + '/get/' + (parseInt(queryParams.eventId) + 10351))
                        .then((response) => response.json())
                        .then((json) => {
                            setOpenedURL(true);
                            setLoading(false);
                            navigation.navigate('NavBar', {
                                screen: 'Find', params: {
                                    screen: 'MainScreen',
                                    params: {
                                        OpenBottomSheet: true,
                                        currEvent: json,
                                    }
                                }
                            });
                        }).catch((error) => {
                            setOpenedURL(true);
                            setLoading(false);
                            if (welcome)
                                navigation.navigate('WelcomeScreen');
                            else
                                navigation.navigate('NavBar');
                        })
                }
            }
        });

    }
    const saveToAsync = async(user,pushToken,time = new Date()) => {
        try {
            await AsyncStorage.setItem('@authtoken', JSON.stringify({
                ...user,
                ...{timestamp: time.toString()},
                ...{hasPushToken: pushToken != "N/A"}
            }
            ));
          } catch (e) {
            console.error(e);
          }
    }
    const addAndSaveUser = (existsInDataBase, user, pushToken, permission) => {
        let userName = '';
        if(Constants.appOwnership == 'expo') {
            userName = user.name;
        }
        else {
            userName = user.displayName;
        }
        const fetchurl = Globals.usersURL;
        if (!existsInDataBase) { //then add to database
            fetch(fetchurl + '/json/add', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: user.email,
                    displayName: userName,
                    disabled: false,
                })
            }).then((response) => response.json())
                .then((json) => {
                    //console.log(json);
                    myContext.initializeUser({ id: parseInt(json), displayName: userName, email: user.email });
                    saveToAsync({ id: parseInt(json), displayName: userName, email: user.email}, pushToken);
                    sendPushToken({id: parseInt(json), displayName: userName, email: user.email}, pushToken, permission, true);
                })
                .catch((error) => { console.error(error);Alert.alert('Something Went Wrong', "Sorry, something isn't working. Please try again later.") });
        }
        else {
            fetch(fetchurl + '/json/getByEmail/' + user.email)
                .then((response) => response.json())
                .then((json) => { 
                    myContext.initializeUser(json[0]); 
                    saveToAsync({id: json[0].id, displayName: userName, email: user.email}, pushToken);
                    sendPushToken({id: json[0].id, displayName: userName, email: user.email}, pushToken, permission, false);
                })
                .catch((error) => { Alert.alert('Something Went Wrong', "Sorry, something isn't working. Please try again later.") });
        }
    }
    const checkPermissions = async () => {
        console.log('checking permissions...');
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            console.log('requesting permissions...');
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        Globals.pushPermission = finalStatus;
        return finalStatus;
    }
    const sendPushToken = (user,pushToken,permission,welcome) => {
        fetch(Globals.usersURL + '/pushToken/add',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: user.id,
                enabled: permission,
                pushToken: pushToken,
                buildNumber: Constants.manifest.ios.buildNumber,
            })
        }).then((response) => response.text())
          .then((text) => {
              console.log(text);
              handleLink(welcome);
          })
    }
    const getPushToken = async (user) => {
          if(!Device.isDevice) {
            handleUserDataBase(user,"N/A",false);
            return;
          }
          const finalStatus = await checkPermissions();
          setLoading(true);
          if (finalStatus !== 'granted') {
            handleUserDataBase(user,"N/A",false);
            return;
          }
          const token = (await Notifications.getExpoPushTokenAsync()).data;
          console.log('Push Token Is: ' + token);
          Globals.pushToken = token;
          Globals.pushPermission = true;
          handleUserDataBase(user,token,true);     
    } 
    const handleUserDataBase = (user,pushToken,permission) => {
        //const fetchurl = Globals.usersURL + '?Email=' + user.email;
        const fetchurl = Globals.usersURL + '/json/getByEmail/' + user.email;
        fetch(fetchurl)
            .then((response) => response.json())
            .then((json) => { addAndSaveUser(json.length != 0, user, pushToken, permission) })
            .catch((error) => {Alert.alert('Something Went Wrong', Globals.serverErrorMessage) })
    }
    const signInAsync = async () => {
        try {
            let result = {};
            if(Constants.appOwnership == 'expo') {
                result = await Google.logInAsync({
                    iosClientId: '343030781035-g5nm8pfeu3c88tr9v5dhoq7tqg13c8di.apps.googleusercontent.com'
                })
            }
            else {
                result = await GoogleSignIn.signInAsync();
            }
            const { type, user } = result;
            if (type === "success") {
                // Then you can use the Google REST API
                if (user.email.length < 10 || (user.email.substring(user.email.length - 10, user.email.length) != '@umich.edu' 
                    && user.email.toLowerCase() != 'eventhubtestinguser@gmail.com' && user.email.toLowerCase() != 'ueventdemo@gmail.com')) {
                        Alert.alert('Invalid Email', 'Please log in with an @umich.edu email');
                }
                else {
                    getPushToken(user);        
                }
            }
            else {
       
            }
        } catch (error) {
            Alert.alert("Google SignIn Error",error.message);
        }
    };
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#FFCB05' barStyle="light-content" />
            <Image source={require('../assets/logo.png')} style={{width: Globals.formFontAdj(300), height: Globals.formFontAdj(300), alignSelf: 'center', marginTop: Globals.HR(50), marginBottom: Globals.HR(-100)}}/>
            <View style={styles.header}>
                <Text style={styles.text_header}>Hey There!</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={[styles.footer, {
                    backgroundColor: colors.background
                }]}
            >
                <View>
                    <Text style={{
                        color: '#05375a',
                        fontWeight: 'bold',
                        lineHeight: 25,
                        fontSize: 18
                    }}>
                        Notice: This app is currently for Michigan students only. Please use your umich email to sign in :)
                    </Text>
                </View>
                <View style={styles.button}>
                    {!loading?
                    <TouchableOpacity style={[styles.signIn, {
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        borderColor: '#FFCB05',
                        borderWidth: 1,
                    }]}
                        onPress={signInAsync}
                    >
                        <Image source={require('../assets/googlelogo.png')} style={{ width: 30, height: 30, marginLeft: 10.75 }} />
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 18,
                            color: 'gray',
                            marginLeft: 24,
                        }}>Sign In With Google</Text>
                    </TouchableOpacity>
                    :<ActivityIndicator animating = {loading} size = "large"/>}
                    {/*
                    <View>
                        <Image source={require('../assets/logo.png')} style={{marginTop: Globals.HR(55), width: Globals.HR(265), height: Globals.HR(265)}}/>
                    </View>
                    */}
                </View>
            </Animatable.View>
        </View>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFCB05'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: Globals.HR(50)
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});
