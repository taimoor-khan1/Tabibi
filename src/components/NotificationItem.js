import React from 'react';
import styles from '../assets/styles';
import colors from '../config/Colors';
import {assets} from '../assets/images';
import {View, Text, Image, TouchableOpacity, I18nManager} from 'react-native';
import moment from 'moment';
import labels from '../config/Labels';

const NotificationItem = ({
  title,
  notifset = false,
  descripton,
  date,
  type,
  appointment,
  navigation,
  onDelete = () => {},
  onPress = () => {},
}) => {
  return (
    <>
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.mV(10), styles.notifiactionItmCont, styles.borderShadow]}
        onPress={() => onPress()}>
        {!notifset ? (
          <>
            <View style={[styles.flexRow, styles.justifyCntSP]}>
              <Text
                style={[styles.textMedium, styles.color(colors.black)]}
                numberOfLines={2}
                ellipsizeMode="tail">
                {title}
              </Text>
              {type === 'pending-payment' && appointment?.id && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate('CreditCard', {
                      from: false,
                      push: true,
                      walkin: false,
                      consultationId: appointment?.id,
                      slotId: appointment?.slotId,
                    })
                  }>
                  <View style={styles.payNow}>
                    <Text
                      style={[
                        styles.h3,
                        styles.color(colors.white),
                        styles.fontSize(12),
                      ]}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                      {labels.paynow}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
            <Text
              style={[styles.textNoti]}
              numberOfLines={4}
              ellipsizeMode="tail">
              {descripton}
            </Text>
          </>
        ) : (
          <View style={[styles.flexRow, styles.alignItemCenter]}>
            <View style={styles.flex(1)}>
              <Text
                style={[styles.textMedium, styles.color(colors.black)]}
                numberOfLines={2}
                ellipsizeMode="tail">
                {title}
              </Text>
              <Text
                style={[styles.textNoti]}
                numberOfLines={2}
                ellipsizeMode="tail">
                {descripton}
              </Text>
            </View>
            <View style={styles.flex(0.1)}>
              <TouchableOpacity onPress={() => onDelete()}>
                <Image
                  source={assets.deleteNotification}
                  style={[styles.height(20), styles.width(20)]}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        <Text
          style={[
            !notifset
              ? styles.textLightBlack
              : [styles.textLightBlackLeft, {textAlign: 'right'}],
            styles.mT(5),
          ]}
          numberOfLines={2}>
          {moment.utc(date).utcOffset(moment().utcOffset()).format('lll')}
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default NotificationItem;
