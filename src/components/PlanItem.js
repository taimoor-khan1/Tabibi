import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../assets/styles';
import colors from '../config/Colors';
import labels from '../config/Labels';

const PlanItem = ({
  status = false,
  blue = false,
  title,
  description = null,
  price,
  cancel = false,
  show = false,
  subscription = '',
  onSubscribe = () => { },
  onCancel = () => { },
}) => {
  // alert(cancel)

  // alert(status)
  return (
    <>
      <LinearGradient
        colors={
          blue
            ? ['#00A3EF', '#098BC8', '#1272A0']
            : ['#8022F5', '#631ABC', '#441181']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.flex(1), styles.gradientBox]}>
        <View style={[styles.flexRow, styles.justifyCntSP]}>
          <View style={[styles.flex(0.7), styles.alignItemsFlexStart]}>
            <Text style={styles.subscriptionTitleTxt}>{subscription}</Text>
          </View>
          <View style={[styles.flex(0.3), styles.alignItemsFlexend]}>
            <Text style={styles.subscriptionPriceTxt}>${price}</Text>
          </View>
        </View>
        <Text style={styles.subscriptionTitleTxt}>{title}</Text>
        <Text style={[styles.subscriptionBodyTxt, styles.mB(25)]}>
          {description}
        </Text>
      </LinearGradient>
      {show ? (
        <TouchableOpacity
          // disabled={cancel}
          activeOpacity={0.9}
          style={[
            styles.mV(5),
            styles.borderShadow,
            styles.planBtn,
            { elevation: 6 },
          ]}
          onPress={() => {
            console.log("status=====>", cancel)


            // cancel ? onCancel() : onSubscribe();



            status ? (cancel ? onCancel() : null) : onSubscribe();

          }}>
          <View
            style={[
              styles.BtnCont1,
              // { marginTop: 100 },
              styles.backgroundColor(cancel ? colors.white : colors.red),
            ]}>
            <Text
              style={[

                styles.btnText2,
                styles.textAlign,
                styles.textMedium,
                styles.color(cancel ? colors.black : colors.white),
              ]}>
              {status
                ? cancel
                  ? labels.can
                  : labels.canceled
                : labels.subscribe}
            </Text>
          </View>
        </TouchableOpacity>
      ) :
        <View style={styles.mV(10)} />}
    </>
  );
};

export default PlanItem;
