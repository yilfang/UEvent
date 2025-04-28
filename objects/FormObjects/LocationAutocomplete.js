import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Globals from '../../../GlobalVariables';
import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

export default function LocationAutocomplete({ address, setFormikValue }) {
    const [key, setKey] = useState('AIzaSyQ71aMba5yieWm7Lqp4KXs6oIOKrwPUI0m');
    const [alerted, setAlerted] = useState(false);

    const getKey = () => {
        const fetchurl = Globals.apiKeysURL;
        fetch(fetchurl, {
            method: 'get',
            headers: {
                "user": "eventhub",
                "code": "umich"
            }
        })
            .then((response) => response.text())
            .then((text) => { setKey(text) })
            .catch((error) => {
                if (!alerted) {
                    Alert.alert("Something Went Wrong", Globals.serverErrorMessage);
                    setAlerted(true);
                }
            });
    }
    if (key == 'AIzaSyQ71aMba5yieWm7Lqp4KXs6oIOKrwPUI0m') {
        getKey();
    }
    const [token, setToken] = useState('adfhsdoffvio');
    const createSessionToken = () => {
        let uuid = require("uuid");
        let newToken = uuid.v4();
        setToken(newToken);
    }
    const ref = useRef();
    useEffect(() => {
        ref.current.setAddressText(address);
    }, []);

    const [pressed, setPressed] = useState(false);
    const [isFocused3, setFocus3] = useState(false);

    const [mapRegion, setMapRegion] = useState({
        latitude: 42.278,
        longitude: -83.738,
        latitudeDelta: 0.015,
        longitudeDelta: 0.075,
    });

    return (
        <View style={{ marginBottom: 5 }}>
            <GooglePlacesAutocomplete
                ref={ref}
                query={{
                    key: key,
                    sessiontoken: token,
                    language: 'en',
                    location: '42.278, -83.738',
                    radius: '25000',
                    //strictbounds: true,
                    components: 'country:us',
                }}
                fetchDetails={true}
                onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true         
                    setPressed(true);
                    setFormikValue('locationSelected', true);
                    setMapRegion({ latitude: details.geometry.location.lat, longitude: details.geometry.location.lng, latitudeDelta: 0.0025, longitudeDelta: 0.00125 });
                    createSessionToken();
                    setFormikValue('Address', data.description);
                    setFormikValue('Latitude', details.geometry.location.lat);
                    setFormikValue('Longitude', details.geometry.location.lng);
                }}
                minLength={3}
                placeholder='Search Locations'
                disableScroll={true}
                styles={{
                    textInputContainer: {
                        marginTop: -5,
                        width: '94%',
                    },
                    textInput: {
                        backgroundColor: '#fff',
                        height: 40,
                        borderBottomWidth: 1.5,
                        borderBottomColor: (address != '' || isFocused3) ? '#7b7b7b' : '#C4C4C4',
                        borderRadius: 0,
                        paddingHorizontal: 1,
                        paddingVertical: 0,
                        width: '88%',
                        marginLeft: 23,
                        marginTop: 10,
                        marginBottom: 10,
                        fontSize: 16,
                    }
                }}
                textInputProps={{
                    onFocus: () => {
                        createSessionToken();
                        setFocus3(true);
                    },
                    onChangeText: (text) => {
                        if (ref.current.isFocused()) {
                            setPressed(false);
                            setFormikValue('locationSelected', false);
                            setFormikValue('Address', text);
                            ref.current.setAddressText(text);
                        }
                    },
                    placeholderTextColor: '#a3a3a3',
                }
                }
            />
            <View style={styles.mapContainer}>
                <MapView style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    region={mapRegion}
                    zoomEnabled={true}
                >
                    <Marker coordinate={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }} />
                </MapView>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    map: {
        width: Globals.WR(340),
        height: Globals.HR(220),
    },
    mapContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
})