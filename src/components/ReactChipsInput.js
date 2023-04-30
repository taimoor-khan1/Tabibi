/**
 * @author Ramprasath R <ramprasath25@gmail.com>
 */
import React from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import Chips from './Chips';

class ReactChipsInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
      chips: props.initialChips ? props.initialChips : [],
      inputText: '',
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      chips: nextProps.initialChips ? nextProps.initialChips : [],
    });
  }

  render() {
    const { label, chipStyle, chipTextStyle } = this.props;
    const inputLabel = label ? label : '';
    const { isFocused } = this.state;
    const defaultLabel = {
      position: 'absolute',
      left: 5,
      top: !isFocused ? 12 : 1,
    };
    const defaultLabelTextStyle = {};
    if (isFocused) {
      defaultLabelTextStyle.fontSize = 14;
      defaultLabelTextStyle.color = '#000';
    } else {
      defaultLabelTextStyle.fontSize = 20;
      defaultLabelTextStyle.color = '#aaa';
    }
    const chips = this.state.chips.map((item, index) => (
      <Chips
        key={index}
        value={item.value}
        chipStyle={[chipStyle, { backgroundColor: item.color }]}
        chipTextStyle={chipTextStyle}
        close={this.props.edit}
        onPress={() => this.props.removedItem(item)}
      />
    ));
    return (
      <View>
        <View style={[styles.chipss]}>{chips}</View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  textInput: {
    height: 0,
    fontSize: 20,
    padding: 7,
    color: '#000',
  },
  chipss: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: '95%',
    alignSelf: 'center',
  },
});

export default ReactChipsInput;
