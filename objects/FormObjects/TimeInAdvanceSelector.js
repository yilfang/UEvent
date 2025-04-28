import React, { useState } from 'react';
import ModalSelector from 'react-native-modal-selector';
import { View, TextInput } from 'react-native';


const TimeInAdvanceSelector = ({ onChange, value }) => {

    const [textInputValue, setTextInputValue] = useState('');


    let index = 0;
    const data = [
        { key: index++, section: true, label: 'Amount of Time in Advance' },
        { key: index++, label: '1 Day' },
        { key: index++, label: '2 Days' },
        { key: index++, label: '3 Days' },
        { key: index++, label: '4 Days' }
        // etc...
        // Can also add additional custom keys which are passed to the onChange callback
    ];

    const handleInput = (option) => {
        setTextInputValue(option.label);
        onChange('Planning', option.label);

    };

    return (
        <View style={{ flex: 1, justifyContent: 'space-around', padding: 10 }}>

            <ModalSelector
                data={data}
                supportedOrientations={['portrait']}
                accessible={true}
                scrollViewAccessibilityLabel={'Scrollable options'}
                cancelButtonAccessibilityLabel={'Cancel Button'}
                onChange={handleInput}>

                <TextInput
                    style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, height: 40 }}
                    editable={false}
                    placeholder="Amount of Time in Advance"
                    value={value}

                />

            </ModalSelector>
        </View>
    );
}

// export
export default TimeInAdvanceSelector;