import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Main from './Components/Main'
import conf from './conf/config'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50
  },
});

class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Main
          spreadsheetId={conf.spreadsheetId}
          spreadSheetName={conf.spreadSheetName}
          CLIENT_ID={conf.CLIENT_ID}
          CLIENT_SECRET={conf.CLIENT_SECRET}
          REFRESH_TOKEN={conf.REFRESH_TOKEN}
          SCOPE={conf.SCOPE}
        />
      </View>
    );
  }
}

export default App;
