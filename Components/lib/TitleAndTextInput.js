import React from 'react';
import { TextInput, View, Text } from 'react-native';

const TitleAndTextInput = (props) => {
  const style = {
    paddingTop: 5,
  }

  const TIStyle={
    height: 40, 
    width: 300,
    borderColor: 'gray', 
    borderWidth: 1,
  }
  
  return (
    <View style={style}>
      {props.title &&
        <Text>{props.title}</Text>
      }
      <TextInput
        placeholder={props.placeholder}
        style={TIStyle}
        value={props.value}
        onChangeText={props.onChangeText}
        keyboardType={props.keyboardType}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
      />
    </View>
  )
}

export default TitleAndTextInput;