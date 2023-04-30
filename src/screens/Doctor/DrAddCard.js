import React, {useEffect, useRef, useState} from 'react';
import {View, ScrollView, Alert, Image, Text} from 'react-native';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import {GreadientHeader, ButtonGradient} from '../../components';
import {CreditCardInput} from '../../components/stripeComponent/src';
import Stripe from 'react-native-stripe-api';
import config from '../../config';
import {addDrCard} from '../../store/actions';
import {useDispatch} from 'react-redux';
import Snackbar from 'react-native-snackbar';
import fonts from '../../assets/fonts';

//Stripe Key
const client = new Stripe(config.api.stripKey);

const DrAddCard = ({navigation}) => {
  // Declare state variables'
  const dispatch = useDispatch();
  const [cardDetail, setCardDetail] = useState({
    name: '',
    cardNumber: '',
    cvc: '',
    expiry: '',
  });
  // Declare input reference field
  //Fuctions
  const onsubmit = async () => {
    if (
      cardDetail.name === '' ||
      cardDetail.cardNumber === '' ||
      cardDetail.cvc === '' ||
      cardDetail.expiry === ''
    ) {
      Alert.alert('Tabibi', 'All fields are required!');
      return;
    } else {
      const Exp = cardDetail.expiry.split('/');
      const obj = {
        number: cardDetail.number,
        exp_month: Exp[0],
        exp_year: Exp[1],
        cvc: cardDetail.cvc,
        // cardNo, name, expiry, cvv
      };
      const token = await client.createToken(obj);
      if (token.error) {
        Snackbar.show({
          text: token.error.message,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: colors.themeColor,
          fontFamily: fonts.PoppinsMedium,
          textColor: colors.dim,
        });
      } else {
        onTokenRecieved(token);
      }
    }
  };
  const onTokenRecieved = async (token) => {
    const data = {
      token: token.id,
      cardHolderName: cardDetail.name,
      cardNumber: token.card.last4,
      expiry: cardDetail.expiry,
    };
    dispatch(addDrCard(data, navigation));
  };
  const onChange = (e) => {
    if (e.valid) {
      setCardDetail(e.values);
    }
  };
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <ScrollView bounces={false} contentContainerStyle={{flexGrow: 1}}>
          <GreadientHeader
            showLeftIcon={true}
            showRightIcon={false}
            showCenterText={labels.payment}
            showLeftText={labels.back}
            back={true}
            leftRoute={() => navigation.goBack()}
          />
          <Image source={assets.bottom_image} style={styles.bottomImg} />
          <View style={styles.height(40)} />
          <View style={styles.mH(20)}>
            <View style={[styles.mH(8), styles.mT(15)]}>
              <Image source={assets.creditCard} style={[styles.alignSelf]} />
              <Text
                style={[
                  styles.textSemiBold,
                  styles.fontSize(17),
                  styles.textAlign,
                  styles.mV(20),
                ]}>
                {labels.paymentTitle}
              </Text>
              <CreditCardInput
                onChange={(e) => onChange(e)}
                requiresName
                invalidColor={'red'}
              />
              <ButtonGradient
                title={labels.confirm}
                type={false}
                gradient={true}
                onBtnPress={() => onsubmit()}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default DrAddCard;
