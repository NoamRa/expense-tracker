import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  View, 
  Button, 
  ToastAndroid,
  Keyboard
} from 'react-native';
import TitleAndTextInput from './lib/TitleAndTextInput'
import {
  formatDate,
  formatTime,
  prepareDataForSubmit,
  generateOauth2URL,
  generateGoogleSheetsAppendURL,
} from '../services/services'

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.initForm();
  }

  initForm = () => {
    this.now = new Date();
    this.setState({ 
      date: formatDate(this.now),
      time: formatTime(this.now),
      payee: "",
      amount: "",
      disableSubmit: false,
    });
  };

  openAndroidDatePicker = async (stateKey, options) => {
    try {
      var newState = {};
      const {action, year, month, day} = await DatePickerAndroid.open(options);
      if (action === DatePickerAndroid.dismissedAction) {
        newState[stateKey + 'Text'] = 'dismissed';
      } else {
        var date = new Date(year, month, day);
        newState[stateKey + 'Text'] = date.toLocaleDateString();
        newState[stateKey + 'Date'] = date;
      }
      this.setState(newState);
    } catch ({code, message}) {
      console.warn(`Error in example '${stateKey}': `, message);
    }
  };

  validate = () => {
    this.setState({ disableSubmit: true });
  }
  
  saveDataToGoogleSheets = () => {
    Keyboard.dismiss();
    const oauth2TokenAPIURL = generateOauth2URL(this.props.CLIENT_ID, this.props.CLIENT_SECRET, this.props.REFRESH_TOKEN);
    return fetch(oauth2TokenAPIURL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("data:", data)
      return data;
    })
    .then((authData) => {
      const value = prepareDataForSubmit(this.state, this.props.columnOrder);
      console.log(value)
      const qParamsObj = {
        valueInputOption: "USER_ENTERED",
        includeValuesInResponse: true, 
        access_token: authData.access_token,
      };
      const gSheetAPIURL = generateGoogleSheetsAppendURL(this.props.spreadsheetId, `'${this.props.spreadSheetName}'`, qParamsObj);
      return fetch(gSheetAPIURL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': value.length.toString()
        },
        body: value
      });
    }) 
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      return responseJson;
    })
    .then((responseJson) => {
      ToastAndroid.show('Sucess! Sent to Google Sheets', ToastAndroid.SHORT);
      this.initForm()
    })
    .catch((error) => {
      console.error(error);
    })
  };
  
  render() {
    return (
      <View>
        <Text>Expense Manager</Text>
        <TouchableOpacity
          onPress={this.openAndroidDatePicker}
        >
          <TitleAndTextInput
            title="Date"
            placeholder="Payee Name"
            // onChangeText={this.handlePayeeChange}
            value={`${this.state.date} ${this.state.time}`}
          />
        </TouchableOpacity>

        <TitleAndTextInput
          title="Payee"
          placeholder="Payee name"
          onChangeText={(value) => this.setState({ payee: value })}
          value={this.state.payee}
        />

        <TitleAndTextInput
          title="Amount"
          placeholder="Amount paid"
          onChangeText={(value) => this.setState({ amount: value })}
          value={this.state.amount}
          keyboardType={'numeric'}
        />


        <Button
          onPress={this.saveDataToGoogleSheets}
          title="Submit"
          disabled={this.state.disableSubmit}
          color={"green"}
          style={{paddingTop: 50}}
        />

        <View style={{paddingTop: 20}}>
          <Text>Report Time: {`${this.state.date} ${this.state.time}`}</Text>
          <Text>Payee: {this.state.payee}</Text>
          <Text>Amount: {this.state.amount}</Text>
        </View>
    </View>
    );
  }
}

export default Main;