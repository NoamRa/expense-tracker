import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  View, 
  Button, 
  ToastAndroid,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import {
  formatDate,
  formatTime,
  prepareDataForSubmit,
  generateOauth2URL,
  generateGoogleSheetsAppendURL,
} from '../services/services'

import TitleAndTextInput from './lib/TitleAndTextInput'
import TitleAndPicker from './lib/TitleAndPicker';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyboardAvoidingViewEnabled: true,
    };
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
      category: "",
      paymentMethod: "",
      description: "",
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
    this.setState({ disableSubmit: true });
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
    const categoryItems = [{ label: "Select a Category", value: "" },
    ...this.props.categories.map((cat) => (
      { label: cat.name, value: cat.name }
    ))];

    const selectedSatObj = this.props.categories.find(cat => (
      cat.name === this.state.category
    ))
    
    const subCategoryItems = selectedSatObj ? 
      selectedSatObj.subCat.map((sc) => (
        { label: sc, value: sc }
      ))
      :
      [{ label: "N/A", value: "" }];

    const paymentMethodsItems = [{ label: "Select Payment Method", value: "" },
    ...this.props.paymentMethods.map((pm) => (
      { label: pm, value: pm }
    ))];

    return (
      <KeyboardAvoidingView
        enabled={this.state.keyboardAvoidingViewEnabled}
        behavior="position"
        keyboardVerticalOffset={50}
      >
        <Text style={{fontSize: 20, color: 'black'}}>
          Expense Tracker
        </Text>

        <TouchableOpacity
          onPress={this.openAndroidDatePicker}
        >
          <TitleAndTextInput
            title="Date"
            placeholder="Payee Name"
            // onChangeText={this.handlePayeeChange}
            value={`${this.state.date} - ${this.state.time}`}
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

        <TitleAndPicker
          title="Category"
          selectedValue={this.state.category}
          onValueChange={(value) => this.setState({ category: value })}
          items={categoryItems}
        />

        <TitleAndPicker
          title="Sub-Category"
          selectedValue={this.state.subCategory}
          onValueChange={(value) => this.setState({ subCategory: value })}
          items={subCategoryItems}
        />

        <TitleAndPicker
          title="Payment Method"
          selectedValue={this.state.paymentMethod}
          onValueChange={(value) => this.setState({ paymentMethod: value })}
          items={paymentMethodsItems}
        />

        <TitleAndTextInput
          title="Description"
          placeholder="Enter description"
          onChangeText={(value) => this.setState({ description: value })}
          value={this.state.description}
          onFocus={() => this.setState({ keyboardAvoidingViewEnabled: true })}
          onBlur={() => this.setState({ keyboardAvoidingViewEnabled: false })}
        />

        <View
          style={{paddingTop: 10}}
        >
          <Button
            onPress={this.saveDataToGoogleSheets}
            title="Submit"
            disabled={this.state.disableSubmit}
            color={"green"}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default Main;