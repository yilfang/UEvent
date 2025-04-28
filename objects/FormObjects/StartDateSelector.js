import React, { useState } from 'react';
import { View, Platform, StyleSheet, TouchableOpacity, Text, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Globals from '../../../GlobalVariables';

export const StartDateSelector = ({ onChangeFormik, realStartDate, realEndDate }) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    let dateString = currentDate.toString();
    const styledDate = dateString.substring(0, 3) + ', ' + dateString.substring(4, dateString.indexOf(':') - 8);
    let styledTime = currentDate.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    onChangeFormik('StartDay', styledDate);
    onChangeFormik('StartTime',styledTime);
    //let newDate = new Date(new Date(realStartDate).setFullYear(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()));
    onChangeFormik('RealStartDateTime', selectedDate);
    //console.log(realStartDate);
    // change end date value if date is greater than it
    /*
    if (newDate.getTime() > realEndDate.getTime()) {
      let changedEndDate = new Date(new Date(newDate).setHours(newDate.getHours() + 1));
      let changedEndDateString = changedEndDate.toString();
      let styledChangedEndDate = changedEndDateString.substring(0,3)+', '+changedEndDateString.substring(4,changedEndDateString.indexOf(':')-8);
      onChangeFormik('RealEndDateTime', new Date(new Date(newDate).setHours(newDate.getHours() + 1)));
      onChangeFormik('EndDay', styledChangedEndDate);
      onChangeFormik('EndTime',)
    }
    */
    {/*else if (currentDate.getTime() === endDate.getTime()) {
      if (startTime.getTime() > endTime.getTime()) {
          let newEndTime = new Date(new Date(startTime).setHours(startTime.getHours() + 1));
          let newEndTime1 = newEndTime.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
          onChangeFormik('EndTime', newEndTime1);
          onChangeFormik('EndTimeFormPurposes', newEndTime);
      }
    }*/}
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('datetime');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const dateFormatter = (dateString) => {
    return (
      <Text>{dateString.substring(0, 3) + ', ' + dateString.substring(4, dateString.indexOf(':') - 8) + ','
        + dateString.substring(dateString.indexOf(':') - 8, dateString.indexOf(':') - 3) + ', ' + 
        realStartDate.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      } </Text>
    );
  }
  return (
    <View>
      <View style={{ marginLeft: 20, marginTop: 10 }}>
        <TouchableOpacity onPress={showDatepicker}>
          <Text style={styles.dateText}>{dateFormatter(realStartDate.toString())}</Text>
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
            value={realStartDate}
            onChange={onChange}
            display='spinner'
            textColor = 'black'
            minimumDate={new Date()}
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
    marginLeft: 3,
    marginBottom: 5,
    //color: '#09189E',
  },
  dateModal: {
    height: '30%',
    marginTop: 'auto',
    backgroundColor: 'white',
  }
})
