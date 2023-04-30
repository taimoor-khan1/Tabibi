import React from 'react';
import {View, Text, Image, TouchableOpacity, I18nManager} from 'react-native';
import {Icon} from 'react-native-elements';
import styles from '../assets/styles';
import colors from '../config/Colors';
import LinearGradient from 'react-native-linear-gradient';
import config from '../config';

const ButtonGradient = ({
  title,
  titleColor = false,
  type,
  disabled = false,
  bottom = false,
  color = true,
  image = false,
  gradient = false,
  arrow = false,
  cancel = false,
  onBtnPress = () => {},
}) => {
  return (
    <>
      {config.api.version === 'DOCTOR' ? (
        <TouchableOpacity
          // disabled={disable}
          style={[
            bottom == true
              ? [
                  styles.backgroundColor('#ffffff'),
                  styles.padding(10),
                  styles.pT(0),
                ]
              : styles.mV(14),
            arrow && styles.mV(7),
          ]}
          activeOpacity={0.7}
          onPress={() => onBtnPress()}>
          <LinearGradient
            colors={
              gradient == true
                ? I18nManager.isRTL
                  ? cancel
                    ? [colors.pink1, colors.pink1, colors.pink1]
                    : [colors.btngr3, colors.btngr2, colors.btngr1]
                  : cancel
                  ? [colors.pink1, colors.pink1, colors.pink3]
                  : [colors.btngr1, colors.btngr2, colors.btngr3]
                : [colors.white, colors.white, colors.white]
            }
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[styles.buttonCont, styles.borderShadow, styles.shadowbb]}>
            {arrow ? (
              <View style={[styles.NormalBtn1, styles.flexRow]}>
                <Text
                  style={[
                    gradient == true
                      ? styles.color(colors.white)
                      : titleColor
                      ? styles.color(titleColor)
                      : styles.color(colors.black),
                    ,
                    styles.NormalBtnText,
                    styles.textAlignLeft,
                  ]}>
                  {title}
                </Text>
                {I18nManager.isRTL ? (
                  <Icon name="chevron-left" color={colors.white} />
                ) : (
                  <Icon name="chevron-right" color={colors.white} />
                )}
              </View>
            ) : (
              <View style={[styles.NormalBtn, styles.flexRow]}>
                {image && <Image source={image} style={[styles.mR(15)]} />}
                <Text
                  style={[
                    gradient == true
                      ? styles.color(colors.white)
                      : titleColor
                      ? styles.color(titleColor)
                      : styles.color(colors.black),
                    ,
                    styles.NormalBtnText,
                  ]}>
                  {title}
                </Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          // disabled={disable}
          style={[
            bottom == true
              ? [styles.backgroundColor('#ffffff'), styles.padding(10)]
              : styles.mV(14),
            arrow && styles.mV(7),
            {backgroundColor: 'transparent'},
          ]}
          activeOpacity={0.7}
          disabled={disabled}
          onPress={() => onBtnPress()}>
          <LinearGradient
            colors={
              type == true
                ? [colors.white, colors.white, colors.white]
                : I18nManager.isRTL
                ? disabled
                  ? [colors.darkGrey, colors.darkGrey, colors.lightGrey]
                  : [colors.btngr3, colors.btngr2, colors.btngr1]
                : disabled
                ? [colors.darkGrey, colors.darkGrey, colors.lightGrey]
                : [colors.btngr1, colors.btngr2, colors.btngr3]
            }
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[styles.buttonCont, styles.borderShadow, styles.shadowbb]}>
            {arrow ? (
              <View style={[styles.NormalBtn1, styles.flexRow]}>
                <Text
                  style={[
                    type == true
                      ? styles.color(colors.black)
                      : styles.color(colors.white),
                    styles.NormalBtnText,
                    styles.textAlignLeft,
                  ]}>
                  {title}
                </Text>
                {I18nManager.isRTL ? (
                  <Icon name="chevron-left" color={colors.white} />
                ) : (
                  <Icon name="chevron-right" color={colors.white} />
                )}
              </View>
            ) : (
              <View style={styles.NormalBtn}>
                {image && <Image source={image} style={[styles.mR(15)]} />}
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
            )}
          </LinearGradient>
        </TouchableOpacity>
      )}
    </>
  );
};
export default ButtonGradient;
