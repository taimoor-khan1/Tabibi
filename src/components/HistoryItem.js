import React from 'react';
import styles from '../assets/styles';
import {View, Text, TouchableOpacity} from 'react-native';

export default HistoryItem = ({
  title = false,
  date = false,
  onPress = () => {},
}) => {
  return (
    <>
      <TouchableOpacity activeOpacity={0.7} onPress={() => onPress()}>
        <View style={[styles.mV(10), styles.HisItmCont, styles.borderShadow]}>
          <View style={[styles.rowCont]}>
            <View style={[styles.flex(1), styles.flexRow]}>
              <View style={[styles.flex(5)]}>
                {title && (
                  <Text
                    style={[styles.textSemiBold, styles.fontSize(13)]}
                    ellipsizeMode="tail">
                    {title}
                  </Text>
                )}
                {date && (
                  <Text
                    style={[styles.textLight, styles.fontSize(10)]}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}>
                    {date}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};
