import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from '../assets/styles';
import colors from '../config/Colors';
import LinearGradient from 'react-native-linear-gradient';

const ButtonSmall = ({
  title,
  onBtnPress = () => {},
  type,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.mV(10), {borderRadius: 50, margin: 5}]}
      activeOpacity={0.7}
      onPress={() => onBtnPress()}>
      <LinearGradient
        colors={
          type == true
            ? disabled
              ? [colors.darkGrey, colors.darkGrey, colors.lightGrey]
              : [colors.white, colors.white, colors.white]
            : disabled
            ? [colors.darkGrey, colors.darkGrey, colors.lightGrey]
            : [colors.btngr1, colors.btngr2, colors.btngr3]
        }
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={[styles.borderShadow, styles.BtnContSmall]}>
        <View>
          <Text
            style={[
              type == true
                ? styles.color(colors.black)
                : styles.color(colors.white),
              styles.NormalBtnText,
            ]}>
            {title}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};
export default ButtonSmall;
