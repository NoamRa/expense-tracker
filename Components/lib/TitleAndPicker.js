import React from 'react';
import { Picker, View, Text } from 'react-native';

const TitleAndPicker = (props) => {
  const style = {
    paddingTop: 5,
  }

  const TPStyle={
    height: 40, 
    width: 300,
    borderColor: 'gray', 
    borderWidth: 1,
  }

  const renderPickerItems = (items) => {
    const piList = items.map(pi => (
      <Picker.Item
        key={pi.value}
        label={pi.label} 
        value={pi.value}
        />
    ))
    return piList
  }

  return (
    <View style={style}>
      {props.title &&
        <Text>{props.title}</Text>
      }
      <Picker
        selectedValue={props.selectedValue}
        style={TPStyle}
        onValueChange={props.onValueChange}
      >
        {renderPickerItems(props.items)}
      </Picker>
    </View>
  )
}

export default TitleAndPicker;