import React from 'react';
import { TouchableOpacity, Text, View, Button, AsyncStorage  } from 'react-native';
import TitleAndTextInput from './lib/TitleAndTextInput'

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  initForm = () => {
    this.setState({ 
      dateTime: new Date(),
      payee: "",
      amount: 0,
      
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

  prepareDataForSubmit = (rawData, columnOrder) => {
    /*
    payload should look like
    { "values": [[
        value for column A, value for column B ....
      ]]
    }
    */
    let payload = [];
    payload = columnOrder.map((columnValue, idx) => {
      if (idx === 0) {
        return Date.now();
      } else if (rawData[columnValue.toLowerCase()]) {
        return rawData[columnValue.toLowerCase()];
      } else {
        return "";
      }
    })
    return JSON.stringify({ "values": [payload] });
  };

  queryParamObjToQueryString = (qParamsObj) => {
    return `?${Object.keys(qParamsObj).map(key => key + '=' + qParamsObj[key]).join('&')}`
  };

  generateOauth2URL = (client_id, client_secret, refresh_token) => {
    const qParamsObj = {
      client_id: client_id,
      client_secret: client_secret,
      refresh_token: refresh_token,
      grant_type: "refresh_token",
    };
    const queryString = this.queryParamObjToQueryString(qParamsObj);
    const url = `https://www.googleapis.com/oauth2/v4/token${queryString}`
    console.log("GoogleSheetsAppendURL:", url);
    return url;
  };

  generateGoogleSheetsAppendURL = (spreadsheetId, range, qParamsObj) => {
    const queryString = qParamsObj ? this.queryParamObjToQueryString(qParamsObj) : "";
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append${queryString}`
    console.log("GoogleSheetsAppendURL:", url);
    return url;
  };
  
  saveDataToGoogleSheets = () => {
    const oauth2TokenAPIURL = this.generateOauth2URL(this.props.CLIENT_ID, this.props.CLIENT_SECRET, this.props.REFRESH_TOKEN);
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
      const value = this.prepareDataForSubmit(this.state, this.props.columnOrder);
      console.log(value)
      const qParamsObj = {
        valueInputOption: "USER_ENTERED",
        includeValuesInResponse: true, 
        access_token: authData.access_token,
      };
      const gSheetAPIURL = this.generateGoogleSheetsAppendURL(this.props.spreadsheetId, `'${this.props.spreadSheetName}'`, qParamsObj);
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
    .catch((error) => {
      console.error(error);
    })
  };
  

  

  render() {
    return (
      <View>
        <Text>Expense Manager</Text>
        {/* <TouchableOpacity
          onPress={this.openAndroidDatePicker}
        >
          <TitleAndTextInput
            title="Date"
            placeholder="Payee Name"
            // onChangeText={this.handlePayeeChange}
            value={this.state.dateTime}
          />
        </TouchableOpacity> */}

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
          color="#841584"
          style={{paddingTop: 50}}
        />

        <View style={{paddingTop: 20}}>
          <Text>Date: {this.state.dateTime}</Text>
          <Text>Payee: {this.state.payee}</Text>
          <Text>Amount: {this.state.amount}</Text>
        </View>
    </View>
    );
  }
}

export default Main;