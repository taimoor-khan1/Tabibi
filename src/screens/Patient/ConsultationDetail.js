import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import ReactNativeModal from 'react-native-modal';
import styles from '../../assets/styles';
import { assets } from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import fonts from '../../assets/fonts';
import {
  GreadientHeader,
  ButtonGradient,
  Chips,
  ButtonSmall,
  ButtonWhite,
  ChatItem,
} from '../../components';
import Snackbar from 'react-native-snackbar';
import { Input } from 'react-native-elements';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAnAppointmentById,
  cancelAppointment,
  complains,
} from '../../store/actions';

const PatientConsulationDetail = ({ navigation, route }) => {
  // console.log(route?.params?.data)

  //Redux Store
  const dispatch = useDispatch();
  const { appointmentDetail } = useSelector((state) => state.Patient);

  console.log(appointmentDetail?.id, 'appointmentDetails');

  // Declare state variables'
  const [providerDetail, setProviderDetail] = useState(
    route?.params?.data?.provider,
  );
  const [status] = useState(route?.params?.status);
  const [allData] = useState(route?.params?.data);
  console.log(allData, 'item');
  const [subject, setSubject] = useState('');
  const [complain, setComplain] = useState('');
  const [modalState, setModalState] = useState(false);
  const [cancelPopUp, setCancelPopUp] = useState(false);
  const [cancelId, setCancelId] = useState('');

  // const [relation] = useState(route?.params?.data?.relation);

  //Functions and API

  //Get Appointment Detail API
  useEffect(() => {
    dispatch(
      getAnAppointmentById(
        route?.params?.data?.id, //appointement Id
        route?.params?.data?.posId, //pos id
        route?.params?.data?.slotId, //slot id
        true,
      ),
    );
  }, []);

  // For Cancel Appointment
  const cancelAppoint = () => {
    const id = route?.params?.data?.id;
    dispatch(cancelAppointment({ id, from: 'patient' }, navigation, true));
  };
  // For Complain
  const onComplain = () => {
    const validation = `${!subject.trim()
        ? labels.validSubject
        : !complain.trim()
          ? labels.validNote
          : true
      }`;
    if (validation === 'true') {
      const payload = {
        subject: subject,
        complain: complain,
        appointmentId: route?.params?.data?.id,
        providerId: route?.params?.data?.providerId,
      };
      console.log(payload);
      dispatch(complains(payload, navigation)).then((res) => {
        if (res === 200) {
          setModalState(false);
        }
      });
    } else {
      Snackbar.show({
        text: validation,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
      });
    }
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
                      navigation.navigate('Profile', {
                        id: route?.params?.data?.providerId,
                      })
                    }>
                    <Image
                      source={
                        providerDetail?.avatar
                          ? { uri: providerDetail?.avatar }
                          : assets.dummy
                      }
                      style={[styles.ConsuDetailImg]}
                      borderRadius={50}
                    />
                  </TouchableOpacity>
                </View>
                <View style={[styles.flex(1)]}>
                  <View style={styles.flexRow}>
                    <Text
                      style={[styles.consulDetailTitle, styles.mL(5)]}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {`Dr. ${providerDetail?.firstName} ${providerDetail?.lastName}`}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.flexRow,
                      styles.alignItemsFlexStart,
                      styles.mT(2),
                    ]}>
                    <Text style={[styles.consulDetailVideo, styles.mL(5)]}>
                      {providerDetail?.detail?.specialities}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.flexRow,
                      styles.alignItemsFlexStart,
                      styles.mT(2),
                    ]}>
                    <Image source={assets.timeIcon} style={styles.mT(-5)} />
                    <Text style={[styles.consulDetailVideo]}>
                      {`${appointmentDetail?.completed_app} times Visits`}
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
                        {appointmentDetail.cancel_app}
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
          {status == 'booked' ? (
            <View style={[styles.mH(25)]}>
              <ButtonGradient
                gradient={true}
                type={false}
                titleColor={colors.heading}
                title={labels.cancelAppointment}
                onBtnPress={() => {
                  setCancelPopUp(true);
                }}
              />
            </View>
          ) : status == 'completed' || status == 'canceled' ? (
            <View style={[styles.mH(25)]}>
              <ButtonGradient
                gradient={true}
                type={false}
                titleColor={colors.heading}
                title={labels.complain}
                onBtnPress={() => setModalState(true)}
              />
            </View>
          ) : null}
          {status == 'completed' && allData.review == null && (
            <View style={[styles.mH(25)]}>
              <ButtonGradient
                gradient={true}
                type={false}
                titleColor={colors.heading}
                title={labels.rateAndReview}
                onBtnPress={() =>
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'RateAndReview',
                        params: {
                          consultationId: allData.id,
                          drId: allData.provider?.id,
                        },
                      },
                    ],
                  })
                }
              />
            </View>
          )}
          {status == 'canceled' && allData.review == null && (
            <View style={[styles.mH(25)]}>
              <ButtonGradient
                gradient={true}
                type={false}
                titleColor={colors.heading}
                title={labels.rateAndReview}
                onBtnPress={() =>
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'RateAndReview',
                        params: {
                          consultationId: allData?.id,
                          drId: allData.provider?.id,
                        },
                      },
                    ],
                  })
                }
              />
            </View>
          )}
        </ScrollView>
      </View>
      <Modal
        animationType="fade"
        visible={modalState}
        transparent={true}
        onRequestClose={() => {
          setModalState(false);
        }}>
        <View style={styles.centeredView}>
          <View style={[styles.notificationView, styles.shadowbb]}>
            <TouchableOpacity
              hitSlop={styles.hitSlop}
              style={styles.imageCross}
              onPress={() => setModalState(false)}>
              <Image source={assets.cross} />
            </TouchableOpacity>
            <View style={[styles.mT(10)]}>
              <Text
                style={[
                  styles.h2,
                  styles.textAlign,
                  { textTransform: 'capitalize' },
                ]}>
                {labels.complain}
              </Text>

              <Input
                inputContainerStyle={[
                  styles.inputContainer,
                  styles.borderShadow,
                ]}
                containerStyle={[
                  styles.pH(15),
                  styles.height(45),
                  styles.mT(10),
                ]}
                placeholder={labels.title}
                placeholderTextColor={colors.text}
                autoCapitalize="none"
                clearTextOnFocus={false}
                underlineColorAndroid="transparent"
                multiline={false}
                numberOfLines={1}
                returnKeyType={'done'}
                onChangeText={(text) => setSubject(text)}
                value={subject}
              />
              <TextInput
                placeholder={labels.Description}
                placeholderTextColor={colors.text}
                autoCapitalize="none"
                clearTextOnFocus={false}
                underlineColorAndroid="transparent"
                multiline={true}
                numberOfLines={6}
                style={[
                  [
                    styles.aboutMeInputContainer,
                    styles.shadowbb,
                    styles.fontSize(18),
                  ],
                ]}
                returnKeyType={'done'}
                onSubmitEditing={dismissKeyboard()}
                onChangeText={(text) => setComplain(text)}
                value={complain}
              />
              <View
                style={[
                  styles.flexRow,
                  styles.alignSelf,
                  styles.mH(45),
                  styles.mT(5),
                ]}>
                <ButtonSmall
                  title={labels.submit}
                  onBtnPress={() => {
                    onComplain();
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {/* CANCEL APPOINTMENT MODAL */}
      <ReactNativeModal
        backdropOpacity={0.5}
        isVisible={cancelPopUp}
        onBackButtonPress={() => setCancelPopUp(false)}>
        <View style={[styles.aboutMePopUpContainer]}>
          <Text style={[styles.textSemiBold, styles.textAlign, styles.mT(25)]}>
            {labels.canText}
          </Text>
          <View
            style={[
              styles.flexRow,
              styles.alignSelf,
              styles.mH(45),
              styles.mT(5),
            ]}>
            <ButtonWhite
              title={labels.no}
              exstyle={styles.shadowbb}
              onBtnPress={() => setCancelPopUp(false)}
            />
            <ButtonSmall
              title={labels.yes}
              onBtnPress={() => cancelAppoint()}
            />
          </View>
          <View style={styles.height(10)} />
        </View>
      </ReactNativeModal>
    </>
  );
};

export default PatientConsulationDetail;
