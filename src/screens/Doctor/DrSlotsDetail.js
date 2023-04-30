import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {ButtonSmall, GreadientHeader, ButtonGradient} from '../../components';
import styles from '../../assets/styles';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import Snackbar from 'react-native-snackbar';
import moment from 'moment';
import ReactNativeModal from 'react-native-modal';
import {getPatientList, deleteSlot, getSchedule} from '../../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import fonts from '../../assets/fonts';

const DrSlotsDetail = ({navigation, route}) => {
  console.log(route?.params?.data, 'DrSlotDetail params');
  //Redux STORE
  const dispatch = useDispatch();
  const {profile, estDoc, role} = useSelector((state) => state.Auth);
  const {consultaionList} = useSelector((state) => state.Doctor);
  // Declare state variables'
  const [data, setData] = useState(route?.params?.data);
  const [user, setUser] = useState({});
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [slotStartTime] = useState(route?.params?.data?.time);
  const [date] = useState(
    moment(route?.params?.data?.start).format('YYYY-MM-DD'),
  );
  const [, setMonthPop] = useState(false);

  //FUCNTIONS AND API'S

  //Action for Get Patient Detail by id
  useEffect(() => {
    const payload = {patientIds: [data?.appointment?.patientId]};
    dispatch(getPatientList(payload, false));
  }, []);

  //Action for set user in appointment data
  useEffect(() => {
    // if (consultaionList.length > 0) {
    var userData = {};
    consultaionList.map((item) => {
      userData = {...userData, [item.id]: item};
    });
    setUser(userData);
    const newData = {
      ...data,
      appointment: {
        ...data.appointment,
        patient: userData[data?.appointment?.patientId],
      },
    };
    setData(newData);
    // console.log(data);
    // }
  }, []);

  //Action for Booked Walk-In apppointment
  const onBookedSlot = () => {
    if (data?.start <= new Date()) {
      Snackbar.show({
        text: labels.cannot2,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
        action: {
          text: 'ok',
          textColor: colors.dim,
          onPress: () => {
            Snackbar.dismiss();
          },
        },
      });
    } else {
      navigation.replace('DrWalkinAppoinment', {
        from: 'slotDetail',
        data: null,
        date: date,
        posId: data?.posId,
        slotId: data?.slotId,
        start: data?.start,
        end: data?.end,
        title: data?.title,
        consultationId: data?.consultationId,
      });
    }
  };
  //Action for Delete Slot
  const onDeleteSlot = () => {
    setDeletePopUp(false);
    if (data?.status === 'BOOKED') {
      const params = {
        id: data?.appointment?.id,
        slotId: data?.slotId,
      };
      //booked slot delete
      dispatch(deleteSlot(params, true)).then((text) => {
        // console.log(text);
        if (text === 200) {
          navigation.goBack();
          const params = {
            period: moment(date).format('YYYY-MM'), // curent day month
          };
          if (estDoc?.provider) {
            dispatch(getSchedule(params, true, estDoc?.provider?.id));
          } else {
            dispatch(getSchedule(params, true));
          }
        }
      });
    } else {
      const params = {
        slotId: data?.slotId,
      };
      // empty slot delete
      dispatch(deleteSlot(params)).then((text) => {
        // console.log(text);
        if (text === 200) {
          navigation.goBack();
          const params = {
            period: moment(date).format('YYYY-MM'), // curent day month
          };
          if (estDoc?.provider) {
            dispatch(getSchedule(params, true, estDoc?.provider?.id));
          } else {
            dispatch(getSchedule(params, true));
          }
        }
      });
    }
  };

  const showToastEdit = () => {
    Snackbar.show({
      text: labels.cannot3,
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: colors.themeColor,
      fontFamily: fonts.PoppinsMedium,
      textColor: colors.dim,
      action: {
        text: 'ok',
        textColor: colors.dim,
        onPress: () => {
          Snackbar.dismiss();
        },
      },
    });
  };
  const showToastReschedule = () => {
    Snackbar.show({
      text: labels.cannot4,
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: colors.themeColor,
      fontFamily: fonts.PoppinsMedium,
      textColor: colors.dim,
      action: {
        text: 'ok',
        textColor: colors.dim,
        onPress: () => {
          Snackbar.dismiss();
        },
      },
    });
  };
  //  console.log(data, 'DATA');
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <GreadientHeader
          showLeftIcon={true}
          showRightIcon={false}
          showCenterText={labels.slotDetail}
          showLeftText={labels.back}
          back={true}
          leftRoute={() => navigation.goBack()}
        />
        <View style={styles.height(10)} />
        <KeyboardAvoidingView
          style={styles.flex(1)}
          behavior={Platform.OS == 'ios' && 'padding'}>
          <ScrollView
            bounces={false}
            style={styles.backgroundColor(colors.themeWhite)}
            showsVerticalScrollIndicator={false}>
            <View style={styles.mH(20)}>
              <View
                style={[styles.shadowbb, styles.drWalkinDoctorDetailWrapper]}>
                <View style={styles.drWalkinDoctorDetailSubWrappper}>
                  <Text
                    style={[styles.fontPoppinsSemiBoldBlack14, styles.mR(5)]}>
                    {labels.drName}
                  </Text>
                  <Text style={[styles.fontPoppinsRegularBlack14]}>
                    {profile?.name}
                  </Text>
                </View>
                <View style={styles.drWalkinDoctorDetailSubWrappper}>
                  <Text
                    style={[styles.fontPoppinsSemiBoldBlack14, styles.mR(5)]}>
                    {labels.slotTime}:
                  </Text>
                  <Text style={[styles.fontPoppinsRegularBlack14]}>
                    {slotStartTime}
                  </Text>
                </View>
                <View style={styles.drWalkinDoctorDetailSubWrappper}>
                  <Text
                    style={[styles.fontPoppinsSemiBoldBlack14, styles.mR(5)]}>
                    {labels.date1}
                  </Text>
                  <Text
                    onPress={() => setMonthPop(true)}
                    style={[styles.fontPoppinsRegularBlack14]}>
                    {date}
                  </Text>
                </View>
                <View style={styles.drWalkinDoctorDetailSubWrappper}>
                  <Text
                    style={[styles.fontPoppinsSemiBoldBlack14, styles.mR(5)]}>
                    {labels.typeOfConsultation}:
                  </Text>
                  <Text style={[styles.fontPoppinsRegularBlack14]}>
                    {data?.type}
                  </Text>
                </View>
                <View style={styles.drWalkinDoctorDetailSubWrappper}>
                  <Text
                    style={[styles.fontPoppinsSemiBoldBlack14, styles.mR(5)]}>
                    {labels.status}:
                  </Text>
                  <Text style={[styles.fontPoppinsRegularBlack14]}>
                    {data?.status}
                  </Text>
                </View>
              </View>
              {data?.status === 'Available' && (
                <ButtonSmall
                  title={labels.bookAppointment}
                  // disabled={paymentCard === null}
                  onBtnPress={() => onBookedSlot()}
                />
              )}
              {data?.status === 'COMPLETED' ? null : role === 'provider' ? (
                <ButtonSmall
                  title={
                    data?.status === 'Available'
                      ? labels.edit
                      : data?.status === 'BOOKED'
                      ? labels.reschedule
                      : ''
                  }
                  onBtnPress={() => {
                    data?.status === 'Available'
                      ? data?.start <= new Date()
                        ? showToastEdit()
                        : navigation.replace('DrEditSlot', data)
                      : data?.status === 'BOOKED'
                      ? data?.start <= new Date()
                        ? showToastReschedule()
                        : navigation.replace('DrReschedule', data)
                      : null;
                  }}
                />
              ) : null}
              {data?.status === 'COMPLETED' ? null : role === 'provider' ? (
                <ButtonGradient
                  cancel
                  gradient
                  title={labels.delete}
                  onBtnPress={() => setDeletePopUp(!deletePopUp)}
                />
              ) : null}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* CANCEL APPOINTMENT MODAL */}
        <ReactNativeModal
          backdropOpacity={0.5}
          isVisible={deletePopUp}
          onBackButtonPress={() => setDeletePopUp(false)}>
          <View style={[styles.aboutMePopUpContainer]}>
            <Text
              style={[styles.textSemiBold, styles.textAlign, styles.mT(25)]}>
              {labels.deleteText}
            </Text>
            <View
              style={[
                styles.flexRow,
                styles.width_Percent('70%'),
                styles.mL(13),
              ]}>
              <ButtonGradient
                title={labels.can}
                type={false}
                gradient={true}
                onBtnPress={() => setDeletePopUp(false)}
              />
              <View style={styles.mL(15)}>
                <ButtonGradient
                  title={labels.delete}
                  type={false}
                  gradient={true}
                  cancel={true}
                  onBtnPress={() => onDeleteSlot()}
                />
              </View>
            </View>
            <View style={styles.height(10)} />
          </View>
        </ReactNativeModal>
      </View>
    </>
  );
};

export default DrSlotsDetail;
