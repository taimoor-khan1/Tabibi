import React from 'react';
import {View, Text} from 'react-native';
import styles from '../assets/styles';
import colors from '../config/Colors';

const ProgressBar = ({percent}) => {
  return (
    <View style={[styles.greyBar, styles.mT(10)]}>
      <View style={percent && {...styles.blueBar, width: percent}} />
      <View
        style={[
          styles.progressTextCont,
          styles.justifyContentCenter,
          styles.alignItemCenter,
        ]}>
        <Text
          style={[
            styles.progressText,
            styles.mB(10),
            percent === '100.00%' && styles.color(colors.white),
          ]}>
          {percent >= '40%' ? percent + ' completed' : percent}
        </Text>
      </View>
    </View>
  );
};
export default ProgressBar;
