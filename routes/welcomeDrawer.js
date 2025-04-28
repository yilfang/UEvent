import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import welcomeScreen from '../screens/welcome';
import findScreen from '../screens/FindScreen';
import hostScreen from '../screens/HostScreen';
import profileScreen from '../screens/ProfileScreen';

const rootDrawerNavigator = createDrawerNavigator({
    WelcomeScreen: {
        screen: welcomeScreen
    },
    FindScreen: {
        screen: findScreen
    },
    HostScreen: {
        screen: hostScreen
    },
    ProfileScreen: {
        screen: profileScreen
    },
});

export default createAppContainer(rootDrawerNavigator)