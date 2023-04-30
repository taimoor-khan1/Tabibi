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
import {ConfirmInvoice, getPatientDetailById} from '../../store/actions';
import moment from 'moment';

const DrInvoice = ({navigation, route}) => {
  // console.log(route?.params?.data)
  //Redux Store
  const dispatch = useDispatch();
  const {patientDetail} = useSelector((state) => state.Doctor);

  // Declare state variables'
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(route?.params?.data?.basicFee);
  const [extraTime, setExtraTime] = useState('');
  const [extraCost, setExtraCost] = useState('');
  const [freeCheck, setFreeCheck] = useState(false);
  const [freeCheckConfirm, setFreeCheckConfirm] = useState(false);
  const [InvoiceData, setInvoiceData] = useState([]);
  const [from] = useState(route?.params?.from);

  console.log(InvoiceData,"InvoiceData")
  // Declare input reference field
  const refExtraCost = useRef();
  const refExtraTime = useRef();
  const refPicker = useRef();
  const indexRef = useRef(index);
  indexRef.current = index;

  //Fuctions and API's

  //Action for Set Invoice
  useEffect(() => {
    const id = {
      id: route?.params?.data?.appointment?.patientId,
    };
    dispatch(getPatientDetailById(id, true));
    const appointment = route?.params?.data?.appointment;
    const invoice = route?.params?.data;
    const tax = (2 / route?.params?.data?.basicFee) * 100;
    const totalPrice = tax + invoice?.basicFee + invoice?.extraAmount;
    const time = invoice?.totalTime;
    // setExtraTime(invoice?.extraTime);
    setExtraCost(invoice?.extraAmount);
    setTotal(Number(totalPrice));
    const data = [
      {
        title1: 'Date',
        subText1: moment(appointment?.startTime).format('DD MMM'),
        title2: 'Time Taken',
        subText2: `${time}`,
      },
      {
        title1: 'Basic Fee',
        subText1: '$' + invoice?.basicFee,
        title2: 'Tax',
        subText2: '$' + tax.toFixed(3),
      },
      {
        title1: 'Extra Time',
        subText1: `${extraTime} mins`,
        title2: 'Amount',
        subText2: '$' + extraCost,
      },
    ];
    setInvoiceData(data);
  }, []);
 console.log( route?.params?.data?.tax,"dataCHECK")
  useEffect(() => {
    const appointment = route?.params?.data?.appointment;
    const invoice = route?.params?.data;
    // const tax = (2 * route?.params?.data?.basicFee) / 100;
    const tax = route?.params?.data?.tax
    const totalPrice =
      tax +
      invoice.basicFee +
      (!freeCheck ? parseInt(extraCost) : invoice.extraAmount);
    const time = invoice?.totalTime;
    setTotal(Number(totalPrice));
    let data = [];
    if (freeCheckConfirm) {
      data = [
        {
          title1: 'Date',
          subText1: moment(appointment?.startTime).format('DD MMM'),
          title2: 'Time Taken',
          subText2: `${time}`,
        },
        {
          title1: 'Basic Fee',
          subText1: '$' + invoice?.basicFee,
          title2: 'Tax',
          subText2: `$${tax.toFixed(3)}`,
        },
      ];
    } else {
      data = [
        {
          title1: 'Date',
          subText1: moment(appointment?.startTime).format('DD MMM'),
          title2: 'Time Taken',
          subText2: `${time}`,
        },
        {
          title1: 'Basic Fee',
          subText1: '$' + invoice?.basicFee,
          title2: 'Tax',
          subText2: `$${tax.toFixed(3)}`,
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
  }, [freeCheckConfirm, extraCost, extraTime]);

  //Action for On Sumbit Incvoice
  const onSubmit = () => {
    const data = {
      extraAmount: parseInt(extraCost).toFixed(2),
      extraTime: extraTime,
      invoiceId: route?.params?.data.id,
      appointmentId: route?.params?.data?.appointment.id,
    };
    dispatch(ConfirmInvoice(data, navigation));
  };

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
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <View style={styles.height(30)} />
          <View style={styles.mH(20)}>
            <View style={[styles.ConsuDetailItmCont, styles.borderShadow]}>
              <View style={[styles.rowCont]}>
                <View style={(styles.flex(1), styles.alignItemsFlexStart)}>
                  <Image
                    source={
                      patientDetail?.avatar
                        ? {uri: patientDetail?.avatar}
                        : assets.avatar
                    }
                    style={[styles.ConsuDetailImg]}
                    borderRadius={50}
                  />
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
                    <View
                      style={[
                        styles.spacer,
                        styles.mV(15),
                        styles.width_Percent('100%'),
                      ]}
                    />
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

              <View style={[styles.flex(0)]}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styles.flex(1)]}
                  onPress={() => refPicker.current.open()}>
                  <View style={[styles.flexRow]}>
                    <View style={[styles.leftFeild, styles.flex(0.8)]}>
                      <Text
                        style={[
                          styles.dropDownText,
                          styles.consulDetailTitle,
                          styles.color(colors.heading),
                        ]}>
                        {labels.addExtraTime}
                      </Text>
                    </View>
                    <View style={[styles.rightArrowDown, styles.mR(0)]}>
                      <Image source={assets.plus} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.margin(20)}>
              <ButtonGradient
                title={labels.confirm}
                type={false}
                gradient={true}
                onBtnPress={() => onSubmit()}
              />
            </View>
            {from && (
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
                    {
                      route?.params?.data?.appointment?.payment?.cardInfo
                        ?.last4Digits
                    }
                  </Text>
                </View>
              </View>
            )}
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
                  placeholder={'extra min'}
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

export default DrInvoice;
