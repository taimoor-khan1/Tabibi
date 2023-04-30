import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from '../assets/styles';

const EarningItem = ({description, pay, onPress = () => {}}) => {
  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress}>
      <View style={[styles.flexRow]}>
        <View style={styles.flex(0.8)}>
          <Text numberOfLines={4} style={styles.earningsDescriptiom}>
            {description}
          </Text>
        </View>
        <View style={[styles.flex(0.2), styles.justifyContent]}>
          <Text style={styles.earningsPrice}>${pay}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EarningItem;
