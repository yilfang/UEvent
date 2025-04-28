import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, SafeAreaView, Keyboard, Modal, TextInput, TouchableWithoutFeedback, Alert, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as MailComposer from 'expo-mail-composer';
import Globals from '../../GlobalVariables';

export default function Report({ modalVisible, setModalVisible, event }) {

    const [report, setReport] = useState('');

    const sendReport = () => {
        MailComposer.composeAsync({
            recipients: ['ueventstaff@gmail.com'],
            subject: event.name + ' - ' + 'Event Report ' + '(' + event.id + ')',
            body: report,
        }).then((response) => {
            setReport('');
            setModalVisible(false);
        }).catch((error) => Alert.alert("Something Went Wrong", Globals.serverErrorMessage))
    }
    const [textInputFocused, setTextInputFocused] = useState(false);
    return (
        <Modal
            visible={modalVisible}
            transparent={true}
            animationType='fade'
        >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <SafeAreaView style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.modalClose}>
                            <AntDesign name='closecircleo' style = {{margin: 5}} size={30} onPress={() => { setModalVisible(false); setReport(''); }} />
                        </View>
                        <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: '500', marginBottom: 10, }}>Report an Event</Text>
                        <TouchableWithoutFeedback onPress = {() => {
                            if(!textInputFocused) {
                                this.textIn.focus();
                                setTextInputFocused(true);
                            }
                            else {
                                this.textIn.blur();
                                setTextInputFocused(false);
                            }
                        }}>
                            <View style={styles.textAreaContainer}>
                                <TextInput
                                    ref={(input) => { this.textIn = input;}}
                                    multiline={true}
                                    style={{ margin: 10 }}
                                    placeholder='Let us know what happened'
                                    onChangeText={(text) => setReport(text)}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableOpacity onPress={sendReport}>
                            <View style={styles.UpdateContainer}>
                                <Text style={styles.UpdateText}>Send Report</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </Modal>
    )

}
const styles = StyleSheet.create({
    modalView: {
        margin: Dimensions.get('window').height / 92.6,
        backgroundColor: "#FFF9F9",
        borderRadius: Dimensions.get('window').height / 46.3,
        padding: Dimensions.get('window').height / 26.46,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: '75%',
        width: '85%'
    },
    modalClose: {
        position: 'absolute',
        right: 5,
        top: 5,
    },
    centeredView: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    textAreaContainer: {
        height: '60%',
        width: '85%',
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#EEEEEE'
    },
    UpdateContainer: {
        backgroundColor: 'red',
        margin: '8%',
        width: '100%',
        alignItems: 'center',

        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        borderRadius: Dimensions.get('window').height / (Dimensions.get('window').height / 10),
    },
    UpdateText: {
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height / 42.06,
        paddingVertical: Dimensions.get('window').height / 61.73,
        paddingHorizontal: Dimensions.get('window').width / 7.13,
        color: '#FFFFFF',
    },
})