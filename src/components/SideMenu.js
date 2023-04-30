import React from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import styles from '../assets/styles';
import colors from '../config/Colors';
import labels from '../config/Labels';
import LinearGradient from 'react-native-linear-gradient';
import MenuItemComponent from './MenuItem';
import {ButtonGradient} from '../components';
import config from '../config';
import {assets} from '../assets/images';
import AsyncStorage from '@react-native-community/async-storage';
import Snackbar from 'react-native-snackbar';
import {useSelector, useDispatch} from 'react-redux';
import {Logout, Drlogout} from '../store/actions';
import fonts from '../assets/fonts';

const SideMenu = ({navigation}) => {
  //Redux Store
  const {user, profile, role, appversion, estDoc} = useSelector(
    (state) => state.Auth,
  );
  const {subscriptions} = useSelector((state) => state.Calling);

  const dispatch = useDispatch();
  var sideMenuOptionsPatient = [];
  var sideMenuOptionsDoctor = [];

  //On LogOut Funtion
  const logOut = async () => {
    if (config.api.version === 'PATIENT') {
      dispatch(Logout(navigation));
    } else {
      if (!role) {
        return clearLogin();
      }
      dispatch(Drlogout(navigation, role));
    }
  };
  // Clear login
  const clearLogin = async () => {
    await AsyncStorage.removeItem('user_detail');
    await AsyncStorage.removeItem('token_detail');
    if (config.api.version === 'DOCTOR') {
      navigation.reset({
        index: 0,
        routes: [{name: 'LoginStack'}],
      });
    } else {
      navigation.replace('LoginStack', {screen: 'Login'});
    }
  };
  const setDoctor = (item) => {
    navigation.navigate('DrAllDoctors');
    dispatch({
      type: 'SET_EST_DOCTOR',
      payload: null,
    });
  };

  // Side Menu Data
  if (Object.values(user).length > 0) {
    sideMenuOptionsPatient = [
      {
        title: labels.homes,
        route: 'Home',
        callBack: () => {},
      },
      {
        title: labels.prescriptions,
        route: 'Prescription',
        callBack: () => {},
      },
      {
        title: labels.appointments,
        route: 'MyAppointments',
        callBack: () => {},
      },
      {
        title: labels.profile,
        route: 'MyProfile',
        callBack: () => {},
      },
      {
        title: labels.chat,
        route: 'ChatHistory',
        callBack: () => {},
      },
      {
        title: labels.helpCenter,
        route: 'HelpContact',
        callBack: () => {},
      },
      {
        title: labels.language,
        route: 'PreferedLanguage',
        callBack: () => {},
      },
      {
        title: labels.terms,
        route: 'TermsAndCondition',
        callBack: () => {},
        status: true,
        subscription: true,
      },
      {
        title: labels.Privacy,
        route: 'PrivacyPolicy',
        callBack: () => {},
        status: true,
        subscription: true,
      },

      {
        title: labels.settings,
        route: 'Settings',
        callBack: () => {},
      },
    ];
  } else {
    sideMenuOptionsPatient = [
      {
        title: labels.helpCenter,
        route: 'HelpContact',
        callBack: () => {},
      },
      {
        title: labels.language,
        route: 'PreferedLanguage',
        callBack: () => {},
      },
    ];
  }
  if (role === 'provider') {
    sideMenuOptionsDoctor = [
      {
        title: labels.homes,
        route: 'DrDashboard',
        callBack: () => {},
        status: true,
        subscription: true,
      },
      {
        title: labels.consul,
        route: 'DrConsulation',
        callBack: () => {},
        status: profile?.status,
        subscription: subscriptions === null ? false : true,
      },
      {
        title: labels.calendarView,
        route: 'DrCalendarView',
        callBack: () => {},
        status: profile?.status,
        subscription: subscriptions === null ? false : true,
      },
      {
        title: labels.patients,
        route: 'DrAllPatients',
        callBack: () => {},
        status: profile?.status,
        subscription: subscriptions === null ? false : true,
      },
      {
        title: labels.myEarning,
        route: 'DrMyEarnings',
        callBack: () => {},
        status: profile?.status,
        subscription: subscriptions === null ? false : true,
      },
      {
        title: labels.stats,
        route: 'DrStats',
        callBack: () => {},
        status: profile?.status,
        subscription: subscriptions === null ? false : true,
      },
      {
        title: labels.chat,
        route: 'DrChatHistory',
        callBack: () => {},
        status: profile?.status,
        subscription: subscriptions === null ? false : true,
      },
      {
        title: labels.payment,
        route: 'DrPayment',
        callBack: () => {},
        status: true,
        subscription: true,
      },
      {
        title: labels.payout,
        route: 'DrPayout',
        callBack: () => {},
        status: profile?.status,
        subscription: true,
      },
      {
        title: labels.subscription,
        route: 'DrSubcriptionPlan',
        callBack: () => {},
        status: true,
        subscription: true,
      },

      {
        title: labels.language,
        route: 'PreferedLanguage',
        callBack: () => {},
        status: true,
        subscription: true,
      },
      {
        title: labels.profile,
        route: 'DrMyProfile',
        callBack: () => {},
        status: true,
        subscription: true,
      },
      {
        title: labels.terms,
        route: 'TermsAndCondition',
        callBack: () => {},
        status: true,
        subscription: true,
      },
      {
        title: labels.Privacy,
        route: 'PrivacyPolicy',
        callBack: () => {},
        status: true,
        subscription: true,
      },
      {
        title: labels.settings,
        route: 'Settings',
        callBack: () => {},
        status: true,
        subscription: true,
      },
      {
        title: labels.helpCenter1,
        route: 'DrHelpContact',
        callBack: () => {},
        status: true,
        subscription: true,
      },
    ];
  } else if (role === 'establishment' && estDoc != null) {
    sideMenuOptionsDoctor = [
      {
        title: labels.homes,
        route: 'DrDashboard',
        callBack: () => {},
        status: true,
        subscription: true,
      },
      {
        title: labels.consul,
        route: 'DrConsulation',
        callBack: () => {},
        status: profile?.status,
        subscription: subscriptions === null ? false : true,
      },
      {
        title: labels.calendarView,
        route: 'DrCalendarView',
        callBack: () => {},
        status: profile?.status,
        subscription: subscriptions === null ? false : true,
      },
      {
        title: labels.patients,
        route: 'DrAllPatients',
        callBack: () => {},
        status: profile?.status,
        subscription: subscriptions === null ? false : true,
      },
    ];
  } else if (role === 'establishment') {
    sideMenuOptionsDoctor = [
      {
        title: labels.homes,
        route: 'DrAllDoctors',
        callBack: () => {},
        status: true,
        subscription: true,
      },
      {
        title: labels.addDoctor,
        route: 'DrAddDoctor',
        callBack: () => {},
        status: profile?.status,
        subscription: subscriptions === null ? false : true,
      },
      {
        title: labels.payment,
        route: 'DrPayment',
        callBack: () => {},
        status: true,
        subscription: true,
      },
      {
        title: labels.payout,
        route: 'DrPayout',
        callBack: () => {},
        status: profile?.status,
        subscription: true,
      },
      {
        title: labels.subscription,
        route: 'DrSubcriptionPlan',
        callBack: () => {},
        status: true,
        subscription: true,
      },

      {
        title: labels.language,
        route: 'PreferedLanguage',
        callBack: () => {},
        status: true,
        subscription: true,
      },
      {
        title: labels.profile,
        route: 'DrMyProfile',
        callBack: () => {},
        status: true,
        subscription: true,
      },
      {
        title: labels.settings,
        route: 'Settings',
        callBack: () => {},
        status: true,
        subscription: true,
      },
      {
        title: labels.terms,
        route: 'TermsAndCondition',
        callBack: () => {},
        status: true,
        subscription: true,
      },
      {
        title: labels.Privacy,
        route: 'PrivacyPolicy',
        callBack: () => {},
        status: true,
        subscription: true,
      },
      {
        title: labels.helpCenter1,
        route: 'DrHelpContact',
        callBack: () => {},
        status: true,
        subscription: true,
      },
    ];
  }

  return (
    <View style={[styles.flex(1)]}>
      <View>
        <LinearGradient
          colors={[colors.btngr1, colors.btngr2, colors.btngr3]}
          start={{x: 1, y: 0}}
          end={{x: 1, y: 1}}
          style={[
            styles.headerGradienCont,
            styles.borderShadow,
            styles.height(140),
          ]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={[styles.flexRow, styles.margin(20), styles.top(25)]}>
              <Image source={assets.whiteCross} />
            </View>
          </TouchableOpacity>
        </LinearGradient>
        <View style={[styles.sideAvatar]}>
          {estDoc != null ? (
            <Image
              source={
                estDoc?.provider?.avatar
                  ? {uri: estDoc?.provider?.avatar}
                  : assets.avatar
              }
              style={
                profile?.avatar
                  ? [styles.menuUserImage, styles.bw(1.5)]
                  : styles.menuUserImage
              }
            />
          ) : (
            <Image
              source={profile?.avatar ? {uri: profile.avatar} : assets.avatar}
              style={
                profile?.avatar
                  ? [styles.menuUserImage, styles.bw(1.5)]
                  : styles.menuUserImage
              }
            />
          )}
        </View>
        <View style={[styles.flexRow]}>
          <View style={[styles.menuCont]}>
            <Text style={[styles.menuUsername]}>
              {Object.values(profile).length > 0
                ? profile?.firstName
                  ? config.api.version === 'DOCTOR'
                    ? `Dr. ${profile?.firstName} ${profile?.lastName}`
                    : `${profile?.firstName} ${profile?.lastName}`
                  : estDoc != null
                  ? `Dr. ${estDoc?.provider?.fullName}`
                  : `${profile?.name}`
                : labels.guest}
            </Text>
          </View>
        </View>
      </View>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={[styles.margin(30), styles.mT(0)]}>
          {config.api.version === 'DOCTOR'
            ? sideMenuOptionsDoctor?.map((item, index) => {
                return (
                  <MenuItemComponent
                    key={index}
                    navigation={navigation}
                    data={item}
                    status={item.status}
                    subscription={item.subscription}
                  />
                );
              })
            : sideMenuOptionsPatient?.map((item, index) => {
                return (
                  <MenuItemComponent
                    key={index}
                    navigation={navigation}
                    data={item}
                    status={true}
                    subscription={true}
                  />
                );
              })}
          {estDoc != null ? (
            <ButtonGradient
              title={labels.back}
              type={false}
              gradient={true}
              onBtnPress={() => {
                setDoctor();
              }}
            />
          ) : (
            <ButtonGradient
              title={
                Object.values(profile).length > 0 ? labels.logout : labels.login
              }
              type={false}
              gradient={true}
              onBtnPress={() => {
                config.api.version === 'DOCTOR'
                  ? Object.values(profile).length > 0
                    ? logOut()
                    : clearLogin()
                  : Object.values(profile).length > 0
                  ? logOut()
                  : clearLogin();
              }}
            />
          )}
          <Text
            style={[styles.paragraph2, styles.textAlign, styles.fontSize(12)]}>
            {appversion}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};
export default SideMenu;
