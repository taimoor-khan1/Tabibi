import React, {useState} from 'react';
import {I18nManager} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useSelector, useDispatch} from 'react-redux';
import SideMenu from '../components/SideMenu';
import {
  Splash,
  IntroSlides,
  PreferedLanguage,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  ChangePassword,
  Verifcation,
  Information,
  addlovedOnes,
  Search,
  Profile,
  Home,
  LovedOnes,
  CreditCard,
  AddCard,
  MyAppointments,
  Prescription,
  HistoryDetail,
  Settings,
  HelpContact,
  MyProfile,
  EditProfile,
  ChatHistory,
  Chat,
  Call,
  History,
  DrPreferedOrganization,
  DrRegister,
  DrLogin,
  DrForgotPassword,
  DrInformation,
  DrResetPassword,
  DrVerifcation,
  DrHome,
  DrStats,
  DrHelpContact,
  DrChatHistory,
  DrChat,
  DrMyProfile,
  DrPatientDetail,
  Availability,
  DrEditProfile,
  DrEstablishment,
  DrPreValidation,
  DrEsRegister,
  DrNotification,
  Notification,
  NotificationSetting,
  NotificationSwitch,
  DrCall,
  DrAddPrescription,
  DrAllPatients,
  DrConsulation,
  DrConsulationDetail,
  DrSchedules,
  DrSubcriptionPlan,
  DrMyEarnings,
  DrPrescriptionDetail,
  DrInvoice,
  DrDashboard,
  DrWalkinAppoinment,
  DrAddPatient,
  DrCalendarView,
  DrDayView,
  DrAddDoctor,
  DrAddLocation,
  EstLocation,
  PatientConsulationDetail,
  StripeConnect,
  Invoice,
  DrCreditCard,
  DrAddCard,
  RateAndReview,
  DrRateAndReview,
  DrReschedule,
  DrSlotsDetail,
  DrPrescription,
  DrEditSlot,
  DrAddPOC,
  DrAllDoctors,
  DrPayout,
} from '../screens';
import config from '.';
import {navigationRef} from './NavigationService';
import TermsAndCondition from '../screens/Patient/TermsAndCondition';
import PrivacyPolicy from '../screens/Patient/PrivacyPolicy';

const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const RootStack = createStackNavigator();

const LoginStack = () => {
  return (
    <AuthStack.Navigator
      initialRouteName="Splash"
      headerMode="none"
      screenOptions={{
        animationTypeForReplace: 'pop',
        animationEnabled: true,
        // headerBackTitleVisible: true,
        headerShown: false,
        gestureEnabled: false,
        gestureDirection: I18nManager.isRTL
          ? 'horizontal-inverted'
          : 'horizontal',
      }}>
      <AuthStack.Screen
        options={{headerShown: false}}
        name="Splash"
        component={Splash}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="IntroSlides"
        component={IntroSlides}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="DrPreferedOrganization"
        component={DrPreferedOrganization}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="Information"
        component={Information}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="Login"
        component={Login}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="DrLogin"
        component={DrLogin}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="Register"
        component={Register}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="DrRegister"
        component={DrRegister}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="ResetPassword"
        component={ResetPassword}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="DrResetPassword"
        component={DrResetPassword}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="ForgotPassword"
        component={ForgotPassword}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="DrForgotPassword"
        component={DrForgotPassword}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="Verifcation"
        component={Verifcation}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="DrVerifcation"
        component={DrVerifcation}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="DrInformation"
        component={DrInformation}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="DrEstablishment"
        component={DrEstablishment}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="DrPreValidation"
        component={DrPreValidation}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="DrEsRegister"
        component={DrEsRegister}
      />
    </AuthStack.Navigator>
  );
};

