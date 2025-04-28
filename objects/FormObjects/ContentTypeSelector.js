import React, { Component } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import AppContext from '../AppContext';
import Globals from '../../../GlobalVariables';

export class ContentTypeSelector extends Component {
  constructor() {
    super();
    this.state = {
      selectedItems: [],
      maxItems: 3,
      maxItem: false,
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
    if (selectedItems.length >= this.state.maxItems) {
      if (selectedItems.length === this.state.maxItems) {
        this.setState({ selectedItems })
        this.props.form.values.ContentType = selectedItems;
      }
      this.setState({
        maxItem: true,
      })
      return
    }
    this.setState({
      maxItem: false,
    })

    this.setState({ selectedItems });
    this.props.form.values.ContentType = selectedItems;
  };
  render() {
    return (
      <View style={{ borderWidth: 1.2, borderColor: this.props.form.values.ContentType.length == 0 ? '#c4c4c4' : '#7b7b7b' }}>
        <SectionedMultiSelect
          ref={SectionedMultiSelect => this.SectionedMultiSelect = SectionedMultiSelect}
          items={this.state.items}
          IconRenderer={MaterialIcons}
          uniqueKey="id"
          subKey="children"
          selectText="More Categories If Needed"
          showDropDowns={false}
          readOnlyHeadings={true}
          hideSearch={true}

          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={this.props.form.values.ContentType}
          modalWithSafeAreaView={true}
          confirmText={`${this.props.form.values.ContentType.length}/${this.state.maxItems} - ${this.state.maxItems === this.props.form.values.ContentType.length ? 'Max selected - Confirm' : 'Confirm'
            }`}
          headerComponent={() => {
            return (
              <View style={styles.header}>
                <Text style={styles.headerText}>Categories</Text>
                <Ionicons name='ios-close-circle-outline' size={Globals.HR(35)} style={styles.close} onPress={() => this.SectionedMultiSelect._toggleSelector()} />
              </View>
            )
          }}
          styles={{
            subItemText: { fontSize: Globals.HR(23) }, itemIconStyle: { fontSize: Globals.HR(23) }, itemText: { fontSize: Globals.HR(23) }, modalWrapper: { borderWidth: 2 },
            selectToggle: { padding: Globals.HR(7), }, selectToggleText: { color: this.props.form.values.ContentType.length == 0 ? '#a3a3a3' : 'black', fontSize: Globals.HR(16), },
            chipContainer: { borderColor: '#7b7b7b' }, chipText: { color: 'black', fontSize: Globals.HR(16) }, confirmText: { paddingVertical: Globals.HR(7), fontSize: Globals.HR(21), fontWeight: '600' },
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
    marginTop: Globals.HR(15),
  },
  close: {
    position: 'absolute',
    right: 7,
    top: 7,
  },
})
