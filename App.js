import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Main from './Components/Main'
import conf from './conf/config'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE',
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
          {...conf}
        />
      </View>
    );
  }
}

export default App;
