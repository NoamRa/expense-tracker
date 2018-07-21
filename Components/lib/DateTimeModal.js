import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
const style= {
  paddingTop: 5,
};

export default class DateTimePickerTester extends Component {
  state = {
    isDateTimePickerVisible: false,
  };

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (dateTime) => {
    this.props.onDateTimeChange(dateTime);
    this._hideDateTimePicker();
  };

  render () {
    return (
      <View style={style}>
        <TouchableOpacity onPress={this._showDateTimePicker}>
          <Text>Date &amp; Time</Text>
          <Text 
            style={{color:"black"}}
          >
            {`${this.props.date} - ${this.props.time}`}
          </Text>
        </TouchableOpacity>
        <DateTimePicker
          mode={"datetime"}
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
        />
      </View>
    );
  }

}