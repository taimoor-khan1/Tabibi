import React, {useEffect, useState} from 'react';
import {View, Text, Image, StatusBar, I18nManager} from 'react-native';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import {ButtonGradient, HeaderBack} from '../../components';

const DrPreferedOrganization = ({navigation}) => {
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
      <Image source={assets.login_bg} style={[styles.position]} />
      <HeaderBack showLeftIcon={false} back={false} />
      <View style={styles.height(60)} />
      <View style={[styles.flex(0.35), styles.alignSelf]}>
        <Image source={assets.login_logo} />
      </View>
      <View style={[styles.flex(0.7), styles.mH(30)]}>
        <Text style={[styles.Heading, styles.mB(30)]}>
          {labels.IndividualSelection}
        </Text>
        <ButtonGradient
          title={labels.individual}
          type={true}
          gradient={true}
          image={assets.indi}
          onBtnPress={() =>
            navigation.navigate('DrRegister', {
              from: 'doctor',
              data: {},
            })
          }
        />
        <Text style={[styles.or, styles.mV(10)]}>{labels.or}</Text>
        <ButtonGradient
          title={labels.establishment}
          type={false}
          gradient={true}
          image={assets.hospital}
          onBtnPress={() =>
            navigation.navigate('DrRegister', {
              from: 'drEstablishment',
              data: {
                isEstablishment: true,
                establishmentTitle: '',
                country: '',
                city: '',
                address: '',
              },
            })
          }
        />
      </View>
      <Text
        style={[
          styles.lable,
          styles.mT(25),
          styles.mB(10),
          styles.color(colors.darkBlue),
        ]}>
        {labels.already}
        <Text
          onPress={() => navigation.navigate('DrLogin')}
          style={[styles.let]}>
          {labels.letsLogin}
        </Text>
      </Text>
      <View style={styles.mB(20)} />
    </View>
  );
};

export default DrPreferedOrganization;
