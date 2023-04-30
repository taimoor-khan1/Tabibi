import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  I18nManager,
  Switch,
} from 'react-native';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import {GreadientHeader} from '../../components';
import {useDispatch, useSelector} from 'react-redux';
import {
  setIncomingNotification,
  setNotificationDr,
  setNotification,
  setIncomingNotificationDr,
  drGetProfile,
  getProfile,
} from '../../store/actions';
import config from '../../config';

const NotificationSwitch = ({navigation}) => {
  //Redux store
  const dispatch = useDispatch();
  const {profile, role, user} = useSelector((state) => state.Auth);

  //Fuctions
  const toggleSwitch = (type) => {
    if (type === 'notification') {
      if (config.api.version === 'PATIENT') {
        return dispatch(setIncomingNotification());
      } else {
        return dispatch(setIncomingNotificationDr({from: role}));
      }
    } else if (type === 'sms') {
      if (config.api.version === 'PATIENT') {
        return dispatch(setNotification({from: role, type: type}));
      } else {
        return dispatch(setNotificationDr({from: role, type: type}));
      }
    } else if (type === 'email') {
      if (config.api.version === 'PATIENT') {
        return dispatch(setNotification({from: role, type: type}));
      } else {
        return dispatch(setNotificationDr({from: role, type: type}));
      }
    }
  };

  useEffect(() => {
    const params = {
      user_id: user?.userId,
      from: role,
    };
    if (config.api.version === 'PATIENT') {
      dispatch(getProfile(params, false));
    } else {
      dispatch(drGetProfile(params, false));
    }
  }, []);
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <GreadientHeader
          showLeftIcon={true}
          showRightIcon={false}
          showCenterText={labels.notification}
          showLeftText={labels.back}
          back={true}
          leftRoute={() => navigation.goBack()}
        />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <View style={styles.height(20)} />
        <View style={styles.mH(20)}>
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.margin(10)]}
            onPress={() => {}}>
            <View style={[styles.settingCont, styles.borderShadow]}>
              <View style={[styles.flexRow]}>
                <View
                  style={[
                    styles.alignItemsFlexStart,
                    styles.flexRow,
                    styles.flex(0.5),
                  ]}>
                  <Image source={assets.bell} />
                  <Text style={[styles.settingText]}>
                    {labels.notificationAPP}
                  </Text>
                </View>
                <View style={[styles.alignItemsFlexend, styles.flex(0.5)]}>
                  <Switch
                    trackColor={{
                      true: colors.themeColor,
                      false: colors.grey,
                    }}
                    thumbColor={true ? colors.white : colors.grey}
                    ios_backgroundColor={colors.grey}
                    style={[{bottom: 5, marginRight: 5}]}
                    onValueChange={() => toggleSwitch('notification')}
                    value={profile?.allowNotification === true}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.margin(10)]}
            onPress={() => {}}>
            <View style={[styles.settingCont, styles.borderShadow]}>
              <View style={[styles.flexRow]}>
                <View
                  style={[
                    styles.alignItemsFlexStart,
                    styles.flexRow,
                    styles.flex(0.5),
                  ]}>
                  <Image source={assets.bell} />
                  <Text style={[styles.settingText]}>
                    {labels.notificationSMS}
                  </Text>
                </View>
                <View style={[styles.alignItemsFlexend, styles.flex(0.5)]}>
                  <Switch
                    trackColor={{
                      true: colors.themeColor,
                      false: colors.grey,
                    }}
                    thumbColor={true ? colors.white : colors.grey}
                    ios_backgroundColor={colors.grey}
                    style={[{bottom: 5, marginRight: 5}]}
                    onValueChange={() => toggleSwitch('sms')}
                    value={profile?.allowSmsNotification === true}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.margin(10)]}
            onPress={() => {}}>
            <View style={[styles.settingCont, styles.borderShadow]}>
              <View style={[styles.flexRow]}>
                <View
                  style={[
                    styles.alignItemsFlexStart,
                    styles.flexRow,
                    styles.flex(0.5),
                  ]}>
                  <Image source={assets.bell} />
                  <Text style={[styles.settingText, {width: 130}]}>
                    {labels.notificationEmail}
                  </Text>
                </View>
                <View style={[styles.alignItemsFlexend, styles.flex(0.5)]}>
                  <Switch
                    trackColor={{
                      true: colors.themeColor,
                      false: colors.grey,
                    }}
                    thumbColor={true ? colors.white : colors.grey}
                    ios_backgroundColor={colors.grey}
                    style={[{bottom: 5, marginRight: 5}]}
                    onValueChange={() => toggleSwitch('email')}
                    value={profile?.allowEmailNotification === true}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default NotificationSwitch;
