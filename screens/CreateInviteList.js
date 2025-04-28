import React, { useState } from 'react';
import MapSearchBar from '../objects/mapSearchBar';
import { StyleSheet, Dimensions, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import PersonButton from '../objects/PersonButton';
import BackButton from '../objects/backButton';
import CreateListButton from '../objects/createListButton';
import { SearchBar } from 'react-native-elements';
import PersonSearchBar from '../objects/PersonSearchBar';
import Users from '../dummies/users';

export default function CreateInviteList({ navigation }) {

    const selectHandler = (ind) => {
        Users.map((item, index) => {
            if (ind == index) {
                item.isSelected = !item.isSelected;
            }
            return { ...item };
        })
    }

    const [Names, setNames] = useState("")

    const personsSelected = () => {
        let names = ""
        let count = 0
        let extras = 0
        for (let i = 0; i < Users.length; i++) {
            if (count > 2 && Users[i].isSelected) {
                extras++
                count++
            }
            else if (Users[i].isSelected) {
                if (count == 0) {
                    names += Users[i].name
                } else {
                    names += ", " + Users[i].name
                }
                count++
            }
        }
        if (count > 3) {
            names += ', and ' + extras + ' more'
        }
        setNames(names)
    }

    return (
        <SafeAreaView style={{
            flex: 1,
            position: 'absolute',
            backgroundColor: '#fff',
            width: '100%'
        }}>
            <View style={{ flex: 1, backgroundColor: '#ffcb05' }}>
                <View style={{
                    width: '90%',
                    marginLeft: 20.4,
                }}>
                    <BackButton onPress={() => navigation.goBack()} title='Create Invite List' />
                </View>
                <View style={{ flexDirection: 'row', marginLeft: 20, marginRight: 20, marginBottom: 20 }}>
                    <View style={{ width: Dimensions.get('screen').width - 180, marginRight: 20 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 5 }}>
                            You have selected:
                        </Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                            {Names}
                        </Text>
                    </View>
                    <CreateListButton></CreateListButton>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <PersonSearchBar />
                <ScrollView style={{ marginLeft: 20, height: Dimensions.get('window').height - 100, marginTop: 10, flex: 1, width: '90%', marginRight: 20 }}>
                    {Users.map((item, index) => {
                        return (
                            <View key={item.key} style={{
                                backgroundColor: 'white',
                                marginBottom: 5,
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: item.isSelected ? '#FFCB05' : '#FFF',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.2,
                                shadowRadius: 1,
                            }}>
                                <TouchableOpacity onPress={() => { selectHandler(index), personsSelected() }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={styles.button}>
                                            <Text style={styles.buttonText}> {item.name} </Text>
                                            <View style={{ flexDirection: 'row', marginBottom: 5, marginLeft: 5 }}>
                                                <Text numberOfLines={1}>{item.email}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                    })
                    }
                </ScrollView>
            </View>

        </SafeAreaView>

    );

}

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        marginLeft: 20,
        width: '90%',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 28,
        marginBottom: 7,
    },
    buttonText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#434343',
        marginBottom: 5,
        marginTop: 5,
    },
    button: {
        flex: 1,
    },
    icon: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
})
