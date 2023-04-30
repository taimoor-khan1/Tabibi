import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import styles from '../assets/styles';
import colors from '../config/Colors';

const ButtonWhite = ({
  title,
  Icon = false,
  onBtnPress = () => {},
  bgColor = false,
  dark = false,
  textColor = false,
  bluetxt = false,
  exstyle = false,
  disable = false,
}) => {
  return (
    <>
      <TouchableOpacity
        disabled={disable}
        activeOpacity={0.7}
        style={[
          styles.mV(10),
          styles.borderShadow,
          {backgroundColor: colors.white, borderRadius: 50, margin: 5},
          exstyle,
        ]}
        onPress={() => onBtnPress()}>
        <View
          style={
            bgColor == colors.themeColor
              ? [
                  styles.BtnCont1,
                  styles.justifyContent,
                  {backgroundColor: bgColor, height: 40, padding: 0},
                ]
              : [styles.BtnCont1, {backgroundColor: colors.white, padding: 0}]
          }>
          {Icon && <Image source={Icon} style={styles.mR(5)} />}
          <Text
            style={
              textColor
                ? [styles.shreTextWhite]
                : [
                    styles.btnText2,
                    {textAlign: 'center'},
                    bluetxt && styles.textBlueC,
                  ]
            }>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
};
export default ButtonWhite;
