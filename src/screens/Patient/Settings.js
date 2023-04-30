import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  I18nManager,
  Switch,
} from 'react-native';
import {Icon} from 'react-native-elements';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import {GreadientHeader} from '../../components';
import config from '../../config';
import {useDispatch, useSelector} from 'react-redux';
import Snackbar from 'react-native-snackbar';
import fonts from '../../assets/fonts';

const Settings = ({navigation}) => {
  //Redux store
  const dispatch = useDispatch();
  const {profile, role} = useSelector((state) => state.Auth);
  const {getProfileDetail} = useSelector((state) => state.Doctor);

  //Validations before creating schedules
  const checkValidation = (index) => {
    if (getProfileDetail?.location?.length) {
      // need purpose of consultation against every schedule
      navigation.navigate('DrAddPOC',{data:null,from:null});
    } else {
      showToast('POC');
    }
  };
  //Toasts
  const showToast = (type) => {
    if (type === 'POC') {
      Snackbar.show({
        text: labels.empLoc,
        duration: Snackbar.LENGTH_LONG,
        numberOfLines: 10,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
        action: {
          text: 'Go to profile',
          textColor: colors.dim,
          onPress: () => {
            navigation.navigate('DrMyProfile');
          },
        },
      });
    }
  };
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <GreadientHeader
          showLeftIcon={true}
          showRightIcon={false}
          showCenterText={labels.settings}
          showLeftText={labels.back}
          back={true}
          leftRoute={() => {
            Snackbar.dismiss();
            navigation.goBack();
          }}
        />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <View style={styles.height(20)} />
        <View style={styles.mH(20)}>
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.margin(10)]}
            onPress={() => {
              Snackbar.dismiss();
              navigation.navigate('NotificationSwitch');
            }}>
            <View style={[styles.settingCont, styles.borderShadow]}>
              <View style={[styles.flexRow]}>
                <View
                  style={[
                    styles.alignItemsFlexStart,
                    styles.flexRow,
                    styles.flex(0.7),
                  ]}>
                  <Image source={assets.lock} />
                  <Text style={[styles.settingText]}>
                    {labels.notification}
                  </Text>
                </View>
                <View style={[styles.alignItemsFlexend, styles.flex(0.3)]}>
                  {I18nManager.isRTL ? (
                    <Icon
                      name="chevron-left"
                      color={
                        config.api.version === 'DOCTOR'
                          ? colors.themeColor
                          : colors.heading
                      }
                    />
                  ) : (
                    <Icon
                      name="chevron-right"
                      color={
                        config.api.version === 'DOCTOR'
                          ? colors.themeColor
                          : colors.heading
                      }
                    />
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
          {config.api.version === 'DOCTOR' && (
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.margin(10)]}
              onPress={() => {
                Snackbar.dismiss();
                navigation.navigate('NotificationSetting');
              }}>
              <View style={[styles.settingCont, styles.borderShadow]}>
                <View style={[styles.flexRow]}>
                  <View
                    style={[
                      styles.alignItemsFlexStart,
                      styles.flexRow,
                      styles.flex(0.7),
                    ]}>
                    <Image source={assets.notificatioSetup} />
                    <Text style={[styles.settingText]}>
                      {labels.NotificationSetup}
                    </Text>
                  </View>
                  <View style={[styles.alignItemsFlexend, styles.flex(0.3)]}>
                    {I18nManager.isRTL ? (
                      <Icon name="chevron-left" color={colors.themeColor} />
                    ) : (
                      <Icon name="chevron-right" color={colors.themeColor} />
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          {config.api.version === 'DOCTOR' && (
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.margin(10)]}
              onPress={() => {
                checkValidation();
              }}>
              <View style={[styles.settingCont, styles.borderShadow]}>
                <View style={[styles.flexRow]}>
                  <View
                    style={[
                      styles.alignItemsFlexStart,
                      styles.flexRow,
                      styles.flex(0.7),
                    ]}>
                    <Image source={assets.addNewPoc} />
                    <Text style={[styles.settingText]}>{labels.addPOC}</Text>
                  </View>
                  <View style={[styles.alignItemsFlexend, styles.flex(0.3)]}>
                    {I18nManager.isRTL ? (
                      <Icon name="chevron-left" color={colors.themeColor} />
                    ) : (
                      <Icon name="chevron-right" color={colors.themeColor} />
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.margin(10)]}
            onPress={() => {
              Snackbar.dismiss();
              navigation.navigate('ChangePassword');
            }}>
            <View style={[styles.settingCont, styles.borderShadow]}>
              <View style={[styles.flexRow]}>
                <View
                  style={[
                    styles.alignItemsFlexStart,
                    styles.flexRow,
                    styles.flex(0.7),
                  ]}>
                  <Image source={assets.lock} />
                  <Text style={[styles.settingText]}>{labels.changePwd}</Text>
                </View>
                <View style={[styles.alignItemsFlexend, styles.flex(0.3)]}>
                  {I18nManager.isRTL ? (
                    <Icon
                      name="chevron-left"
                      color={
                        config.api.version === 'DOCTOR'
                          ? colors.themeColor
                          : colors.heading
                      }
                    />
                  ) : (
                    <Icon
                      name="chevron-right"
                      color={
                        config.api.version === 'DOCTOR'
                          ? colors.themeColor
                          : colors.heading
                      }
                    />
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default Settings;