// Main Stack
const HomeStack = () => {
  const {user, role} = useSelector((state) => state.Auth);
  if (!role && config.api.version === 'DOCTOR') {
    return (
      <AppStack.Screen
        options={{headerShown: false}}
        name="Splash"
        component={Splash}
      />
    );
  }
  return (
    <AppStack.Navigator
      initialRouteName={
        config.api.version === 'DOCTOR'
          ? role === 'establishment'
            ? 'DrAllDoctors'
            : 'DrDashboard'
          : 'Home'
      }
      headerMode="none"
      screenOptions={{
        animationTypeForReplace: 'pop',
        animationEnabled: true,
        // headerBackTitleVisible: true,r
        headerShown: false,
        gestureEnabled: false,
        gestureDirection: I18nManager.isRTL
          ? 'horizontal-inverted'
          : 'horizontal',
      }}>
      <AppStack.Screen
        options={{headerShown: false}}
        name="Home"
        component={Home}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="DrAllDoctors"
        component={DrAllDoctors}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="StripeConnect"
        component={StripeConnect}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="Invoice"
        component={Invoice}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="DrDashboard"
        component={DrDashboard}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="DrWalkinAppoinment"
        component={DrWalkinAppoinment}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="DrReschedule"
        component={DrReschedule}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="DrAddPatient"
        component={DrAddPatient}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="DrHome"
        component={DrHome}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="DrStats"
        component={DrStats}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="Profile"
        component={Profile}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="TermsAndCondition"
        component={TermsAndCondition}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="PrivacyPolicy"
        component={PrivacyPolicy}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="Availability"
        component={Availability}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="Search"
        component={Search}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="LovedOne"
        component={LovedOnes}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="addlovedOnes"
        component={addlovedOnes}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="PatientConsulationDetail"
        component={PatientConsulationDetail}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="CreditCard"
        component={CreditCard}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="AddCard"
        component={AddCard}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="DrPayment"
        component={DrCreditCard}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="DrAddCard"
        component={DrAddCard}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="MyAppointments"
        component={MyAppointments}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="PreferedLanguage"
        component={PreferedLanguage}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="DrNotification"
        component={DrNotification}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="Notification"
        component={Notification}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="NotificationSetting"
        component={NotificationSetting}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="NotificationSwitch"
        component={NotificationSwitch}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="Prescription"
        component={Prescription}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="HistoryDetail"
        component={HistoryDetail}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="Settings"
        component={Settings}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="HelpContact"
        component={HelpContact}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="DrHelpContact"
        component={DrHelpContact}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="MyProfile"
        component={MyProfile}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="DrMyProfile"
        component={DrMyProfile}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="DrPatientDetail"
        component={DrPatientDetail}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="ChangePassword"
        component={ChangePassword}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="EditProfile"
        component={EditProfile}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="DrEditProfile"
        component={DrEditProfile}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="Chat"
        component={Chat}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="History"
        component={History}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="ChatHistory"
        component={ChatHistory}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="DrChat"
        component={DrChat}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="DrChatHistory"
        component={DrChatHistory}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="Call"
        component={Call}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="DrCall"
        component={DrCall}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="DrAddPrescription"
        component={DrAddPrescription}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="DrAllPatients"
        component={DrAllPatients}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name="DrConsulation"
        component={DrConsulation}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name={'DrConsulationDetail'}
        component={DrConsulationDetail}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name={'DrSchedules'}
        component={DrSchedules}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name={'DrSubcriptionPlan'}
        component={DrSubcriptionPlan}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name={'DrMyEarnings'}
        component={DrMyEarnings}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name={'DrPrescriptionDetail'}
        component={DrPrescriptionDetail}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name={'DrInvoice'}
        component={DrInvoice}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name={'DrRateAndReview'}
        component={DrRateAndReview}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name={'DrSlotsDetail'}
        component={DrSlotsDetail}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name={'DrCalendarView'}
        component={DrCalendarView}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name={'DrDayView'}
        component={DrDayView}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name={'DrAddDoctor'}
        component={DrAddDoctor}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name={'RateAndReview'}
        component={RateAndReview}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name={'DrAddLocation'}
        component={DrAddLocation}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name={'EstLocation'}
        component={EstLocation}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name={'DrPrescription'}
        component={DrPrescription}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name={'DrEditSlot'}
        component={DrEditSlot}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name={'DrAddPOC'}
        component={DrAddPOC}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name={'DrPayout'}
        component={DrPayout}
      />
    </AppStack.Navigator>
  );
};
// drawer stack
const DrawerStack = () => {
  return (
    <Drawer.Navigator
      drawerPosition={I18nManager.isRTL ? 'right' : 'left'}
      hideStatusBar={false}
      drawerStyle={{width: 290}}
      initialRouteName="HomeStack"
      screenOptions={{
        animationTypeForReplace: 'pop',
        animationEnabled: true,
        headerBackTitleVisible: false,
        headerShown: true,
        gestureEnabled: false,
        gestureDirection: I18nManager.isRTL
          ? 'horizontal-inverted'
          : 'horizontal',
      }}
      drawerContent={({navigation, state}) => (
        <SideMenu navigation={navigation} />
        // <View />
      )}>
      <Drawer.Screen
        options={{headerShown: false, gestureEnabled: true}}
        name="HomeStack"
        component={HomeStack}
      />
    </Drawer.Navigator>
  );
};

// Manifest of possible screens
const RootNavigator = ({role}) => {
  return (
    <RootStack.Navigator
      headerMode="none"
      screenOptions={{
        animationEnabled: true,
        animationTypeForReplace: 'pop',
        headerBackTitleVisible: false,
        headerShown: false,
        gestureEnabled: false,
        gestureDirection: I18nManager.isRTL
          ? 'horizontal-inverted'
          : 'horizontal',
      }}
      initialRouteName="LoginStack">
      <RootStack.Screen
        options={{headerShown: false}}
        name="LoginStack"
        component={LoginStack}
      />
      <RootStack.Screen
        name="DrawerStack"
        options={{headerShown: false}}
        component={DrawerStack}
      />
    </RootStack.Navigator>
  );
};

const AppNavigator = () => {
  // const {user, role} = useSelector((state) => state.Auth);
  const {user, profile, role} = useSelector((state) => state.Auth);

  return (
    <NavigationContainer ref={navigationRef}>
      <RootNavigator role={role} />
    </NavigationContainer>
  );
};

export {RootNavigator, AppNavigator};
