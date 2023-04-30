import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { assets } from '../assets/images';
import styles from '../assets/styles';

const Chips = (props) => {
  const { value, onPress, chipStyle, chipTextStyle = true, close } = props;
  return (
    <View style={[styles.chip, chipStyle]}>
      <View style={[styles.flexRow]}>
        <View style={styles.alignItemsFlexStart}>
          <Text
            style={[chipTextStyle]}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {value}
          </Text>
        </View>
        {!close ? (
          <View style={[styles.chipCloseBtn]}>
            <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
              <Image style={{ width: 10, height: 10 }} source={assets.closeW} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.chipCloseBtn, { margin: 2, padding: 3 }]}>
            <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
              <Image style={{ width: 20, height: 20, }} source={assets.editPencile} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default Chips;
