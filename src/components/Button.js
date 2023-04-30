import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import styles from '../assets/styles';
import colors from '../config/Colors';

const Button = ({
  title,
  Icon = false,
  onBtnPress = () => {},
  bgColor = false,
  dark = false,
  textColor = false,
  disabled = false,
}) => {
  return (
    <>
      <TouchableOpacity
        disabled={disabled}
        activeOpacity={0.7}
        style={[
          styles.mV(10),
          styles.mH(5),
          styles.shadowbb,
          {backgroundColor: colors.themeColor, borderRadius: 50},
        ]}
        onPress={() => onBtnPress()}>
        <View
          style={
            bgColor == colors.themeColor
              ? [
                  styles.BtnCont1,
                  styles.justifyContent,
                  {backgroundColor: bgColor},
                ]
              : [styles.BtnCont1, {backgroundColor: colors.white}]
          }>
          {Icon && <Image source={Icon} />}
          <Text
            style={
              textColor
                ? [styles.shreTextWhite]
                : [styles.btnText1, {textAlign: 'center'}]
            }>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
};
export default Button;
