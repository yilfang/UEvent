import React from 'react';
import { SafeAreaView, View, Text, Linking, StyleSheet, TextInput, Image, ScrollView, Alert, Dimensions } from 'react-native';
import { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native'
import { Formik, FieldArray } from 'formik';
import { AntDesign } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AppContext from '../objects/AppContext';
//import SearchableDropdown from 'react-native-searchable-dropdown';
import { EventTypeSelector } from '../objects/FormObjects/EventTypeSelector';
import PrivacySelector from '../objects/FormObjects/PrivacySelector';
import { ContentTypeSelector } from '../objects/FormObjects/ContentTypeSelector';
import InPersonSelector from '../objects/FormObjects/InPersonSelector';
import ImagePickerExample from '../objects/FormObjects/ImagePicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Globals from '../../GlobalVariables';
import * as yup from 'yup';
import LocationAutocomplete from '../objects/FormObjects/LocationAutocomplete';
import { StartDateSelector } from '../objects/FormObjects/StartDateSelector';
import { EndDateSelector } from '../objects/FormObjects/EndDateSelector';
import { StartTimeSelector } from '../objects/FormObjects/StartTimeSelector';
import { EndTimeSelector } from '../objects/FormObjects/EndTimeSelector';
import { NavigationActions } from 'react-navigation';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';


const HR = (pixelNumber) => {
    const responsiveMultiplier = 926 / pixelNumber;
    const responsiveNumber = windowHeight / responsiveMultiplier;
    return responsiveNumber;
}

const WR = (pixelNumber) => {
    const responsiveMultiplier = 428 / pixelNumber;
    const responsiveNumber = windowWidth / responsiveMultiplier;
    return responsiveNumber;
}

// Header
function Header({ navigation }) {
    const myContext = useContext(AppContext);
    // event handler function
    const closeHandler = () => {
        Alert.alert(
            "Confirmation",
            "Are you sure you want to exit the form? All edited changes will be lost",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "OK", onPress: () => { navigation.goBack(); } }
            ]
        );


    }

    return (
        <View style={styles.outerContainer}>
            <View style={styles.innerContainer}>
                <Text style={styles.headerText}>Edit Event</Text>
                <View style={styles.close}>
                    <AntDesign name='closecircleo' size={windowHeight / 30.87} onPress={closeHandler} />
                </View>

            </View>
        </View>
    );
}
// Preview Header
function PreviewHeader({ navigation }) {
    const myContext = useContext(AppContext);
    // event handler function
    const closeHandler = () => {
        Alert.alert(
            "Confirmation",
            "Are you sure you want to exit the form? All edited changes will be lost",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "OK", onPress: () => { navigation.dangerouslyGetParent().goBack(); } }
            ]
        );
    }
    return (
        <View style={styles.outerContainer}>
            <View style={styles.innerContainer}>
                <Text style={styles.headerText2}>Preview</Text>
                <View style={styles.close}>
                    <AntDesign name='closecircleo' size={HR(30)} onPress={closeHandler} />
                </View>

            </View>
        </View>
    );
}
// Components
const Next = ({ navigation }) => {

    return (
        <TouchableOpacity style={styles.SearchButton} onPress={() => navigation.navigate("MoreInformation")}>
            <Image source={require('../assets/Next.png')} />
        </TouchableOpacity>
    );

}

// Screens

const pageOneValidSchema = yup.object({
    // first slide
    EventTitle: yup.string()
        .max(50, 'Event Title Must Be Less Than 50 Characters')
        .required()
        .label('Event Title'),
    OrganizerName: yup.string()
        .max(50, 'Organizer Name Must Be Less Than 50 Characters')
        .required()
        .label('Organizer Name'),
    EventType: yup.string()
        .required()
        .label('Main Event Category')
        .nullable(),
    ContentType: yup.array()
        .label('Other Categories')
        .nullable(),
    Tags: yup.string()
        .max(50, 'Max of 10 Tags'),
    Privacy: yup.string()
        .required()
        .nullable(),

})

const pageTwoValidSchema = yup.object({
    // second slide
    InPerson: yup.string()
        .required()
        .label('In Person or Virtual')
        .nullable(),
    EventLink: yup.string()
        .when('InPerson', {
            is: (value) => value === 'Virtual',
            then: yup.string().required()
        })
        .label('Event Link')
    ,
    Address: yup.string()
        .when('InPerson', {
            is: (value) => value === 'In Person',
            then: yup.string().required()
        })
        .when(['InPerson', 'locationSelected'], {
            is: (InPerson, locationSelected) => (InPerson === 'In Person') && (locationSelected === false),
            then: yup.string().test('scheme', 'Must select a real address', (value, context) => value === '')
        }),

    LocationDetails: yup.string()
        .max(100, 'Location Details must be 100 characters or less'),

})
const re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
const pageThreeValidSchema = yup.object({
    // third slide
    StartDay: yup.string()
        .required(),
    StartTime: yup.string()
        .required(),
    EndDay: yup.string()
        .required(),
    EndTime: yup.string()
        .required(),
    RealStartDateTime: yup.date()
    ,
    RealEndDateTime: yup.date()
        .min(yup.ref('RealStartDateTime'),
            ({ min }) => `End time must be after ${min.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} on ${min.toDateString()}`),
    Registration: 
    yup.string().matches(
        re,'Invalid link. Make sure to start with www.'
    )
})

const pageFourValidSchema = yup.object({
    // fourth slide
    EventDescription: yup.string()
        .required()
        .label('Event Description')
        .max(500, 'Event Description must be 500 characters or less'),
    OrganizerEmail: yup.string()
        .email('Must be a valid email'),
    OrganizerWebsite: 
        yup.string().matches(
            re,'Invalid link. Make sure to start with www.'
        )
})


