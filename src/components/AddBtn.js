import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from '../assets/styles';
import colors from '../config/Colors';
import LinearGradient from 'react-native-linear-gradient';

const AddBtn = ({onBtnPress = () => {}, type, extraStyle}) => {
  return (
    <>
      <TouchableOpacity
        // disabled={disable}
        style={[styles.mV(14), styles.RoundBtnBtm,extraStyle]}
        activeOpacity={0.9}
        onPress={() => onBtnPress()}>
        <LinearGradient
          colors={
            type == true
              ? [colors.white, colors.white, colors.white]
              : [colors.btngr1, colors.btngr2, colors.btngr3]
          }
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={[styles.RoundbuttonCont, styles.borderShadow]}>
          <View style={styles.RoundBtn}>
            <Text
              style={[
                type == true
                  ? styles.color(colors.black)
                  : styles.color(colors.white),
                styles.RoundBtnText,
              ]}>
              +
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </>
  );
};
export default AddBtn;
