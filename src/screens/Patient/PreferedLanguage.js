import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  ScrollView,
  I18nManager,
} from 'react-native';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import {ButtonGradient, GreadientHeader} from '../../components';

const PreferedLanguage = ({navigation}) => {
  // Declare state variables
  const [selectLanguage, setselectLanguage] = useState(
    I18nManager.isRTL ? labels.arabic : labels.english,
  );
  async function updateLanguage(language) {
    await AsyncStorage.removeItem('language');

    var isRTL = I18nManager.isRTL;
    if (language === labels.english) {
      await AsyncStorage.setItem('language', labels.english);
      await I18nManager.forceRTL(false);
      if (isRTL) {
        Toast.show(labels.languageMessage, Toast.LONG);
        RNRestart.Restart();
      } else {
        navigation.navigate('Login');
      }
    } else {
      await AsyncStorage.setItem('language', labels.arabic);
      await I18nManager.forceRTL(true);
      if (!isRTL) {
        Toast.show(labels.languageMessage, Toast.LONG);
        RNRestart.Restart();
      } else {
        navigation.navigate('Login');
      }
    }
  }
  return (
    <View style={[styles.container]}>
      <StatusBar backgroundColor={colors.themeColor} />
      <Image source={assets.login_bg1} style={[styles.position]} />
      <GreadientHeader
        showLeftIcon={true}
        showRightIcon={false}
        showCenterText={labels.language}
        showLeftText={labels.back}
        back={true}
        leftRoute={() => navigation.goBack()}
      />
      <View style={styles.height(60)} />
      <View style={[styles.flex(0.4), styles.alignSelf]}>
        <Image source={assets.login_logo1} />
      </View>
      <View style={[styles.flex(0.6), styles.mH(30)]}>
        <Text style={[styles.Heading1, styles.mB(30)]}>
          {labels.PreferredLanguage}
        </Text>
        <ButtonGradient
          title={labels.english}
          type={true}
          gradient={true}
          onBtnPress={() => updateLanguage(labels.english)}
        />
        <ButtonGradient
          title={labels.arabic}
          type={false}
          onBtnPress={() => updateLanguage(labels.arabic)}
        />
      </View>
    </View>
  );
};

export default PreferedLanguage;
