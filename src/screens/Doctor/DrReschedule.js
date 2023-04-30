import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  ButtonSmall,
  GreadientHeader,
  CustomCalendar,
  Category,
} from '../../components';
import styles from '../../assets/styles';
import { assets } from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import Modal from 'react-native-modalbox';
import moment from 'moment';
import {
  getConsultationTypes,
  updateWalkInPateints,
  getSchedule,
  getSlotsByDate,
  getAvailableSchedule,
} from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';

const DrReschedule = ({ navigation, route }) => {
  console.log(route?.params, 'DrReschedule');
  //Redux STORE
  const dispatch = useDispatch();
  const { profile, estDoc } = useSelector((state) => state.Auth);
  const { availableSchedule } = useSelector((state) => state.Doctor);
  console.log("profile?.userId====>", profile)

  // Declare state variables'
  const [consultationId, setConsultationId] = useState('');
  const [slotId, setSlotId] = useState(null);
  const [date, setDate] = useState(moment().format('YYYY-MM'));
  const [posId, setPosId] = useState('');
  const [appointmentDetails, setOldAppoinmentDetails] = useState({});
  const [countSlots, setCountSlots] = useState('00');
  const [selectedSlots, setSelectedSlots] = useState([]);

  // Declare input reference field
  const refPopUp = useRef();

  //Fuctions and API's

  //GET Data
  useEffect(() => {
    setOldAppoinmentDetails(route?.params);
    dispatch(getConsultationTypes());
    dispatch(getAvailableSchedule({ date }, false));
    onDateSelected(
      moment(availableSchedule?.[0]?.consultationDate).format('YYYY-MM-DD'),
    ); // get initial date slots
  }, []);

  //Function for date and timeslot set

  //Booking Appointment
  const onReScheduleAppointment = () => {
    const appointment = {
      slotId: slotId,
      posId: posId,
      consultationTypeId: consultationId,
    };
    console.log(appointment, "appointment");
    dispatch(
      updateWalkInPateints(
        appointment,
        appointmentDetails?.appointment?.id,
        true,
      )
    ).then((text) => {
      if (text === 200) {
        refPopUp.current.open();
        setTimeout(() => {
          refPopUp.current.close();
          const params = {
            period: moment(appointmentDetails?.appointment?.startTime).format(
              'YYYY-MM',
            ), // curent day month
          };
          if (estDoc?.provider) {
            dispatch(getSchedule(params, true, estDoc?.provider?.id));
          } else {
            dispatch(getSchedule(params, true));
          }
          navigation.goBack();
        }, 2000);
      }
    });
  };

  //Action for data selection
  const onDateSelected = async (e) => {
    const param = {
      id: profile?.userId,
      date: e,
      pocId: "",
      time: "",
      consultationTypeId: ""
    };
    var updatedSlots = [];
    await dispatch(getSlotsByDate(param, false)).then((response) => {
      if (response !== 400) {
        updatedSlots = response?.data?.data;
      } else if (response === 400) {
        updatedSlots = [];
      }
    });
    const selectionDate = moment(new Date(e)).format('YYYY-MM-DD');
    const filterSchedule = availableSchedule?.filter(
      (item) => item?.consultationDate === selectionDate,
    );
    const slots = filterSchedule?.length ? filterSchedule?.map((t) => t) : [];
    const data = updatedSlots?.length
      ? updatedSlots?.map((item, index) => {
        return {
          ...item,
          consultationType: item?.schedule?.consultationType,
          key: index + 1,
          text: `${item?.startTime} to ${item?.endTime}`,
          servieId: item?.id,
          walkin: item?.schedule?.consultationType?.title !== 'Video Call',
        };
      })
      : [];
    setSelectedSlots(data || []);
    setCountSlots(
      data?.length <= 9 ? '0' + data?.length : data?.length || '00',
    );
  };

  //Action for POC selection
  const onSelectionPOC = (item) => {
    const service = selectedSlots.filter((text) => text.status);
    const selected = service.filter((text) => text.servieId === item);
    setConsultationId(selected?.[0]?.consultationType?.id);
    setPosId(selected?.[0]?.schedule?.purposes?.id);
  };
  // console.log(appointmentDetails, 'Appointment Details');
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <GreadientHeader
          showLeftIcon={true}
          showRightIcon={false}
          showCenterText={labels.reshudleAppointment}
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
                {appointmentDetails?.appointment?.patient && (
                  <View style={styles.drWalkinDoctorDetailSubWrappper}>
                    <Text
                      style={[styles.fontPoppinsSemiBoldBlack14, styles.mR(5)]}>
                      {labels.patientName}
                    </Text>
                    <Text style={[styles.fontPoppinsRegularBlack14]}>
                      {`${appointmentDetails?.appointment?.patient?.firstName} ${appointmentDetails?.appointment?.patient?.lastName}`}
                    </Text>
                  </View>
                )}
                <View style={styles.drWalkinDoctorDetailSubWrappper}>
                  <Text
                    style={[styles.fontPoppinsSemiBoldBlack14, styles.mR(5)]}>
                    {labels.date1}
                  </Text>
                  <Text style={[styles.fontPoppinsRegularBlack14]}>
                    {appointmentDetails?.schedule?.consultationDate}
                  </Text>
                </View>
                <View style={styles.drWalkinDoctorDetailSubWrappper}>
                  <Text
                    style={[styles.fontPoppinsSemiBoldBlack14, styles.mR(5)]}>
                    {labels.slotTime}
                  </Text>
                  <Text style={[styles.fontPoppinsRegularBlack14]}>
                    {appointmentDetails?.time}
                  </Text>
                </View>
                <View style={styles.drWalkinDoctorDetailSubWrappper}>
                  <Text
                    style={[styles.fontPoppinsSemiBoldBlack14, styles.mR(5)]}>
                    {labels.status}:
                  </Text>
                  <Text style={[styles.fontPoppinsRegularBlack14]}>
                    {appointmentDetails?.appointment?.status}
                  </Text>
                </View>
              </View>
              {/* Available Slots */}
              <Text style={[styles.availablityHeading, styles.mB(7)]}>
                {labels.selectTimeSlots}
              </Text>
              <>
                <CustomCalendar
                  datesGet={availableSchedule}
                  onDateSelected={(e) => onDateSelected(e)}
                />
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={[styles.h3, styles.mT(18)]}>
                  {labels.availablityTime}
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={[
                    styles.textLight,
                    styles.textAlign,
                    styles.fontSize(14),
                  ]}>
                  {countSlots} {labels.slots}
                </Text>
                <View style={[styles.mB(10)]}>
                  <Category
                    time={true}
                    options={selectedSlots}
                    isSelected={slotId}
                    onItemPress={(value, ind) => {
                      // console.log(selectedSlots);
                      setSlotId(value);
                      onSelectionPOC(value);
                    }}
                  />
                </View>
              </>
              <ButtonSmall
                title={labels.save}
                disabled={!slotId}
                onBtnPress={() => onReScheduleAppointment()}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        {/* BOOK APPOINTMENT MODAL */}
        <Modal
          style={[styles.modal]}
          position={'center'}
          ref={refPopUp}
          backdropPressToClose={false}
          backdropOpacity={0.8}
          keyboardTopOffset={50}
          backButtonClose={true}
          swipeToClose={true}
          backdropColor={colors.black}>
          <Image
            source={assets.sucessfull}
            style={styles.doneBox}
            resizeMode="contain"
          />
          <Text style={[styles.sucessTitle, styles.mT(20)]}>
            {labels.updateSchedule}
          </Text>
          {/* <View style={[styles.width(200), styles.mT(15)]}>
            <ButtonGradient
              title={labels.yourAppointment}
              type={false}
              onBtnPress={() => navigation.navigate('MyAppointments')}
            />
          </View> */}
        </Modal>
      </View>
    </>
  );
};

export default DrReschedule;
