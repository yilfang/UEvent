import React, {useState} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import NavBar from './navBar';
import * as Linking from 'expo-linking';
import Globals from '../../GlobalVariables';

const RootStack = createStackNavigator();

const RootStackScreen = ({ navigation }) => {
    return (
        <RootStack.Navigator headerMode='none'>
            <RootStack.Screen name="SignInScreen" component={SignInScreen} />
            <RootStack.Screen name="SignUpScreen" component={SignUpScreen} />
            <RootStack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <RootStack.Screen name="NavBar" component={NavBar} options={{
                gestureEnabled: false,
            }} />
        </RootStack.Navigator>
    );
}
export default RootStackScreen;