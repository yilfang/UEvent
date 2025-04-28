import React, { useState } from 'react';
import { View, Platform, StyleSheet, TouchableOpacity, Text, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Globals from '../../../GlobalVariables';

export const EndTimeSelector = ({ onChangeFormik, realStartDate, realEndDate }) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('time');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    let styledTime = currentDate.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    onChangeFormik('EndTime', styledTime);
    onChangeFormik('RealEndDateTime', new Date(new Date(realEndDate).setHours(currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds())));
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const dateFormatter = (dateString) => {
    return (
      <Text>{dateString.substring(0, 3) + ', ' + dateString.substring(4, dateString.indexOf(':') - 8)} </Text>
    );
  }
  return (
    <View>
      <View style={{ marginLeft: 20, marginTop: 10 }}>
        <TouchableOpacity onPress={showTimepicker}>
          <Text style={styles.dateText}>{realEndDate.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={show} transparent={true} animationType='slide'>
        <View style={styles.dateModal}>
          <TouchableOpacity onPress={() => setShow(false)}>
            <View style={{ backgroundColor: '#d7d7d7', alignItems: 'flex-end', width: '100%' }}>
              <Text style={{ fontSize: 18, color: '#0085ff', paddingVertical: 8, marginHorizontal: 15 }}>Done</Text>
            </View>
          </TouchableOpacity>
          <DateTimePicker
            testID="dateTimePicker"
            mode={mode}
            value={realEndDate}
            onChange={onChange}
            display='spinner'
            textColor = 'black'
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dateText: {
    fontSize: Globals.HR(21),
    fontWeight: '500',
    //color: '#09189E',
    marginLeft: 2,
    marginBottom: 10,
  },
  dateModal: {
    height: '30%',
    marginTop: 'auto',
    backgroundColor: 'white',
  }
})
