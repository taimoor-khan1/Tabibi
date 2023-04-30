import React, { useEffect, useState } from 'react';
import { View, Image, Text, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../../assets/styles';
import { assets } from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import { GreadientHeader, ButtonGradient, Chips } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAnAppointmentById,
  createVideoCall,
  completeWalkinAppointment,
  callEnd,
} from '../../store/actions';
import Snackbar from 'react-native-snackbar';
import moment from 'moment';
import fonts from '../../assets/fonts';

const DrConsulationDetail = ({ navigation, route }) => {
  // console.log(route?.params?.data?.patient)
  //Redux Store
  const dispatch = useDispatch();
  const { estDoc, role } = useSelector((state) => state.Auth);
  const { appointmentDetail } = useSelector((state) => state.Patient);

  // Declare state variables'
  const [Walk] = useState(route?.params?.walkIn);
  const [patientDetail] = useState(route?.params?.data?.patient);
  const [appointmentId] = useState(route?.params?.data?.id);
  const [posId] = useState(route?.params?.data?.posId);
  const [slotId] = useState(route?.params?.data?.slotId);
  const [status] = useState(route?.params?.status);

  //Appointment API CALLING
  useEffect(() => {
    dispatch(getAnAppointmentById(appointmentId, posId, slotId, false));
  }, []);

  //Fuctions

  //Start Video session
  const onStartVidoeCall = () => {
    dispatch(createVideoCall(appointmentId, navigation, true, patientDetail));
  };

  const completeAppointment = () => {
    dispatch(completeWalkinAppointment(appointmentId, navigation, true)).then(
      (res) => {
        if (res.status === 200) {
          if (
            appointmentDetail?.schedule?.consultationType?.title !==
            'Video Call'
          ) {
            navigation.navigate('DrDashboard');
          } else {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'DrInvoice',
                  params: {
                    data: res?.data,
                    invoiceId: res?.data?.id,
                    from: false,
                  },
                },
              ],
            });
          }
        }
      },
    );
  };

  const EndVidoConsultation = () => {
    dispatch(callEnd(videoConsultationId, time, navigation)).then((res) => {
      if (res.status === 200) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'DrInvoice',
              params: {
                data: res?.data,
                invoiceId: res?.data?.id,
                from: true,
              },
            },
          ],
        });
      } else {
        Snackbar.show({
          text: res?.msg,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: colors.darkTheme,
          fontFamily: fonts.PoppinsMedium,
          textColor: colors.dim,
          numberOfLines: 1,
          action: {
            text: 'back Home',
            textColor: colors.dim,
            onPress: () => {
              Snackbar.dismiss();
              navigation.reset({
                index: 0,
                routes: [{ name: 'DrawerStack' }],
              });
            },
          },
        });
      }
    });
  };

  const showMsg = () => {
    Snackbar.show({
      text: labels.unavailable,
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: colors.darkTheme,
      fontFamily: fonts.PoppinsMedium,
      textColor: colors.dim,
      numberOfLines: 2,
    });
  };
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.white)]}>
        <GreadientHeader
          showLeftIcon={true}
          showCenterText={labels.detalis}
          showLeftText={labels.back}
          back={true}
          leftRoute={() => navigation.goBack()}
        />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <View style={styles.height(20)} />
          <View style={styles.mH(20)}>
            <View
              style={[
                styles.mT(20),
                styles.ConsuDetailItmCont,
                styles.borderShadow,
              ]}>
              <View style={[styles.rowCont]}>
                <View style={(styles.flex(1), styles.alignItemsFlexStart)}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      role === 'provider'
                        ? navigation.navigate('DrPatientDetail', {
                          id: patientDetail?.id,
                          from: false,
                        })
                        : navigation.navigate('DrPatientDetail', {
                          id: patientDetail?.id,
                          from: false,
                        })
                    }>
                    <Image
                      source={
                        patientDetail?.avatar
                          ? { uri: patientDetail?.avatar }
                          : assets.avatar
                      }
                      style={[styles.ConsuDetailImg]}
                      borderRadius={50}
                    />
                  </TouchableOpacity>
                </View>
                <View style={[styles.flex(1)]}>
                  <Text
                    style={[styles.consulDetailTitle, styles.mL(5)]}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {patientDetail?.firstName}
                  </Text>
                  <View
                    style={[
                      styles.flexRow,
                      styles.alignItemsFlexStart,
                      styles.mT(2),
                    ]}>
                    <Image source={assets.timeIcon} style={styles.mT(-5)} />
                    <Text style={[styles.consulDetailVideo]}>
                      {appointmentDetail?.completed_app
                        ? `${appointmentDetail?.completed_app} times Visits`
                        : `0 times Visits`}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.height(20)} />
            <View
              style={[
                styles.margin(20),
                styles.ConsuDetailItmCont1,
                styles.borderShadow,
              ]}>
              <View style={[styles.flexRow, styles.justifyCntSP]}>
                <View style={[styles.alignItemsFlexStart]}>
                  <Text style={[styles.consulTitle, styles.fontSize(14)]}>
                    {`${appointmentDetail?.schedule?.consultationType?.title} ${labels.consulations}`}
                  </Text>
                </View>
                <View style={[styles.alignItemsFlexend]}>
                  <Text style={[styles.consulDetailVideo]}>
                    {appointmentDetail?.consultationDate &&
                      moment(appointmentDetail?.consultationDate).format(
                        'DD MMM YYYY',
                      )}
                  </Text>
                </View>
              </View>
              <View>
                <View
                  style={[
                    styles.flexRow,
                    styles.alignItemsFlexStart,
                    styles.mT(5),
                  ]}>
                  <Image source={assets.watch} style={styles.watch} />
                  <Text style={[styles.consulVideo, styles.mT(3)]}>
                    {appointmentDetail?.startTime &&
                      `${moment(appointmentDetail?.startTime, [
                        'hh:mm A',
                      ]).format('hh:mm A')}`}
                    {appointmentDetail?.endTime &&
                      ` to ${moment(appointmentDetail?.endTime, [
                        'hh:mm A',
                      ]).format('hh:mm A')}`}
                  </Text>
                </View>
                <View style={[styles.flexRow, styles.alignItemsFlexStart]}>
                  <Image source={assets.blueBellM} style={styles.mR(5)} />
                  <Text
                    style={[
                      styles.consulVideo,
                      styles.mT(2),
                      styles.color(colors.subText),
                    ]}>
                    {appointmentDetail.duration} minutes duration
                  </Text>
                </View>
                <View style={styles.seprator} />
                <Text
                  style={[
                    styles.consulTitle,
                    styles.fontSize(14),
                    styles.mB(5),
                  ]}>
                  {labels.previousBooking}
                </Text>
                <View style={styles.flexRow}>
                  <View style={[styles.leftCont]}>
                    <View style={styles.flexRow}>
                      <View style={styles.red} />
                      <Text style={styles.bookingCancel}>
                        {appointmentDetail?.cancel_app}
                        {'\n'}
                        <Text style={[styles.fontSize(12)]}>
                          {labels.canceled}
                        </Text>
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.flex(0.5), styles.alignItemCenter]}>
                    <View style={styles.flexRow}>
                      <View style={styles.green} />
                      <Text style={styles.bookingCancel}>
                        {appointmentDetail.completed_app}
                        {'\n'}
                        <Text style={[styles.fontSize(12)]}>
                          {labels.completed}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.seprator} />
                <Text
                  style={[
                    styles.consulTitle,
                    styles.fontSize(14),
                    styles.mB(5),
                  ]}>
                  {labels.purpose}
                </Text>
                <View style={[styles.chipss]}>
                  <Chips
                    key={1}
                    value={appointmentDetail?.schedule?.purposes?.poc?.title}
                    chipStyle={[
                      styles.chipStyle,
                      {
                        backgroundColor:
                          appointmentDetail?.schedule?.purposes?.color,
                      },
                    ]}
                    chipTextStyle={styles.chipTextStyle}
                    onPress={() => { }}
                    close={false}
                  />
                </View>
              </View>
            </View>
          </View>
          {role === 'provider' && (
            <View style={[styles.mH(25)]}>
              {Walk && status == 'booked' ? (
                <ButtonGradient
                  gradient={true}
                  // type={true}
                  titleColor={colors.heading}
                  title={labels.current}
                  onBtnPress={() => completeAppointment()}
                />
              ) : null}
              {Walk === false && status == 'booked' ? (
                <>
                  <ButtonGradient
                    gradient={true}
                    image={assets.videoCallWhite}
                    title={labels.startVideo}
                    onBtnPress={() =>
                      patientDetail?.voipToken == null
                        ? showMsg()
                        : onStartVidoeCall()
                    }
                  />
                  <ButtonGradient
                    gradient={true}
                    title={labels.current}
                    onBtnPress={() => completeAppointment()}
                  />
                </>
              ) : null}
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default DrConsulationDetail;
