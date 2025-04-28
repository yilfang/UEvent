import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    StatusBar,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';
import Globals from '../../GlobalVariables';

const WelcomeScreen = ({ navigation }) => {

    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#00274C' barStyle="light-content" />
            <View style={{
                flex: 2,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            {
                <Animatable.Image
                    animation="bounceIn"
                    duraton="1500"
                    source={require('../assets/logo.png')}
                    style={{width: 275, height: 275, marginTop: Dimensions.get('window').height< 700? -20: 0, marginBottom: Dimensions.get('window').height< 700? -30: -40}}
                    resizeMode="stretch"
                />
            }
            <View style = {{alignItems: 'center', width: '100%'}}>
                <Text style = {{fontSize: 40, fontWeight: 'bold', color: 'white', fontFamily: 'Futura', marginBottom:20, letterSpacing: 1.0}}>UEvent</Text>
                {<View style = {{borderBottomColor: 'black', borderBottomWidth: 0, width: '60%', marginBottom: 25}}></View>}
                <Text style = {{fontSize: 26, fontWeight: '500', fontFamily: 'Futura'}}>•Find   •Host   •Discover</Text>
            </View> 
            </View>
            <Animatable.View
                style={[styles.footer, {
                    backgroundColor: colors.background
                }]}
                animation="fadeInUpBig"
            >
                <Text style={[styles.title, {
                    color: colors.text
                }]}>Welcome to UEvent!</Text>
                <Text style={styles.text}>a place to find and host your events</Text>
                <View style={styles.button}>
                    <TouchableOpacity onPress={() => navigation.navigate('NavBar')}>
                        <Text style={styles.textSign}>Get Started</Text>
                        <MaterialIcons
                            name="navigate-next"
                            color="#000"
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
};

export default WelcomeScreen;

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFCB05'
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: Globals.HR(50),
        paddingHorizontal: 30
    },
    logo: {
        width: height_logo,
        height: height_logo
    },
    title: {
        color: '#05375a',
        fontSize: 30,
        fontWeight: 'bold'
    },
    text: {
        color: 'grey',
        marginTop: 5
    },
    button: {
        alignItems: 'flex-end',
        marginTop: 30
    },
    signIn: {
        width: 150,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        flexDirection: 'row'
    },
    textSign: {
        color: '#000',
        fontWeight: 'bold'
    }
});