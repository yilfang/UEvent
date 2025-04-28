import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Globals from '../../../GlobalVariables';

/*
const categories = [{name:'Extracurriculars', icon: require('../../assets/extracurriculars.png'), id:1,},
{name:'Parties', icon: require('../../assets/parties.png'),id:2,}, {name:'Social',icon: require('../../assets/social.png'),id:3,},
{name:'Career',icon: require('../../assets/career.png'),id:4,}, {name:'Networking',icon: require('../../assets/networking.png'),id:5,},
{name:'Community',icon: require('../../assets/test2.png'),id:6,}, {name:'Fair/Festival',icon: require('../../assets/festival.png'),id:7,}, 
{name:'Greek Life',icon: require('../../assets/greeklife.png'),id:8,}, {name:'Sports',icon: require('../../assets/sports.png'),id:9,}, 
{name:'Games',icon: require('../../assets/games.png'),id:10,}, {name:'Cultural',icon: require('../../assets/cultural.png'),id:11,}, 
{name:'Activism',icon: require('../../assets/activism.png'),id:12,}, {name:'Music',icon: require('../../assets/music.png'),id:13,}, 
{name:'Art/Design', icon: require('../../assets/artdesign.png'),id:14,}, {name:'Food + Drink', icon: require('../../assets/fooddrink.png'),id:15,}, 
{name:'Performance', icon: require('../../assets/performance.png'),id:16,}, {name:'Presentation', icon: require('../../assets/presentation.png'),id:17,}, 
{name:'Exhibition', icon: require('../../assets/exhibition.png'),id:18,}, {name:'Academic', icon: require('../../assets/academic.png'),id:19,},
{name:'Science/Tech', icon: require('../../assets/science.png'),id:20,}, {name:'Business/Professional', icon: require('../../assets/business.png'),id:21,},
{name:'Other', icon: require('../../assets/other.png'),id:22,}];

const items = [
 {
  children: Globals.categories
 }
];
*/
export class EventTypeSelector extends Component {
  constructor() {
    super();
    this.state = {
      selectedItems: [],
      items: [{ children: Globals.categories }],
    };
  }
  renderListHeader = (onPress) => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>Categories</Text>
        <Ionicons name='ios-close-circle-outline' size={Globals.HR(35)} style={styles.close} onPress={onPress} />
      </View>
    )
  }
  onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedItems });
    this.props.form.values.EventType = selectedItems[0];
  };
  render() {
    return (
      <View style={{ borderWidth: 1.2, borderColor: this.props.form.values.EventType == null ? '#c4c4c4' : '#7b7b7b' }}>
        <SectionedMultiSelect
          ref={SectionedMultiSelect2 => this.SectionedMultiSelect2 = SectionedMultiSelect2}
          items={this.state.items}
          IconRenderer={MaterialIcons}
          uniqueKey="id"
          subKey="children"
          selectText="Choose a Category"
          showDropDowns={false}
          readOnlyHeadings={true}
          hideSearch={true}
          hideConfirm={true}
          single={true}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={[this.props.form.values.EventType]}
          modalWithSafeAreaView={true}

          headerComponent={() => {
            return (
              <View style={styles.header}>
                <Text style={styles.headerText}>Categories</Text>
                <Ionicons name='ios-close-circle-outline' size={Globals.HR(35)} style={styles.close} onPress={() => this.SectionedMultiSelect2._toggleSelector()} />
              </View>
            )
          }}
          styles={{
            subItemText: { fontSize: Globals.HR(23) }, itemIconStyle: { fontSize: Globals.HR(23) }, itemText: { fontSize: Globals.HR(23) }, modalWrapper: { borderWidth: 2 },
            selectToggle: { padding: Globals.HR(7), }, selectToggleText: { color: this.props.form.values.EventType == null ? '#a3a3a3' : 'black', fontSize: Globals.HR(16) },
            chipContainer: { borderColor: '#7b7b7b' }, chipText: { color: 'black' },
            selectedSubItemText: { color: '#fab400' }
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
  },
  headerText: {
    fontSize: Globals.HR(22),
    fontWeight: '600',
    marginLeft: 11.5,
    marginTop: 15,
  },
  close: {
    position: 'absolute',
    right: 7,
    top: Globals.HR(7),
  },
})
