import React, { useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { StyleSheet } from 'react-native';

const InPersonSelector = ({ onChange, value }) => {
    const [isFocused, setFocus] = useState(false);
    return (
        <RNPickerSelect
            onValueChange={(value) => onChange('InPerson', value)}
            value={value}

            items={[
                { label: 'In Person', value: 'In Person' },
                { label: 'Virtual', value: 'Virtual' },
                { label: 'TBA', value: 'TBA' }
            ]}
            style={{
                inputIOS: {
                    borderWidth: 1,
                    borderColor: value !== null || isFocused ? '#7b7b7b' : '#C4C4C4',
                    borderWidth: 1.2,
                    padding: 9,
                    width: '88%',
                    marginLeft: 20,
                    marginTop: 10,
                    flex: 1,
                    fontSize: 16
                },
                placeholder: {
                    color: '#a3a3a3',
                }
            }}
            onOpen={() => setFocus(true)}
            onClose={() => setFocus(false)}
            placeholder={{
                label: 'In Person/Virtual/TBA',
                value: null,

            }}
        />
    );
};

export default InPersonSelector;

const styles = StyleSheet.create({
    InputBox: {
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: '#C4C4C4',
        padding: 8,
        width: '80%',
        margin: 10
    }
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        borderWidth: 1,
        borderColor: '#C4C4C4',
        padding: 8,
        width: '80%',
        marginLeft: 20,
        marginTop: 10
    },
    inputAndroid: {
        borderWidth: 1,
        borderColor: '#C4C4C4',
        padding: 8,
        width: '80%',
        marginLeft: 20,
        marginTop: 10
    },
});
