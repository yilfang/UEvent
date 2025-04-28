import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { StyleSheet, Dimensions } from 'react-native';
import Globals from '../../../GlobalVariables';
import { Ionicons } from '@expo/vector-icons';

const PrivacySelector = ({ onChange, value }) => {
    const [isFocused5, setFocus5] = useState(false);
    return (
        <RNPickerSelect
            onValueChange={(value) => onChange('Privacy', value)}
            value={value}

            items={[
                { label: 'Public', value: 'Public' },
                { label: 'Private (Invite Only)', value: 'Private' },
            ]}
            style={{
                inputIOS: {
                    borderWidth: 1,
                    borderColor: value !== null || isFocused5 ? '#7b7b7b' : '#C4C4C4',
                    
                    paddingVertical: 10,
                    paddingHorizontal: 6,
                    width: '88%',
                    marginLeft: 23,
                    marginTop: Globals.HR(10),
                    marginBottom: Globals.HR(12),
                    flex: 1,
                    fontSize: Globals.HR(16),
                },
                placeholder: {
                    color: '#a3a3a3',
                    fontSize: Globals.HR(16),
                },
                iconContainer: {
                    top: Globals.HR(18),
                    right: Dimensions.get('window').width>600?Globals.WR(45.5):Globals.WR(37.5),
                }
            }
            }
            Icon={() => { return (<Ionicons name='chevron-down' size={20} />) }}
            onOpen={() => setFocus5(true)}
            onClose={() => setFocus5(false)}
            placeholder={{
                label: 'Public/Private',
                value: null,
            }}

        />
    );
};

export default PrivacySelector;

//not in use
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
