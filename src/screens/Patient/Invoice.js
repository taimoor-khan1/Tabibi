import React, {useEffect, useRef, useState} from 'react';
import {View, Image, Text, ScrollView, TouchableOpacity} from 'react-native';
import {CheckBox, Input} from 'react-native-elements';
import Modal from 'react-native-modalbox';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import {GreadientHeader, ButtonGradient, InvoiceItem} from '../../components';
import {useDispatch, useSelector} from 'react-redux';
import {ConfirmInvoice, getInvoiceById} from '../../store/actions';
import moment from 'moment';

const Invoice = ({navigation, route}) => {
  //Redux Store
  const dispatch = useDispatch();
  const {patientDetail} = useSelector((state) => state.Doctor);
  const {getInvoice} = useSelector((state) => state.Patient);

  // Declare state variables'
  const [total, setTotal] = useState(0);
  const [extraTime, setExtraTime] = useState('');
  const [extraCost, setExtraCost] = useState(0);
  const [freeCheck, setFreeCheck] = useState(false);
  const [freeCheckConfirm, setFreeCheckConfirm] = useState(false);
  const [InvoiceData, setInvoiceData] = useState([]);

  // Declare input reference field
  const indexRef = useRef(index);
  indexRef.current = index;
  const refExtraCost = useRef();
  const refExtraTime = useRef();
  const refPicker = useRef();

  // Functions

  useEffect(() => {
    dispatch(getInvoiceById({id: '7e6015c3-1998-4c57-a75f-ad193adbe3cd'}));
  }, []);

  //Set Invoice Scheet
  useEffect(() => {
    const tax = (2 / getInvoice.basicFee) * 100;
    const totalPrice =
      tax +
      getInvoice.basicFee +
      (!freeCheck ? parseInt(extraCost) : getInvoice.extraAmount);
    const time =
      moment.duration(getInvoice?.appointment?.endTime) -
      moment.duration(getInvoice?.appointment?.startTime);
    const seconds = moment.duration(time).seconds();
    const minutes = moment.duration(time).minutes();
    setTotal(totalPrice);
    let data = [];
    if (freeCheckConfirm) {
      data = [
        {
          title1: 'Date',
          subText1: moment(getInvoice?.appointment?.startTime).format('DD MMM'),
          title2: 'Time Taken',
          subText2: `${minutes < 10 ? '0' + minutes : minutes}:${
            seconds < 10 ? '0' + seconds : seconds
          }`,
        },
        {
          title1: 'Basic Fee',
          subText1: '$' + getInvoice?.basicFee,
          title2: 'Tax',
          subText2: '$' + tax.toFixed(3),
        },
      ];
    } else {
      data = [
        {
          title1: 'Date',
          subText1: moment(getInvoice?.appointment?.startTime).format('DD MMM'),
          title2: 'Time Taken',
          subText2: `${minutes < 10 ? '0' + minutes : minutes}:${
            seconds < 10 ? '0' + seconds : seconds
          }`,
        },
        {
          title1: 'Basic Fee',
          subText1: '$' + getInvoice?.basicFee,
          title2: 'Tax',
          subText2: '$' + tax.toFixed(3),
        },
        {
          title1: 'Extra Time',
          subText1: `${extraTime} mins`,
          title2: 'Amount',
          subText2: '$' + parseInt(extraCost).toFixed(3),
        },
      ];
    }
    setInvoiceData(data);
  }, [getInvoice]);

  //On Submit Btn
  const onSubmit = () => {
    const data = {
      extraAmount: parseInt(extraCost),
      extraTime: extraTime,
      invoiceId: route?.params?.data.id,
      appointmentId: route?.params?.data?.appointment.id,
    };
    dispatch(ConfirmInvoice(data, navigation));
  };

  //On Save Extra Function
  const saveExtrasFunc = () => {
    setFreeCheckConfirm(freeCheck);
    refPicker.current.close();
  };
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.white)]}>
        <GreadientHeader
          showLeftIcon={true}
          showCenterText={labels.Invoice}
          showLeftText={labels.back}
          back={true}
          leftRoute={() =>
            navigation.reset({
              index: 0,
              routes: [{name: 'DrawerStack'}],
            })
          }
        />
        {/* <Image source={assets.bottom_image} style={styles.bottomImg} /> */}
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <View style={styles.height(30)} />
          <View style={styles.mH(20)}>
            <View style={[styles.ConsuDetailItmCont, styles.borderShadow]}>
              <View style={[styles.rowCont]}>
                <View style={(styles.flex(1), styles.alignItemsFlexStart)}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={
                      () => {}
                      //   navigation.navigate('DrPatientDetail', { id: '' })
                    }>
                    <Image
                      source={
                        patientDetail?.avatar
                          ? {uri: patientDetail?.avatar}
                          : assets.avatar
                      }
                      style={[styles.ConsuDetailImg]}
                      borderRadius={50}
                    />
                  </TouchableOpacity>
                </View>
                <View style={[styles.flex(1)]}>
                  <Text
                    style={[styles.consulDetailTitle]}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {`${patientDetail?.firstName} ${patientDetail?.lastName}`}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.earningsCont}>
              {InvoiceData.map((item, index) => {
                return (
                  <>
                    <InvoiceItem
                      title1={item.title1}
                      subText1={item.subText1}
                      title2={item.title2}
                      subText2={item.subText2}
                    />
                    {/* {InvoiceData.length - 1 == index ? null : ( */}
                    <View
                      style={[
                        styles.spacer,
                        styles.mV(15),
                        styles.width_Percent('100%'),
                      ]}
                    />
                    {/* )} */}
                  </>
                );
              })}

              <View
                style={[styles.flexRow, styles.justifyCntSP, styles.mB(10)]}>
                <Text
                  style={[styles.consulDetailTitle, styles.fontSize(18)]}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {labels.totalAmmount}
                </Text>
                <Text style={[styles.consulDetailVideo, styles.fontSize(18)]}>
                  {'$' + total.toFixed(3)}
                </Text>
              </View>
              <View
                style={[
                  styles.spacer,
                  styles.mV(15),
                  styles.width_Percent('100%'),
                ]}
              />
            </View>
            <View style={styles.margin(20)}>
              <ButtonGradient
                title={labels.confirm}
                type={false}
                gradient={true}
                onBtnPress={() => onSubmit()}
              />
            </View>
            <View style={styles.alignSelf}>
              <Text
                style={[
                  styles.consulDetailTitle,
                  styles.textAlign,
                  styles.fontSize(16),
                ]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {labels.paymentVia}
              </Text>
              <View style={styles.flexRow}>
                <Image source={assets.masterCard} style={styles.mR(10)} />
                <Text style={[styles.consulDetailVideo, styles.fontSize(14)]}>
                  xxxx xxxx xxxx{' '}
                  {getInvoice?.appointment?.payment?.cardInfo?.last4Digits}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.height(30)} />
        </ScrollView>
        <Modal
          style={[styles.extraTimeModal]}
          position={'center'}
          ref={refPicker}
          backdropPressToClose={true}
          backdropOpacity={0.25}
          keyboardTopOffset={50}
          backButtonClose={true}
          swipeToClose={false}
          backdropColor={colors.black}>
          <View style={[styles.mH(10), styles.mV(10)]}>
            <Text
              style={[styles.consulDetailTitle, styles.color(colors.heading)]}>
              {labels.addExtraTime}
            </Text>
            <TouchableOpacity
              style={[styles.extraTimeModalClose]}
              onPress={() => refPicker.current.close()}>
              <Image source={assets.close} />
            </TouchableOpacity>
            <View style={[styles.flexRow, styles.justifyCntSP, styles.mT(20)]}>
              <View>
                <Input
                  ref={refExtraTime}
                  inputContainerStyle={[
                    styles.extraTimeFeild,
                    styles.borderShadow,
                  ]}
                  containerStyle={styles.pH(0)}
                  placeholder={labels.extraTime}
                  placeholderTextColor={colors.text}
                  underlineColorAndroid="transparent"
                  autoCorrect={false}
                  disabled={freeCheck}
                  secureTextEntry={false}
                  inputStyle={styles.inputStyle}
                  selectionColor={colors.green}
                  keyboardType="numeric"
                  importantForAutofill="no"
                  selectTextOnFocus={false}
                  returnKeyType="done"
                  autoCapitalize="none"
                  onChangeText={(text) => setExtraTime(text)}
                  value={extraTime}
                />
              </View>
              <View>
                <Input
                  ref={refExtraCost}
                  inputContainerStyle={[
                    styles.extraTimeFeild,
                    styles.borderShadow,
                  ]}
                  containerStyle={styles.pH(0)}
                  placeholder={labels.extraAmount}
                  placeholderTextColor={colors.text}
                  underlineColorAndroid="transparent"
                  autoCorrect={false}
                  secureTextEntry={false}
                  inputStyle={[styles.inputStyle]}
                  selectionColor={colors.green}
                  keyboardType="numeric"
                  disabled={freeCheck}
                  importantForAutofill="no"
                  selectTextOnFocus={false}
                  returnKeyType="done"
                  autoCapitalize="none"
                  onChangeText={(text) => setExtraCost(text)}
                  value={extraCost}
                />
              </View>
            </View>
            <CheckBox
              title="Free"
              containerStyle={{backgroundColor: 'transparent', borderWidth: 0}}
              checked={freeCheck}
              onPress={() => setFreeCheck(!freeCheck)}
            />
            <ButtonGradient
              title={labels.save}
              type={false}
              gradient={true}
              onBtnPress={() => saveExtrasFunc()}
            />
          </View>
        </Modal>
      </View>
    </>
  );
};

export default Invoice;