// First slide
const EventInformation = (props) => {
    const navigation = useNavigation();

    const handleSubmit = (values) => {
        props.next(values);
    };

    const [isFocused, setFocus] = useState(false);
    const [isFocused2, setFocus2] = useState(false);
    const [isFocused6, setFocus6] = useState(false);




    return (
        <SafeAreaView style={styles.containerBack}>

            <Formik
                initialValues={props.data}
                onSubmit={handleSubmit}
                validationSchema={pageOneValidSchema}

            >
                {(formikprops) => (
                    <View>
                        <KeyboardAwareScrollView style={styles.scrollContainer}>
                            <View>
                                <Header navigation={navigation} />
                            </View>
                            <View>
                                <Text style={{ color: '#09189F', fontSize: Globals.formFontAdj(22), marginLeft: 23, marginTop: Globals.HR(30), fontWeight: '500' }}>Event Information</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Image style={{ margin: 23, flex: 2 / 9 }} source={require('../assets/Progress-Bar.png')} />
                                <Image style={{ margin: 23, flex: 2 / 9 }} source={require('../assets/Gray-Progress-Bar.png')} />
                                <Image style={{ margin: 23, flex: 2 / 9 }} source={require('../assets/Gray-Progress-Bar.png')} />
                                <Image style={{ margin: 23, flex: 2 / 9 }} source={require('../assets/Gray-Progress-Bar.png')} />
                            </View>
                            <View style={styles.containerStyle}>
                                <Text style={styles.TextStyle}>
                                    Event Title:
                                    <Text style={styles.requiredField}>
                                        {' '}*
                                    </Text>

                                </Text>
                                <TextInput
                                    style={[styles.InputBox, { borderColor: formikprops.values.EventTitle !== '' || isFocused ? '#7b7b7b' : '#C4C4C4' }]}
                                    placeholder='Brief title for your event.'
                                    onChangeText={formikprops.handleChange('EventTitle')}
                                    value={formikprops.values.EventTitle}
                                    onFocus={() => setFocus(true)}
                                    onBlur={() => setFocus(false)}
                                    maxLength={50}
                                    clearButtonMode = 'always'
                                />
                                <View style={styles.messageContainer}>
                                    <Text style={styles.errorMessage}>{formikprops.touched.EventTitle && formikprops.errors.EventTitle}</Text>
                                    <Text style={styles.counterStyle}>{formikprops.values.EventTitle.length.toString()} / 50</Text>
                                </View>

                            </View>
                            <View style={styles.containerStyle}>
                                <Text style={styles.TextStyle}>
                                    Organizer Name:
                                    <Text style={styles.requiredField}>
                                        {' '}*
                                    </Text>

                                </Text>
                                <TextInput
                                    style={[styles.InputBox, { borderColor: formikprops.values.OrganizerName !== '' || isFocused2 ? '#7b7b7b' : '#C4C4C4' }]}
                                    placeholder="Your name or your organization's name."
                                    onChangeText={formikprops.handleChange('OrganizerName')}
                                    value={formikprops.values.OrganizerName}
                                    onFocus={() => setFocus2(true)}
                                    onBlur={() => setFocus2(false)}
                                    maxLength={50}
                                    clearButtonMode = 'always'
                                />
                                <View style={styles.messageContainer}>
                                    <Text style={styles.errorMessage}>{formikprops.touched.OrganizerName && formikprops.errors.OrganizerName}</Text>
                                    <Text style={styles.counterStyle}>{formikprops.values.OrganizerName.length.toString()} / 50</Text>
                                </View>
                            </View>
                            <View style={styles.containerStyle}>
                                <Text style={styles.TextStyle}>
                                    Privacy:
                                    <Text style={styles.requiredField}>
                                        {' '}*
                                    </Text>

                                </Text>
                                <PrivacySelector
                                    onChange={formikprops.setFieldValue}
                                    value={formikprops.values.Privacy}
                                />
                                <Text style={styles.errorMessagePickers}>{formikprops.touched.Privacy && formikprops.errors.Privacy}</Text>
                            </View>
                            <View style={styles.containerStyle}>
                                <Text style={styles.TextStyle}>
                                    Main Event Category:
                                    <Text style={styles.requiredField}>
                                        {' '}*
                                    </Text>

                                </Text>
                                <View style={{ width: '88%', marginLeft: 23, marginTop: Globals.HR(10), }}>
                                    <FieldArray name="EventType" component={EventTypeSelector} />
                                </View>

                                <Text style={[styles.errorMessagePickers, { marginTop: Globals.HR(8) }]}>{formikprops.touched.EventType && formikprops.errors.EventType}</Text>
                            </View>
                            <View style={styles.containerStyle}>
                                <Text style={styles.TextStyle}>
                                    Other Categories:
                                </Text>
                                <View style={{ width: '88%', marginLeft: 23, marginTop: HR(10), }}>
                                    <FieldArray name="ContentType" component={ContentTypeSelector} />
                                </View>

                                {/*<ContentTypeSelector3
                                    onChange={formikprops.setFieldValue}
                                    value={formikprops.values.ContentType}
                                />*/}
                                <Text style={styles.errorMessagePickers}>{formikprops.touched.ContentType && formikprops.errors.ContentType}</Text>
                            </View>

                            {/*<View style={styles.containerStyle}>
                                <Text style={styles.TextStyle}>
                                    Tags (10 max):
                                </Text>
                                <TextInput
                                    style={[styles.InputBox, {borderColor: formikprops.values.Tags !== '' || isFocused6 ? '#7b7b7b' : '#C4C4C4'}]}
                                    placeholder='Optional, but boosts discoverability. Eg. #design'
                                    onChangeText={formikprops.handleChange('Tags')}
                                    value={formikprops.values.Tags}
                                    onFocus={() => setFocus6(true)}
                                    onBlur={() => setFocus6(false)}
                                />
                                <Text style={styles.errorMessage}>{formikprops.touched.Tags && formikprops.errors.Tags}</Text>
                            </View>*/}



                        </KeyboardAwareScrollView>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity style={{ alignItems: 'center', marginRight: '20%' }} >
                                    <View style={styles.backContainerInit}>
                                        <Text style={styles.backText}>Back</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity style={{ alignItems: 'center' }} onPress={formikprops.handleSubmit}>
                                    <View style={styles.nextContainer}>
                                        <Text style={styles.nextText}>Next</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                )}

            </Formik>
        </SafeAreaView>

    );
}
// Second Slide
const MoreInformation = (props) => {
    const navigation = useNavigation();

    const handleSubmit = (values) => {
        props.next(values);
    };

    const [isFocused2, setFocus2] = useState(false);
    const [isFocused2a, setFocus2a] = useState(false);
    const [isFocused4, setFocus4] = useState(false);

    return (
        <SafeAreaView style={styles.containerBack}>
            <Formik
                initialValues={props.data}
                onSubmit={handleSubmit}
                validationSchema={pageTwoValidSchema}
            >
                {(formikprops) => (
                    <View>
                        <KeyboardAwareScrollView style={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                            <Header navigation={navigation} />
                            <View>
                                <Text style={{ color: '#09189F', fontSize: Globals.formFontAdj(22), marginLeft: 23, marginTop: HR(20), fontWeight: '500' }}>Location Information</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Image style={{ margin: 23, flex: 2 / 9 }} source={require('../assets/Progress-Bar.png')} />
                                <Image style={{ margin: 23, flex: 2 / 9 }} source={require('../assets/Progress-Bar.png')} />
                                <Image style={{ margin: 23, flex: 2 / 9 }} source={require('../assets/Gray-Progress-Bar.png')} />
                                <Image style={{ margin: 23, flex: 2 / 9 }} source={require('../assets/Gray-Progress-Bar.png')} />
                            </View>
                            <View style={styles.containerStyle}>
                                <Text style={styles.TextStyle}>
                                    In Person or Online?
                                    <Text style={styles.requiredField}>
                                        {' '}*
                                    </Text>

                                </Text>
                                <InPersonSelector
                                    onChange={formikprops.setFieldValue}
                                    value={formikprops.values.InPerson}
                                />
                                <Text style={styles.errorMessagePickers}>{formikprops.touched.InPerson && formikprops.errors.InPerson}</Text>
                            </View>

                            <View style={styles.containerStyle}>
                                {formikprops.values.InPerson === 'In Person' &&
                                    (<Text style={styles.TextStyle}>
                                        Location:
                                        <Text style={styles.requiredField}>
                                            {' '}*
                                        </Text>

                                    </Text>)
                                }
                                {formikprops.values.InPerson === 'In Person' &&
                                    (<LocationAutocomplete address={formikprops.values.Address} setFormikValue={formikprops.setFieldValue} />)
                                }
                                {formikprops.values.InPerson === 'In Person' &&
                                    <Text style={[styles.errorMessagePickers, { marginTop: Globals.HR(8) }]}>{formikprops.touched.Address && formikprops.errors.Address}</Text>
                                }
                            </View>

                            <View style={styles.containerStyle}>
                                {formikprops.values.InPerson === 'Virtual' &&
                                    (<Text style={styles.TextStyle}>
                                        Event Link:
                                        <Text style={styles.requiredField}>
                                            {' '}*
                                        </Text>

                                    </Text>)
                                }
                                {formikprops.values.InPerson === 'Virtual' &&
                                    (<TextInput
                                        style={[styles.InputBox, { borderColor: isFocused2a ? '#7b7b7b' : '#C4C4C4' }]}
                                        placeholder="Egs. Zoom link, Webex"
                                        onChangeText={formikprops.handleChange('EventLink')}
                                        value={formikprops.values.EventLink}
                                        onFocus={() => setFocus2a(true)}
                                        onBlur={() => setFocus2a(false)}
                                    />)
                                }
                                {formikprops.values.InPerson === 'Virtual' &&
                                    (<Text style={styles.errorMessagePickers}>{formikprops.touched.EventLink && formikprops.errors.EventLink}</Text>)
                                }
                            </View>


                            <View style={styles.containerStyle}>
                                {((formikprops.values.InPerson === 'In Person') || (formikprops.values.InPerson === 'Virtual')) &&
                                    (<Text style={styles.TextStyle}>
                                        Location Details:
                                    </Text>)
                                }
                                {((formikprops.values.InPerson === 'In Person') || (formikprops.values.InPerson === 'Virtual')) &&
                                    (<TextInput
                                        style={[styles.InputBox, { borderColor: formikprops.values.LocationDetails !== '' || isFocused4 ? '#7b7b7b' : '#C4C4C4' }]}
                                        placeholder='Eg: 2nd floor meeting room'
                                        onChangeText={formikprops.handleChange('LocationDetails')}
                                        value={formikprops.values.LocationDetails}
                                        onFocus={() => setFocus4(true)}
                                        onBlur={() => setFocus4(false)}
                                        maxLength={100}
                                    />)
                                }
                                {((formikprops.values.InPerson === 'In Person') || (formikprops.values.InPerson === 'Virtual')) &&
                                    (<View style={styles.messageContainer}>
                                        <Text style={styles.errorMessage}>{formikprops.touched.LocationDetails && formikprops.errors.LocationDetails}</Text>
                                        <Text style={styles.counterStyle}>{formikprops.values.LocationDetails.length.toString()} / 100</Text>
                                    </View>)
                                }
                            </View>
                        </KeyboardAwareScrollView>

                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity style={{ alignItems: 'center', marginRight: '20%' }} onPress={() => props.prev(formikprops.values)}>
                                    <View style={styles.backContainer}>
                                        <Text style={styles.backText}>Back</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity style={{ alignItems: 'center' }} onPress={formikprops.handleSubmit}>
                                    <View style={styles.nextContainer}>
                                        <Text style={styles.nextText}>Next</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                )}
            </Formik>
        </SafeAreaView>

    );
}

// Third Slide 
const EventSchedule = (props) => {
    const navigation = useNavigation();

    const handleSubmit = (values) => {
        props.next(values);
    };

    const [isFocused, setFocus] = useState(false);

    return (
        <SafeAreaView style={styles.containerBack}>
            <Formik
                initialValues={props.data}
                onSubmit={handleSubmit}
                validationSchema={pageThreeValidSchema}
            >
                {(formikprops) => (
                    <View>
                        <KeyboardAwareScrollView style={styles.scrollContainer}>

                            <Header navigation={navigation} />
                            <View>
                                <Text style={{ color: '#09189F', fontSize: Globals.formFontAdj(22), marginLeft: 23, marginTop: HR(20), fontWeight: '500' }}>Event Schedule</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Image style={{ margin: 23, flex: 2 / 9 }} source={require('../assets/Progress-Bar.png')} />
                                <Image style={{ margin: 23, flex: 2 / 9 }} source={require('../assets/Progress-Bar.png')} />
                                <Image style={{ margin: 23, flex: 2 / 9 }} source={require('../assets/Progress-Bar.png')} />
                                <Image style={{ margin: 23, flex: 2 / 9 }} source={require('../assets/Gray-Progress-Bar.png')} />
                            </View>
                            <View style={styles.containerStyle}>
                                <Text style={styles.TextStyle}>
                                    Start Time:
                                    <Text style={styles.requiredField}>
                                        {' '}*
                                    </Text>

                                </Text>
                                <StartDateSelector
                                    onChangeFormik={formikprops.setFieldValue}
                                    realStartDate={formikprops.values.RealStartDateTime}
                                    realEndDate={formikprops.values.RealEndDateTime}
                                />
                                <Text style={styles.errorMessage}>{formikprops.touched.StartDay && formikprops.errors.StartDay}</Text>
                            </View>
                            <Text style = {{marginBottom: 10}}></Text>
                            {/*
                            <View style={styles.containerStyle}>
                                <Text style={styles.TextStyle}>
                                    Start Time:
                                    <Text style={styles.requiredField}>
                                        {' '}*
                                    </Text>

                                </Text>
                                <StartTimeSelector
                                    onChangeFormik={formikprops.setFieldValue}
                                    realStartDate={formikprops.values.RealStartDateTime}
                                    realEndDate={formikprops.values.RealEndDateTime}
                                />
                                <Text style={styles.errorMessage}>{formikprops.touched.StartTime && formikprops.errors.StartTime}</Text>
                            </View>
                            */}
                            <View style={styles.containerStyle}>
                                <Text style={styles.TextStyle}>
                                    End Time:
                                    <Text style={styles.requiredField}>
                                        {' '}*
                                    </Text>

                                </Text>
                                <EndDateSelector
                                    onChangeFormik={formikprops.setFieldValue}
                                    realStartDate={formikprops.values.RealStartDateTime}
                                    realEndDate={formikprops.values.RealEndDateTime}
                                />
                                <Text style={styles.errorMessage}>{formikprops.touched.EndDay && formikprops.errors.EndDay}</Text>
                            </View>
                            <Text style={styles.errorMessagePickers}>{formikprops.touched.RealEndDateTime && formikprops.errors.RealEndDateTime}</Text>
                            <Text style = {{marginBottom: 0}}></Text>
                            {/*
                            <View style={styles.containerStyle}>
                                <Text style={styles.TextStyle}>
                                    End Time:
                                    <Text style={styles.requiredField}>
                                        {' '}*
                                    </Text>

                                </Text>
                                <EndTimeSelector
                                    onChangeFormik={formikprops.setFieldValue}
                                    realStartDate={formikprops.values.RealStartDateTime}
                                    realEndDate={formikprops.values.RealEndDateTime}
                                />
                                <Text style={styles.errorMessagePickers}>{formikprops.touched.RealEndDateTime && formikprops.errors.RealEndDateTime}</Text>
                            </View>
                            */}
                            <View style={styles.containerStyle}>
                                <Text style={styles.TextStyle}>
                                    Registration Link:
                                </Text>
                                <TextInput
                                    style={[styles.InputBox, { borderColor: formikprops.values.Registration !== '' || isFocused ? '#7b7b7b' : '#C4C4C4' }]}
                                    placeholder='External registration link.'
                                    onChangeText={formikprops.handleChange('Registration')}
                                    value={formikprops.values.Registration}
                                    onFocus={() => setFocus(true)}
                                    onBlur={() => setFocus(false)}
                                    clearButtonMode = "always"
                                />
                                <Text style={styles.errorMessagePickers}>{formikprops.touched.Registration && formikprops.errors.Registration}</Text>
                            </View>
                        </KeyboardAwareScrollView>

                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity style={{ alignItems: 'center', marginRight: '20%' }} onPress={() => props.prev(formikprops.values)}>
                                    <View style={styles.backContainer}>
                                        <Text style={styles.backText}>Back</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity style={{ alignItems: 'center' }} onPress={formikprops.handleSubmit}>
                                    <View style={styles.nextContainer}>
                                        <Text style={styles.nextText}>Next</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>

                )}
            </Formik>
        </SafeAreaView>


    );
}

// Fourth Slide
const EventDetails = (props) => {
    const navigation = useNavigation();

    const handleSubmit = (values) => {
        props.next(values, true);
        // navigate to preview screen
        navigation.navigate('Preview', { values: values });
    };

    const [isFocused, setFocus] = useState(false);
    const [isFocused2, setFocus2] = useState(false);
    const [isFocused3, setFocus3] = useState(false);

    return (
        <SafeAreaView style={styles.containerBack}>
            <Formik
                initialValues={props.data}
                validationSchema={pageFourValidSchema}
                onSubmit={handleSubmit}
            >
                {(formikprops) => (
                    <View>
                        <KeyboardAwareScrollView style={styles.scrollContainer}>
                            <Header navigation={navigation} />
                            <View>
                                <Text style={{ color: '#09189F', fontSize: Globals.formFontAdj(22), marginLeft: 23, marginTop: HR(20), fontWeight: '500' }}>Event Details</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Image style={{ margin: 23, flex: 2 / 9 }} source={require('../assets/Progress-Bar.png')} />
                                <Image style={{ margin: 23, flex: 2 / 9 }} source={require('../assets/Progress-Bar.png')} />
                                <Image style={{ margin: 23, flex: 2 / 9 }} source={require('../assets/Progress-Bar.png')} />
                                <Image style={{ margin: 23, flex: 2 / 9 }} source={require('../assets/Progress-Bar.png')} />
                            </View>
                            <View style={styles.containerStyle}>
                                <Text style={styles.TextStyle}>
                                    Event Description:
                                    <Text style={styles.requiredField}>
                                        {' '}*
                                    </Text>

                                </Text>
                                <TextInput
                                    style={[styles.InputBox, { borderColor: formikprops.values.EventDescription !== '' || isFocused ? '#7b7b7b' : '#C4C4C4' }]}
                                    multiline={true}
                                    placeholder='Describe your event here'
                                    onChangeText={formikprops.handleChange('EventDescription')}
                                    value={formikprops.values.EventDescription}
                                    onFocus={() => setFocus(true)}
                                    onBlur={() => setFocus(false)}
                                    maxLength={500}
                                />
                                <View style={styles.messageContainer}>
                                    <Text style={styles.errorMessage}>{formikprops.touched.EventDescription && formikprops.errors.EventDescription}</Text>
                                    <Text style={styles.counterStyle}>{formikprops.values.EventDescription.length.toString()} / 500</Text>
                                </View>
                            </View>
                            <View style={styles.containerStyle}>
                                <Text style={styles.TextStyle}>
                                    Organizer Email:
                                </Text>
                                <TextInput
                                    style={[styles.InputBox, { borderColor: formikprops.values.OrganizerEmail !== '' || isFocused2 ? '#7b7b7b' : '#C4C4C4' }]}
                                    placeholder='Optional.'
                                    onChangeText={formikprops.handleChange('OrganizerEmail')}
                                    value={formikprops.values.OrganizerEmail}
                                    onFocus={() => setFocus2(true)}
                                    onBlur={() => setFocus2(false)}
                                    clearButtonMode = "always"
                                />
                                <Text style={styles.errorMessagePickers}>{formikprops.touched.OrganizerEmail && formikprops.errors.OrganizerEmail}</Text>
                            </View>
                            <View style={styles.containerStyle}>
                                <Text style={styles.TextStyle}>
                                    Organizer Website:
                                </Text>
                                <TextInput
                                    style={[styles.InputBox, { borderColor: formikprops.values.OrganizerWebsite !== '' || isFocused3 ? '#7b7b7b' : '#C4C4C4' }]}
                                    placeholder='Optional. Start with http(s):// if possible.'
                                    onChangeText={formikprops.handleChange('OrganizerWebsite')}
                                    value={formikprops.values.OrganizerWebsite}
                                    onFocus={() => setFocus3(true)}
                                    onBlur={() => setFocus3(false)}
                                    clearButtonMode = "always"
                                />
                                <Text style={styles.errorMessagePickers}>{formikprops.touched.OrganizerWebsite && formikprops.errors.OrganizerWebsite}</Text>
                            </View>
                            <View style={styles.containerStyle}>
                                <Text style={styles.TextStyle}>
                                    Event Image (2:1 ratio, 5 MB limit):
                                </Text>
                                <ImagePickerExample
                                    onChange={formikprops.setFieldValue}
                                    value={formikprops.values.EventImage}
                                    editMode={true}
                                />
                            </View>
                        </KeyboardAwareScrollView>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity style={{ alignItems: 'center', marginRight: '20%' }} onPress={() => props.prev(formikprops.values)}>
                                    <View style={styles.backContainer}>
                                        <Text style={styles.backText}>Back</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity style={{ alignItems: 'center' }} onPress={formikprops.handleSubmit}>
                                    <View style={styles.nextContainer}>
                                        <Text style={styles.nextText}>Preview</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                )}
            </Formik>

        </SafeAreaView>

    );
}
const Preview = ({ route, navigation }) => {
    const { values, item } = route.params;

    // const { user } = route.params;
    const myContext = useContext(AppContext);


    const buildCoordinateList = () => {
        const specials = [];
        const offsets = [{ lat: 0.000150, lng: 0.000150 }, { lat: 0.000225, lng: 0.000225 }, { lat: 0.000075, lng: 0.000075 }, { lat: 0.000300, lng: 0.000300 }];
        //if not in specials:
        const initLng = values.Longitude;
        const initLat = values.Latitude;
        const coordList = [{ longitude: initLng, latitude: initLat }];

        for (let i = 0; i < offsets.length; i++) {
            coordList.push({ longitude: initLng + offsets[i].lng, latitude: initLat + offsets[i].lat });
            coordList.push({ longitude: initLng - offsets[i].lng, latitude: initLat + offsets[i].lat });
            coordList.push({ longitude: initLng + offsets[i].lng, latitude: initLat - offsets[i].lat });
            coordList.push({ longitude: initLng - offsets[i].lng, latitude: initLat - offsets[i].lat });
            coordList.push({ longitude: initLng + offsets[i].lng, latitude: initLat + 0 });
            coordList.push({ longitude: initLng - offsets[i].lng, latitude: initLat + 0 });
            coordList.push({ longitude: initLng + 0, latitude: initLat + offsets[i].lat });
            coordList.push({ longitude: initLng + 0, latitude: initLat - offsets[i].lat });
        }
        return coordList;
    }
    const [convertedImage, setConvertedImage] = useState({ base64: '', type: '' });

    const convertImage = async () => {
        if (values.EventImage != '' && values.ImageEdited == true) {

            let filename = values.EventImage.split('/').pop();
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `${match[1]}` : `image`;

            let compressratio = 0.9;
            let needsCompress = false


            if (type == 'png') {
                if (values.EventImageSize > 200000)
                    needsCompress = true

                if (values.EventImageSize > 500000 && values.EventImageSize < 1000000)
                    compressratio = Math.min(500000 / values.EventImageSize, compressratio);
                else if (values.EventImageSize > 1000000 && values.EventImageSize < 2000000)
                    compressratio = Math.min(1000000 / values.EventImageSize, compressratio);
                else if (values.EventImageSize > 2000000)
                    compressratio = Math.min(2000000 / values.EventImageSize, compressratio);

                const reducedImage = await ImageManipulator.manipulateAsync(
                    values.EventImage,
                    [],
                    { compress: compressratio, base64: true }
                )
                setConvertedImage({ base64: reducedImage.base64, type: 'jpg' });

            }
            else if (type == 'jpg' || type == 'jpeg') {
                if (values.EventImageSize > 200000)
                    needsCompress = true;

                if (values.EventImageSize > 500000 && values.EventImageSize < 1000000)
                    compressratio = Math.min(500000 / values.EventImageSize, compressratio);
                else if (values.EventImageSize > 1000000 && values.EventImageSize < 2000000)
                    compressratio = Math.min(1000000 / values.EventImageSize, compressratio);
                else if (values.EventImageSize > 2000000 && values.EventImageSize < 4000000)
                    compressratio = Math.min(2000000 / values.EventImageSize, compressratio);
                else if (values.EventImageSize > 4000000)
                    compressratio = Math.min(0 / values.EventImageSize, compressratio);

                const reducedImage = await ImageManipulator.manipulateAsync(
                    values.EventImage,
                    [{ resize: { width: 300, height: 300 * values.EventImageDimensions.height * 1.0 / values.EventImageDimensions.width } }],
                    { base64: true }
                )
                setConvertedImage({ base64: reducedImage.base64, type: 'jpg' });

            }
            else {
                //type not supported???
            }
        }
    }
    const fixLinks = () => {
        if(values.Registration != '' && values.Registration.indexOf('http://') == -1 && values.Registration.indexOf('https://') == -1)
            values.Registration = 'https://' + values.Registration;

        if(values.OrganizerWebsite != '' && values.OrganizerWebsite.indexOf('http://') == -1 && values.OrganizerWebsite.indexOf('https://') == -1)
            values.OrganizerWebsite = 'https://' + values.OrganizerWebsite;
    }
    const [latlngArray, setLatLngArray] = useState([]);
    if (latlngArray.length == 0) {
        fixLinks();
        setLatLngArray(buildCoordinateList());
        convertImage();
    }
    // Helper functions
    const inPerson = [{ name: 'In Person', icon: require('../assets/person.png'), ket: 0, },
    { name: 'Virtual', icon: require('../assets/virtual.png'), key: 1 }]

    const renderCategories = () => {
        let mainCatName = '';
        for (let i = 0; i < Globals.categories.length; i++) {
            if (values.EventType == Globals.categories[i].id) {
                mainCatName = Globals.categories[i].name;
                break;
            }
        }
        return (
            <View style={{ flexDirection: 'row' }}>
                <Image
                    source={require('../assets/categories.png')}
                    style={{ width: 18, height: 18, tintColor: 'orange' }}>
                </Image>
                <Text numberOfLines={mainCatName.indexOf('/') == -1 ? 1 : 2}
                    style={{ marginLeft: 5, fontSize: 16, fontWeight: '600', color: 'orange', maxWidth: Globals.formFontAdj(160) }}>{mainCatName}</Text>
            </View>
        )
    }
    const registration = () => {
        if (values.Registration != '') {
            return (
                <View>
                    <Text style={{ fontWeight: '600', fontSize: Globals.formFontAdj(18), marginBottom: 10 }}>Registration</Text>
                    <Text style={{ fontSize: Globals.formFontAdj(15), marginBottom: 15, color: '#0085ff', textDecorationLine: 'underline' }}
                        onPress={() => Linking.openURL(values.Registration)} numberOfLines = {2}>
                        {values.Registration}
                    </Text>
                </View>
            )
        }
    }
    const moreDetails = () => {
        if (values.OrganizerEmail != '' && values.OrganizerWebsite != '') {
            return (
                <View>
                    <Text style={{ fontWeight: '600', fontSize: 18, marginBottom: 10, }}>More Details</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: Globals.formFontAdj(15) }}>Email: </Text>
                        <Text style={{ fontSize: Globals.formFontAdj(15), marginBottom: 8, }}>{values.OrganizerEmail}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: Globals.formFontAdj(15), marginBottom: 5, }}>Website: </Text>
                        <Text style={{ fontSize: Globals.formFontAdj(15), marginBottom: 10, color: '#0085ff', textDecorationLine: 'underline' }}
                            onPress={() => Linking.openURL(values.OrganizerWebsite)}>
                            {values.OrganizerWebsite.substr(0, 35) + (values.OrganizerWebsite.length > 35 ? '...' : '')}
                        </Text>
                    </View>
                </View>
            )
        } else if (values.OrganizerEmail != '') {
            return (
                <View>
                    <Text style={{ fontWeight: '600', fontSize: Globals.formFontAdj(18), marginBottom: 10, }}>More Details</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: Globals.formFontAdj(15) }}>Email: </Text>
                        <Text style={{ fontSize: Globals.formFontAdj(15), marginBottom: 10, }}>{values.OrganizerEmail}</Text>
                    </View>
                </View>
            )
        } else if (values.OrganizerWebsite != '') {
            return (
                <View>
                    <Text style={{ fontWeight: '600', fontSize: Globals.formFontAdj(18), marginBottom: 10, }}>More Details</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: Globals.formFontAdj(15), marginBottom: 5, }}>Website: </Text>
                        <Text style={{ fontSize: Globals.formFontAdj(15), marginBottom: 10, color: '#0085ff', textDecorationLine: 'underline' }}
                            onPress={() => Linking.openURL(values.OrganizerWebsite)}>
                            {values.OrganizerWebsite.substr(0, 35) + (values.OrganizerWebsite.length > 35 ? '...' : '')}
                        </Text>
                    </View>
                </View>
            )
        }
        else {
            return null;
        }
    }

    const [buttonColor1, setButtonColor1] = useState('#FFF')

    const toggle1 = () => {
        if (buttonColor1 == '#FFF') {
            setButtonColor1('#FFCB05')
        } else {
            setButtonColor1('#FFF')
        }
    }

    const [buttonColor2, setButtonColor2] = useState('#FFF')

    const toggle2 = () => {
        if (buttonColor2 == '#FFF') {
            setButtonColor2('#FFCB05')
        } else {
            setButtonColor2('#FFF')
        }
    }

    const [buttonColor3, setButtonColor3] = useState('#FFF')
    const toggle3 = () => {

    }
    const borderColor = (buttonColor) => {
        if (buttonColor == '#FFF') {
            return 'black'
        } else {
            return 'white'
        }
    }

    const [isTruncated, setIsTruncated] = useState(true);
    const resultString = isTruncated ? values.EventDescription.slice(0, 133) : values.EventDescription;
    const readMore = isTruncated ? 'Read More' : 'Read Less'
    const toggle = () => {
        setIsTruncated(!isTruncated);
    }
    const renderButton = () => {
        if (resultString.length > 130) {
            return (
                <TouchableOpacity onPress={toggle}>
                    <Text style={{ color: '#FFCB05', marginBottom: 10 }}>{readMore}</Text>
                </TouchableOpacity>
            );
        }
    }
    const renderTime = () => {
        return Globals.extraFormat(values.StartDay + ' ' + values.StartTime, values.EndDay + ' ' + values.EndTime);
    }
    const openMap = () => {
        const scheme = 'maps:0,0?q=';
        const latLng = `${values.Latitude},${values.Longitude}`;
        const label = Globals.getLocationName(values.Address);
        const url = `${scheme}${label}@${latLng}`
        Linking.openURL(url);
    }
    const locationChanged = () => {
        if (values.Longitude == values.OriginalLongitude
            && values.Latitude == values.OriginalLatitude) {
            return false;
        }
        else {
            return true;
        }
    }
    const createBody = () => {
        let initBody = {
            id: values.EventId,
            name: values.EventTitle.trim(),
            location: values.Address,
            locationName: values.LocationName,
            locationDetails: values.LocationDetails.trim(),
            description: values.EventDescription.trim(),
            privateEvent: values.Privacy != 'Public',
            virtualEvent: values.InPerson != 'In Person',
            latitude: values.Latitude,
            longitude: values.Longitude,
            registrationLink: values.Registration,
            organizer: values.OrganizerName.trim(),
            organizerWebsite: values.OrganizerWebsite,
            organizerEmail: values.OrganizerEmail,
            //startTime: "2021-08-09 20:00:00",
            startTime: values.RealStartDateTime.toISOString().substr(0, 10) + ' ' + values.RealStartDateTime.toISOString().substr(11, 8),
            endTime: values.RealEndDateTime.toISOString().substr(0, 10) + ' ' + values.RealEndDateTime.toISOString().substr(11, 8),
            //endTime: "2021-08-09 22:00:00",
            hostId: myContext.user.id,
            hostNotis: true,
            mainCategoryId: values.EventType,
            categoryIds: values.ContentType,
        }
        if (locationChanged()) {
            delete initBody.latitude;
            delete initBody.longitude;
            initBody.coordinates = latlngArray;
        }
        if (values.EventImage != '' && values.ImageEdited) {
            initBody.imageData = convertedImage.base64;
            initBody.imageExt = convertedImage.type;
        }
        else if (values.EventImage == '' && values.ImageEdited) {
            initBody.isImageDeleted = true;
        }
        return initBody;
    }
    const postToServer = () => { //post the event to the server
        fetch(Globals.eventsURL + '/json/update', {
            method: 'put',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(createBody())
        })
            .then((response) => response.json())
            .then((json) => {
                navigation.navigate({
                    name: 'Manage Event',
                    params: { item: json, user: myContext.user, fromEdit: true },
                    merge: true,
                })
            })
            .catch((error) => { Alert.alert("Something Went Wrong", Globals.serverErrorMessage) });
    }
    const postEventHandler = async () => {
        postToServer();
        // Navigate to map

    }
    return (
        <SafeAreaView style={{
            flex: 1,
            height: '100%',
            backgroundColor: '#fff'
        }} >
            <View style={{ flex: 1 }}>
                <PreviewHeader navigation={navigation} />
            </View>
            <ScrollView /*contentContainerStyle={{height: '78%'}}*/ style={{ height: '78%' }}>
                <View style={styles.panel}>
                    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 20 }}>
                        <View>
                            <Text style={{
                                fontSize: Globals.formFontAdj(24),
                                width: Dimensions.get('window').width - 105,
                                marginRight: 10,
                                fontWeight: '500'
                            }}
                                numberOfLines={2}>
                                {values.EventTitle}
                            </Text>
                        </View>
                        <View style={{ borderRadius: 5, borderWidth: 1, borderColor: 'black', padding: 5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: 'black' }}>{values.Privacy}</Text>
                        </View>

                    </View>
                    <View style={styles.panelHost}>
                        <Image
                            source={require('../assets/Vector.png')}
                            style={{ width: 18, height: 18, tintColor: 'orange' }}>
                        </Image>
                        <Text style={{ marginLeft: 5, maxWidth: 200, marginRight: 15, fontSize: Globals.formFontAdj(16), fontWeight: '600', color: 'orange',marginBottom: 3}}>{values.OrganizerName}</Text>
                        {renderCategories()}
                    </View>
                    <View style={styles.panelDate}>
                        <Image
                            source={require('../assets/CalendarIcon.png')}
                            style={{ width: 18, height: 18, tintColor: '#09189f' }}
                        ></Image>
                        <Text style={{ marginLeft: 5, fontSize: Globals.formFontAdj(16), fontWeight: '600', color: '#09189f' }}>{renderTime()}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 20 }}>
                        <TouchableOpacity style={{
                            backgroundColor: buttonColor1,
                            borderRadius: 8,
                            borderColor: borderColor(buttonColor1),
                            borderWidth: 1,
                            width: (Dimensions.get('window').width - 81.6) / 3,
                            height: 55,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginHorizontal: 15,
                        }}
                            onPress={toggle1}>
                            <View>
                                <Image
                                    source={require('../assets/star.png')}
                                    style={{ height: 18, width: 18, alignSelf: 'center', tintColor: borderColor(buttonColor1) }}
                                ></Image>
                                <Text style={{
                                    fontSize: Globals.formFontAdj(17),
                                    fontWeight: 'bold',
                                    color: borderColor(buttonColor1),
                                }}>Save</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            backgroundColor: buttonColor2,
                            borderRadius: 8,
                            borderColor: borderColor(buttonColor2),
                            borderWidth: 1,
                            width: (Dimensions.get('window').width - 81.6) / 3,
                            height: 55,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginHorizontal: 15,
                        }}
                            onPress={toggle2}>
                            <View>
                                <Image
                                    source={require('../assets/check2.png')}
                                    style={{ height: 18, width: 18, alignSelf: 'center', tintColor: borderColor(buttonColor2) }}
                                ></Image>
                                <Text style={{
                                    fontSize: Globals.formFontAdj(17),
                                    fontWeight: 'bold',
                                    color: borderColor(buttonColor2),
                                }}>I'm Going</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            backgroundColor: buttonColor3,
                            borderRadius: 8,
                            borderColor: borderColor(buttonColor3),
                            borderWidth: 1,
                            width: (Dimensions.get('window').width - 81.6) / 3,
                            height: 55,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginHorizontal: 15,
                        }}
                            onPress={toggle3}>
                            <View>
                                <Image
                                    source={require('../assets/share2.png')}
                                    style={{ height: 18, width: 18, alignSelf: 'center', tintColor: borderColor(buttonColor3) }}
                                ></Image>
                                <Text style={{
                                    fontSize: Globals.formFontAdj(17),
                                    fontWeight: 'bold',
                                    color: borderColor(buttonColor3),
                                }}>Share</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Image source={values.EventImage == '' ? require('../assets/avatar.png') : { uri: values.EventImage }}
                            resizeMode='cover'
                            style={{ width: Dimensions.get('window').width - 40.8, height: Dimensions.get('window').height > 700 ? 235 : 200, marginBottom: 20 }}>
                        </Image>
                    </View>
                    <Text style={{ fontWeight: '600', fontSize: Globals.formFontAdj(18), marginBottom: 10 }}>Event Description</Text>
                    <View>
                        <Text style={{ fontSize: Globals.formFontAdj(15), marginBottom: 10, lineHeight: 20, }}>{resultString.trim()}</Text>
                        {renderButton()}
                    </View>
                    <Text style={{ fontWeight: '600', fontSize: 18, marginBottom: 10 }}>Location</Text>
                    <Text style={{ fontSize: Globals.formFontAdj(15), marginBottom: values.LocationDetails == '' ? 15 : 5, color: '#0085ff', textDecorationLine: 'underline' }}
                        onPress={openMap}>
                        {values.Address}
                    </Text>
                    {values.LocationDetails != '' ? <Text style={{ fontSize: Globals.formFontAdj(15), marginBottom: 15, }}>({values.LocationDetails})</Text> : null}
                    {registration()}
                    {moreDetails()}
                    {/*
                <TouchableOpacity style={{flexDirection: 'row'}}>
                  <Image
                    source={require('../assets/CalendarIcon.png')}
                    style={{width:18, height: 18, marginBottom: 5}}>
                  </Image>
                  <Text style={{marginLeft: 5, maxWidth: 200, marginRight: 15, fontSize: 16, color: '#03a9f4'}}>Add Event to Calendar</Text>
                </TouchableOpacity>
                */}
                </View>
            </ScrollView>
            <View style={{ flexDirection: 'row', flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={{ alignItems: 'center', marginRight: '20%' }} onPress={() => navigation.navigate("Form")}>
                        <View style={styles.backContainer}>
                            <Text style={styles.backText}>Back</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={postEventHandler}>
                        <View style={styles.nextContainer}>
                            <Text style={styles.nextText}>Save Changes!</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
const Stack = createStackNavigator()

function UpdateEvent({ navigation, route }) {
    const myContext = useContext(AppContext);
    const { item } = route.params;
    // const { user } = route.params;
    let locSelected = item.virtualEvent === 'In Person' ? true : false;
    //
    let otherCategories;

    if (item.otherCategoryIds !== '') {
        otherCategories = item.otherCategoryIds.split(',').slice(0).map(Number);
    }
    else {
        otherCategories = [];
    }
    let ApiStartDate = item.startTime.substr(0, 10) + 'T' + item.startTime.substr(11, 8);
    let formattedApiStartDate = new Date(ApiStartDate);
    let startDateobj = Globals.createDateAsUTC(item.startTime.substr(0, 4), item.startTime.substr(5, 2), item.startTime.substr(8, 2),
        item.startTime.substr(11, 2), item.startTime.substr(14, 2), item.startTime.substr(17, 2));
    //formattedApiStartDate.setHours(formattedApiStartDate.getHours() - 4);
    let time = startDateobj.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    //
    let ApiEndDate = item.endTime.substr(0, 10) + 'T' + item.endTime.substr(11, 8);
    let formattedApiEndDate = new Date(ApiEndDate);
    let endDateobj = Globals.createDateAsUTC(item.endTime.substr(0, 4), item.endTime.substr(5, 2), item.endTime.substr(8, 2),
        item.endTime.substr(11, 2), item.endTime.substr(14, 2), item.endTime.substr(17, 2));
    //formattedApiEndDate.setHours(formattedApiEndDate.getHours() - 4); 
    let endTime = endDateobj.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    // date formatting
    let dateString = startDateobj.toString();
    let initialDateFormat = dateString.substring(0, 3) + ', ' + dateString.substring(4, dateString.indexOf(':') - 8);
    let dateString1 = endDateobj.toString();
    let initialEndDateFormat = dateString1.substring(0, 3) + ', ' + dateString1.substring(4, dateString1.indexOf(':') - 8);

    const [data, setData] = useState({
        // first slide
        EventId: item.id,
        EventTitle: item.name,
        OrganizerName: item.organizer,
        EventType: item.mainCategoryId,
        ContentType: otherCategories,
        Tags: item.Tags,
        Privacy: item.privateEvent ? "Private" : "Public",
        // second slide
        InPerson: item.virtualEvent ? (item.EventLink == '' ? "Virtual" : 'TBA') : "In Person",
        LocationName: item.locationName,
        EventLink: '',
        Address: item.location,
        locationSelected: !(item.virtualEvent),
        LocationDetails: item.locationDetails,
        OriginalLatitude: item.latitude,
        Latitude: item.latitude,
        OriginalLongitude: item.longitude,
        Longitude: item.longitude,
        // third slide
        StartDay: initialDateFormat,
        RealStartDateTime: startDateobj,
        StartTime: time,
        EndDay: initialEndDateFormat,
        RealEndDateTime: endDateobj,
        EndTime: endTime,
        Registration: item.registrationLink,
        // fourth slide
        EventDescription: item.description,
        OrganizerEmail: item.organizerEmail,
        OrganizerWebsite: item.organizerWebsite,
        EventImage: item.hasOwnProperty('eventImagePath') ? Globals.imageBase + '/' + item.eventImagePath.replace(/\\/g, "/") : '',
        EventImageSize: 0,
        ImageEdited: false,
    });

    const [currentStep, setCurrentStep] = useState(0);

    const handleNextStep = (newData, final = false) => {
        setData(prev => ({ ...prev, ...newData }))

        if (final) {
            return;
        }
        setCurrentStep(prev => prev + 1)
    }

    const handlePrevStep = (newData) => {
        setData(prev => ({ ...prev, ...newData }))
        setCurrentStep(prev => prev - 1)
    }

    const steps = [
        <EventInformation next={handleNextStep} data={data} />,
        <MoreInformation next={handleNextStep} prev={handlePrevStep} data={data} />,
        <EventSchedule next={handleNextStep} prev={handlePrevStep} data={data} />,
        <EventDetails next={handleNextStep} prev={handlePrevStep} data={data} />
    ];


    return (
        <View>{steps[currentStep]}</View>
    );
}

export default function EditEventScreen({ navigation }) {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Form" component={UpdateEvent} options={{ headerShown: false }} />
            <Stack.Screen name="Preview" component={Preview} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

{/* <Stack.Navigator>
            <Stack.Screen name="Form" component={steps[currentStep]} options={{headerShown: false}}/>
            <Stack.Screen name="Preview" component={Preview} options={{headerShown: false}}/>
       </Stack.Navigator>*/}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    containerBack: {
        backgroundColor: '#fff',
        height: '100%',

    },
    TextStyle: {
        fontSize: Globals.formFontAdj(19),
        fontWeight: '500',
        color: '#09189F',
        marginLeft: 23,
        marginTop: Globals.HR(10),
    },
    containerStyle: {

    },
    pickerStyle: {
        borderWidth: 1,
        borderColor: '#C4C4C4',
        padding: 8,
        width: '80%',
        margin: 10

    },
    InputBox: {
        borderWidth: 0,
        borderBottomWidth: 1.5,
        borderColor: '#C4C4C4',
        paddingVertical: 8,
        width: '88%',
        marginLeft: 24,
        marginTop: Globals.HR(5),
        marginBottom: 12,
        fontSize: Globals.formFontAdj(16),
    },

    imageStyle: {

    },
    container: {
        width: '100%',
        height: '100%',

        flexDirection: 'column',
        flexWrap: 'wrap',
        backgroundColor: '#FFF'

    },
    NewEventButton: {
        margin: 10
    },
    box: {
        width: '95%',
        height: '20%',
        padding: 5,
        margin: 10,
        flexDirection: 'row',
        flex: 1.2,

    },
    inner1: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    inner2: {
        flex: 4,
        justifyContent: 'center',

    },

    realImageStyle: {
        height: '100%',
        width: '100%',
        borderRadius: 40

    },
    scrollContainer: {
        paddingBottom: 80,
        zIndex: 0,
        height: Dimensions.get('window').height - Globals.HR(200) + 65,

    },
    outerContainer: {
        flex: 1,

    },
    innerContainer: {
        marginTop: 0,
    },
    searchContainer: {
        marginTop: Globals.HR(10),
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: '#fff',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
    },
    close: {
        position: 'absolute',
        left: windowWidth - 55,
        top: windowHeight / 92.6,
    },
    headerText: {
        fontSize: Globals.formFontAdj(24),
        fontWeight: 'bold',
        marginTop: windowHeight / 92.6,
        textAlign: 'center',
    },
    headerText2: {
        fontSize: Globals.formFontAdj(24),
        fontWeight: 'bold',
        marginTop: windowHeight / 92.6,
        marginLeft: '38%',
    },
    nextContainer: {
        backgroundColor: '#ffffff',

        marginHorizontal: WR(50),
        marginTop: HR(5),
        width: '90%',
        alignItems: 'center',
        top: 0,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        borderRadius: HR(10),
    },
    backContainer: {
        backgroundColor: '#ffffff',

        marginHorizontal: WR(50),
        marginTop: HR(5),
        width: '65%',
        alignItems: 'center',
        top: 0,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        borderRadius: HR(10),
    },
    backContainerInit: {
        backgroundColor: '#ffffff',
        opacity: 0.33,
        marginHorizontal: WR(50),
        marginTop: HR(5),
        width: '65%',
        alignItems: 'center',
        top: 0,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        borderRadius: HR(10),
    },
    nextText: {
        fontWeight: 'bold',
        fontSize: Globals.formFontAdj(18),
        paddingVertical: HR(10),
        color: '#fab400',
    },
    backText: {
        fontWeight: 'bold',
        fontSize: Globals.formFontAdj(18),
        paddingVertical: HR(10),
        color: '#09189F',
    },
    errorMessage: {
        color: '#D8000C',
        fontSize: Globals.formFontAdj(14)
    },
    errorMessagePickers: {
        color: '#D8000C',
        fontSize: Globals.formFontAdj(14),
        marginLeft: 24
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        flex: 1,
    },
    containerPreview: {
        flex: 1,
    },
    topbar: {
        position: 'absolute',
        top: 0,
        width: Dimensions.get('window').width,
    },
    header: {
        backgroundColor: '#fff',
        shadowColor: '#333333',
        shadowOffset: { width: -1, height: -2 },
        shadowRadius: 2,
        shadowOpacity: 0.4,
        paddingTop: Globals.HR(20),
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeader: {
        alignItems: 'center'
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
    panel: {
        padding: 20,
        backgroundColor: '#fff',
        paddingTop: Globals.HR(20),
        //paddingBottom: Dimensions.get('window').height,
    },
    panelTitle: {
        fontSize: Globals.formFontAdj(27),
        height: 35,
        marginRight: 10,
        width: Dimensions.get('window').width - 100
    },
    panelHost: {
        flexDirection: 'row',
        marginBottom: 10
    },
    panelDate: {
        flexDirection: 'row',
        marginBottom: 20
    },
    panelButtonTitle: {
        fontSize: Globals.formFontAdj(17),
        fontWeight: 'bold',
        color: 'white',
    },
    requiredField: {
        color: '#D8000C',
        fontSize: Globals.formFontAdj(20),
    },
    counterStyle: {
        // flex: 1,
        fontSize: Globals.formFontAdj(14),
        position: 'absolute',
        right: 0
    },
    messageContainer: {
        flexDirection: 'row',
        width: '88%',
        marginLeft: 24
    }

})
