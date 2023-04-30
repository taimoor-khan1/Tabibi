import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  I18nManager,
  BackHandler,
} from 'react-native';
import { Input, Icon } from 'react-native-elements';
import styles from '../../assets/styles';
import { assets } from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import ReactNativePickerModule from 'react-native-picker-module';
import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modalbox';
import Snackbar from 'react-native-snackbar';
import {
  ButtonSmall,
  GreadientHeader,
  ButtonWhite,
  ReactChipsInput,
  Calendar_CC,
} from '../../components';
import moment from 'moment';
import DrUtility from '../../config/DrUtility';
import {
  getDetail,
  getNotificationSettings,
  createSchedule,
  createScheduleEst,
  getPOS,
} from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import fonts from '../../assets/fonts';

const Availability = ({ navigation }) => {
  //Redux STORE
  const dispatch = useDispatch();
  const { role, profile, estDoc } = useSelector((state) => state.Auth);
  const { getConsultationlist } = useSelector((state) => state.Patient);
  const {
    getProfileDetail,
    addSchedule,
    establishmentDoctor,
    notificationSetting,
    POS,
  } = useSelector((state) => state.Doctor);

  // Declare state variables'
  const [addDoctor, setAddDoctor] = useState('');
  const [doctorData, setDoctorData] = useState({});
  const [providerId, setProviderId] = useState('');
  const [consultation, setConsultation] = useState('');
  const [consultationId, setConsultationId] = useState('');
  const [purposeOfConsulttext, setpurposeOfConsulttext] = useState('');
  const [replacementDoctor, setReplacementDoctor] = useState('');
  const [consultationDate, setConsultationDate] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const [reapeatedData] = useState([
    { value: 0, name: I18nManager.isRTL ? 'لا يتكرر' : 'Does not repeat' },
    { value: 1, name: I18nManager.isRTL ? 'كل يوم' : 'Every Day' },
    { value: 7, name: I18nManager.isRTL ? 'كل اسبوع' : 'Every Week' },
    { value: 30, name: I18nManager.isRTL ? 'كل شهر' : 'Every Month' },
  ]);
  const [timeData] = useState([
    { time: '30 min', value: 30 },
    { time: '40 min', value: 40 },
    { time: '50 min', value: 50 },
    { time: '1 hour', value: 60 },
    { time: '1.5 hour', value: 90 },
    { time: '2 hour', value: 120 },
  ]);
  const [timeStart, setTimeStart] = useState(new Date());
  const [timeEnd, setTimeEnd] = useState(new Date());
  const [updateTS, setUpdateTS] = useState('8:00 am');
  const [updateTE, setUpdateTE] = useState('5:00 pm');
  const [picker, setPicker] = useState(false);
  const [picker1, setPicker1] = useState(false);
  const [slot, setSlot] = useState(60);
  const [perSlotTime, setPerSlotTime] = useState(60);
  const [pay, setPay] = useState(60);
  const [reapeat, setRepeat] = useState(
    I18nManager.isRTL ? 'لا يتكرر' : 'Does not repeat',
  );
  const [reapeatValue, setRepeatValue] = useState(0);

  //Notification
  const [preNotification, setPreNotification] = useState('');
  const [preNotificationId, setPreNotificationId] = useState('');
  const [postNotification, setPostNotification] = useState('');
  const [postNotificationId, setPostNotificationId] = useState('');
  // const [minTime, setMinTime] = useState('');
  // const [maxTime, setMaxTime] = useState('');
  const [lastMin, setLastmin] = useState('');
  //POC  States
  const [showPOC, setShowPOC] = useState(false);
  const [addPOC, setAddPOC] = useState(false);
  const [chips, setChips] = useState([]);
  const [posData, setPosData] = useState([]);
  const [posFilter, setPosFilter] = useState([]);
  const [posId, setPosId] = useState('');
  // Declare input reference field
  const refFilter = useRef();
  const refPicker = useRef();
  const refPicker2 = useRef();
  const refPicker3 = useRef();
  const refPicker4 = useRef();
  const refPicker5 = useRef();
  const refPicker6 = useRef();

  const minTime = new Date();
  minTime.setHours(8);
  minTime.setMinutes(0);
  minTime.setMilliseconds(0);

  const maxTime = new Date();
  maxTime.setHours(17);
  maxTime.setMinutes(0);
  maxTime.setMilliseconds(0);
  //**********Fuctions And API Calling*************

  //BACK HANDLER
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () =>
      Snackbar.dismiss(),
    );
    return () => backHandler.remove();
  }, []);

  //Toast for notification
  const showToast = (type) => {
    if (type === 'stripe') {
      Snackbar.show({
        text: labels.stripeAccountValidation,
        duration: Snackbar.LENGTH_LONG,
        numberOfLines: 10,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
      });
    } else if (type == 'est') {
      Snackbar.show({
        text: labels.noDoctorFound,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        numberOfLines: 4,
        textColor: colors.dim,
        action: {
          text: 'Go to',
          textColor: colors.dim,
          onPress: () => {
            navigation.navigate('DrAddDoctor');
          },
        },
      });
    } else {
      Snackbar.show({
        text:
          type === 'pre'
            ? labels.prenotificationToast
            : labels.postnotificationToast,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        numberOfLines: 4,
        textColor: colors.dim,
        action: {
          text: 'Go to',
          textColor: colors.dim,
          onPress: () => {
            navigation.navigate(
              'NotificationSetting',
              type === 'pre' ? { index: 0 } : { index: 1 },
            );
          },
        },
      });
    }
  };

  //GET Data
  useEffect(() => {
    if (role == 'establishment') {
      dispatch(getDetail({ from: role }));
      dispatch(getNotificationSettings());
      dispatch(getPOS(false, estDoc?.provider?.id));
    } else {
      dispatch(getDetail({ from: role }));
      dispatch(getNotificationSettings());
      dispatch(getPOS(false));
    }
  }, []);

  //Set POC Data
  useEffect(() => {
    setPosData(POS?.length ? POS : []);
    setPosFilter(POS?.length ? POS : []);
  }, [POS]);

  //Set new schedule data
  useEffect(() => {
    if (addSchedule) {
      dispatch({
        type: 'CLEAR_SCHEDULE',
        payload: false,
      });
    }
  }, [addSchedule]);
  // Render of POC
  function rendarPOC({ item }) {
    return (
      <TouchableOpacity
        onPress={() => {
          setpurposeOfConsulttext(item?.poc?.title);
          setPosId(item.id);
          setShowPOC(!showPOC);
          createChip(item);
          setSlot(item?.perSlotTime);
          setPerSlotTime(item?.perSlotTime);
          setPay(item?.perSlotAmount);
          setPostNotificationId(
            item?.postAppointmentNotify != null
              ? item?.postAppointmentNotify?.id
              : '',
          );
          setPreNotificationId(
            item?.preAppointmentNotify != null
              ? item?.preAppointmentNotify?.id
              : '',
          );
          setPostNotification(
            item?.postAppointmentNotify != null
              ? item?.postAppointmentNotify?.title
              : '',
          );
          setPreNotification(
            item?.preAppointmentNotify != null
              ? item?.preAppointmentNotify?.title
              : '',
          );
        }}>
        <View style={styles.POCArr}>
          <Text style={styles.fontSize(12)}>{item?.poc?.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  // Purpose of consultation search
  const onSearchTyping = (text) => {
    setpurposeOfConsulttext(text);
    const newData = posData.filter((item) => {
      const itemData = item?.poc?.title.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setPosFilter(newData);
  };
  //Creating Time Slot for doctor schedule (Schedule API)
  const onCreateSchedule = () => {
    const payload = {
      consultationTypeId: consultationId,
      replacementProvider: replacementDoctor,
      consultationDate: consultationDate, // 2019-09-16
      startTime: updateTS
        ? moment(consultationDate).format('ddd, LL') + ' ' + updateTS
        : '', // September 15, 2021 00:00 Am format
      endTime: updateTE
        ? moment(consultationDate).format('ddd, LL') + ' ' + updateTE
        : '', // September 15, 2021 00:00 Am format
      posId: posId,
      preNotificationId: preNotificationId,
      postNotificationId: postNotificationId,
      perSlotTime: perSlotTime,
      perSlotAmount: pay,
      repeat: reapeatValue,
    };
    // console.log(payload);
    DrUtility.drAvability(payload, navigation, createSchedule, dispatch);
  };
  //Creating Time Slot for Establisment doctor schedule (Schedule API)
  const onCreateScheduleEst = () => {
    const payload = {
      providerId: estDoc?.provider?.id,
      consultationTypeId: consultationId,
      replacementProvider: replacementDoctor,
      consultationDate: consultationDate, // 2019-09-16
      startTime: updateTS
        ? moment(consultationDate).format('ddd, LL') + ' ' + updateTS
        : '', // September 15, 2021 00:00 Am format
      endTime: updateTE
        ? moment(consultationDate).format('ddd, LL') + ' ' + updateTE
        : '', // September 15, 2021 00:00 Am format
      posId: posId,
      preNotificationId: preNotificationId,
      postNotificationId: postNotificationId,
      perSlotTime: perSlotTime,
      perSlotAmount: pay,
      repeat: reapeatValue,
    };
    // console.log(payload);
    DrUtility.drAvabilityEst(payload, navigation, createScheduleEst, dispatch);
  };

  //Get Create Chip
  const createChip = (data) => {
    var chips = [];
    chips.push({
      value: data?.poc?.title,
      color: data?.color,
      pocId: data?.poc?.id,
      posId: data?.id,
    });
    // console.log(chips, 'chips');
    setChips(chips);
  };
  // Remove chips
  const removeChips = (obj) => {
    let stateChips = [...chips];
    var filteredPOC = stateChips.filter((item, index) => {
      return item.pocId !== obj.pocId;
    });
    // console.log(filteredPOC, 'wwww');
    setChips(filteredPOC);
    setPosId('');
    setpurposeOfConsulttext('');
  };
  //Clear Doctor Data
  const clearDoctor = () => {
    setDoctorData({});
  };
  // Clear time modal feilds
  const clearFeilds = () => {
    setTimeEnd(new Date());
    setTimeStart(new Date());
    setUpdateTS('');
    setUpdateTE('');
  };
  return (
    <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
      <GreadientHeader
        showLeftIcon={true}
        showRightIcon={false}
        showCenterText={labels.yourAvalibality}
        showLeftText={labels.back}
        back={true}
        leftRoute={() => {
          Snackbar.dismiss();
          navigation.goBack();
        }}
      />
      <Image source={assets.bottom_image} style={styles.bottomImg} />
      <KeyboardAvoidingView
        style={styles.flex(1)}
        behavior={Platform.OS == 'ios' && 'padding'}>
        <ScrollView
          bounces={false}
          style={styles.backgroundColor(colors.themeWhite)}
          showsVerticalScrollIndicator={false}>
          <View style={styles.height(20)} />
          <View style={styles.mH(20)}>
            {/* Consultation Type */}
            <Text style={[styles.availablityHeading, styles.mB(7)]}>
              {labels.typeOfConsultation}
            </Text>
            <View style={[styles.availCont1, styles.mL(10)]}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.dropDown, styles.flex(1)]}
                onPress={() => refPicker.current.show()}>
                <View style={[styles.flexRow]}>
                  <View style={[styles.leftFeild, styles.flex(0.8)]}>
                    <Text
                      style={[
                        styles.dropDownText,
                        styles.textNoti,
                        styles.mL(15),
                        styles.color(
                          consultation == '' ? colors.subText : colors.heading,
                        ),
                      ]}>
                      {consultation == '' ? labels.slelectType : consultation}
                    </Text>
                  </View>
                  <View style={[styles.rightArrowDown, styles.flex(0.2)]}>
                    <Icon
                      name="chevron-down"
                      color={colors.heading}
                      type="evilicon"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <ReactNativePickerModule
              titleStyle={styles.profileText}
              itemStyle={styles.pickerItem1}
              pickerRef={refPicker}
              value={consultation}
              title={labels.typeOfConsultation}
              items={getConsultationlist?.map((a) => (a.id, a.title))}
              selectedColor={colors.themeColor}
              onValueChange={(value, i) => {
                setConsultation(value);
                getConsultationlist
                  ?.filter((e) => e.title === value)
                  ?.map((item, i) => {
                    return setConsultationId(item.id);
                  });
              }}
            />

            {/* Purpose of consultation */}
            <Text style={[styles.availablityHeading, styles.mB(7)]}>
              {labels.purpose}
            </Text>
            <Input
              inputContainerStyle={[styles.inputContainer, styles.shadowbb]}
              placeholder={labels.typeHere}
              inputStyle={[styles.inputStyle]}
              autoCapitalize="words"
              returnKeyType="done"
              value={purposeOfConsulttext}
              onChangeText={(text) => {
                onSearchTyping(text);
                setShowPOC(text.length > 0 ? true : false);
                setAddPOC(
                  text.trim().length > 0 || purposeOfConsulttext ? true : false,
                );
              }}
              // onSubmitEditing={(e) => dispatch(searchPOC())}
              rightIconContainerStyle={{ width: 30 }}
              rightIcon={
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{ zIndex: 100 }}
                  onPress={() => {
                    setShowPOC(!showPOC);
                  }}>
                  <Icon
                    name={showPOC ? 'chevron-up' : 'chevron-down'}
                    color={colors.heading}
                    type="evilicon"
                  />
                </TouchableOpacity>
              }
            />
            {showPOC ? (
              <View style={styles.POCView}>
                <FlatList
                  nestedScrollEnabled={true}
                  data={posFilter}
                  renderItem={rendarPOC}
                  keyExtractor={(item) => item?.poc?.title}
                  ListEmptyComponent={
                    <Text style={styles.POCError}>{labels.noData}</Text>
                  }
                />
              </View>
            ) : null}
            <ReactChipsInput
              label={''}
              initialChips={chips}
              removedItem={(e) => removeChips(e)}
              alertRequired={false}
              chipStyle={[styles.chipStyle]}
              chipTextStyle={[styles.chipTextStyle]}
            />

            {/* Replacement Doctor */}
            <Text style={[styles.availablityHeading, styles.mB(7)]}>
              {labels.replacementDoctor}
            </Text>
            <Input
              inputContainerStyle={[styles.inputContainer, styles.shadowbb]}
              placeholder={labels.typeHere}
              inputStyle={[styles.inputStyle]}
              autoCapitalize="words"
              returnKeyType="done"
              value={replacementDoctor}
              onChangeText={(text) => {
                setReplacementDoctor(text);
              }}
              onSubmitEditing={(e) => { }}
            />
            {/* Calender Work */}
            <Text style={[styles.availablityHeading, styles.mB(7)]}>
              {labels.availabilityDetails}
            </Text>
          </View>
          <Calendar_CC
            avability={true}
            setDate={(date) => {
              setConsultationDate(date);
            }}
            index={0}
            navigation={navigation}
            scrollEnabled={true}
            pagingEnabled={true}
          />
          <View style={styles.mH(20)}>
            {/* Schedule Time*/}
            <View style={[styles.flexRow, styles.alignSelf, styles.mH(40)]}>
              <ButtonWhite
                exstyle={styles.shadowbb}
                title={updateTS != '' ? updateTS : labels.timestart}
                onBtnPress={() => {
                  refFilter.current.open();
                  setPicker(true);
                  setPicker1(false);
                }}
              />
              <ButtonWhite
                disable={!updateTS ? true : false}
                exstyle={[styles.shadowbb]}
                title={updateTE != '' ? updateTE : labels.timeend}
                onBtnPress={() => {
                  refFilter.current.open();
                  setPicker(false);
                  setPicker1(true);
                }}
              />
            </View>

            {/* TIME SLOT */}
            <Text style={[styles.availablityHeading, styles.mB(7)]}>
              {labels.selectSlot}
            </Text>
            <View style={[styles.countryFeildCont]}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.dropDown, styles.flex(0.6)]}
                onPress={() => refPicker2.current.show()}>
                <View style={[styles.flexRow]}>
                  <View style={[styles.leftFeild, styles.flex(0.8)]}>
                    <Text
                      style={[
                        styles.dropDownText,
                        styles.textNoti,
                        styles.mL(15),
                        styles.color(
                          slot === 0 ? colors.subText : colors.heading,
                        ),
                      ]}>
                      {slot === 0 ? labels.selectSlot : slot}
                    </Text>
                  </View>
                  <View style={[styles.rightArrowDown, styles.flex(0.2)]}>
                    <Icon
                      name="chevron-down"
                      color={colors.heading}
                      type="evilicon"
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.flex(0.4)}>
                <Input
                  inputContainerStyle={[styles.inputContainer, styles.shadowbb]}
                  inputStyle={[styles.inputStyle]}
                  returnKeyType="done"
                  keyboardType="number-pad"
                  value={'$ ' + pay}
                  onChangeText={(text) => {
                    setPay(Number(text.replace(/[^0-9]/g, '')));
                  }}
                  onSubmitEditing={(e) => { }}
                />
              </View>
            </View>
            <ReactNativePickerModule
              titleStyle={styles.profileText}
              itemStyle={styles.pickerItem1}
              pickerRef={refPicker2}
              value={slot}
              title={labels.selectSlot}
              items={timeData.map((a) => a.time)}
              selectedColor={colors.themeColor}
              onValueChange={(slot) => {
                setSlot(slot);
                timeData
                  ?.filter((e) => e.time === slot)
                  ?.map((item, i) => {
                    return setPerSlotTime(item.value);
                  });
              }}
            />
            {/* Repeated cycle */}
            <Text style={[styles.availablityHeading, styles.mB(7)]}>
              {labels.repeated}
            </Text>
            <View style={[styles.availCont1, styles.flex(0)]}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.dropDown, styles.flex(1)]}
                onPress={() => refPicker3.current.show()}>
                <View style={[styles.flexRow]}>
                  <View style={[styles.leftFeild]}>
                    <Text
                      style={[
                        styles.dropDownText,
                        styles.mL(20),
                        styles.color(
                          reapeat == '' ? colors.subText : colors.heading,
                        ),
                      ]}>
                      {reapeat == '' ? labels.select : reapeat}
                    </Text>
                  </View>
                  <View style={[styles.rightArrowDown]}>
                    <Icon
                      name="chevron-down"
                      color={colors.heading}
                      type="evilicon"
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <ReactNativePickerModule
                titleStyle={styles.profileText}
                itemStyle={styles.pickerItem1}
                pickerRef={refPicker3}
                value={reapeat}
                title={labels.selectRepeat}
                items={reapeatedData.map((a) => a.name)}
                selectedColor={colors.themeColor}
                onValueChange={(repeat) => {
                  setRepeat(repeat);
                  reapeatedData
                    ?.filter((e) => e.name === repeat)
                    ?.map((item, i) => {
                      return setRepeatValue(item.value);
                    });
                }}
              />
            </View>
            {/* Pre Notification */}
            <Text style={[styles.availablityHeading, styles.mB(7)]}>
              {labels.preNotification}
            </Text>
            <View style={[styles.availCont1, styles.flex(0)]}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.dropDown, styles.flex(1),]}
                onPress={() =>
                  notificationSetting?.filter(
                    (filter) => filter.type === 'pre-appointment',
                  ).length > 0
                    ? refPicker5.current.show()
                    : showToast('pre')
                }>
                <View style={[styles.flexRow]}>
                  <View style={[styles.leftFeild]}>
                    <Text
                      style={[
                        styles.dropDownText,
                        styles.mL(20),

                        styles.color(
                          preNotification == ''
                            ? colors.subText
                            : colors.heading,
                        ),
                      ]}>
                      {preNotification == '' ? labels.select : preNotification}
                    </Text>
                  </View>
                  <View style={[styles.rightArrowDown]}>
                    <Icon
                      name="chevron-down"
                      color={colors.heading}
                      type="evilicon"
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <ReactNativePickerModule
                titleStyle={styles.profileText}
                itemStyle={styles.pickerItem1}
                pickerRef={refPicker5}
                value={preNotification}
                title={labels.preNotification}
                items={notificationSetting
                  ?.filter((filter) => filter.type === 'pre-appointment')
                  ?.map((item) => item.title)}
                selectedColor={colors.themeColor}
                onValueChange={(notification) => {
                  setPreNotification(notification);
                  notificationSetting
                    ?.filter((filter) => filter.title === notification)
                    ?.map((item, i) => {
                      return setPreNotificationId(item.id);
                    });
                }}
              />
            </View>
            {/* Post Notification */}
            <Text style={[styles.availablityHeading, styles.mB(7)]}>
              {labels.postNotification}
            </Text>
            <View style={[styles.availCont1, styles.flex(0)]}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.dropDown, styles.flex(1)]}
                onPress={() =>
                  notificationSetting?.filter(
                    (filter) => filter.type === 'post-appointment',
                  ).length > 0
                    ? refPicker6.current.show()
                    : showToast('post')
                }>
                <View style={[styles.flexRow]}>
                  <View style={[styles.leftFeild]}>
                    <Text
                      style={[
                        styles.dropDownText,
                        styles.mL(20),
                        styles.color(
                          postNotification == ''
                            ? colors.subText
                            : colors.heading,
                        ),
                      ]}>
                      {postNotification == ''
                        ? labels.select
                        : postNotification}
                    </Text>
                  </View>
                  <View style={[styles.rightArrowDown]}>
                    <Icon
                      name="chevron-down"
                      color={colors.heading}
                      type="evilicon"
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <ReactNativePickerModule
                titleStyle={styles.profileText}
                itemStyle={styles.pickerItem1}
                pickerRef={refPicker6}
                value={postNotification}
                title={labels.postNotification}
                items={notificationSetting
                  ?.filter((filter) => filter.type === 'post-appointment')
                  ?.map((item) => item.title)}
                selectedColor={colors.themeColor}
                onValueChange={(notification) => {
                  setPostNotification(notification);
                  notificationSetting
                    ?.filter((filter) => filter.title === notification)
                    ?.map((item, i) => {
                      return setPostNotificationId(item.id);
                    });
                }}
              />
            </View>
            <ButtonSmall
              title={labels.save}
              onBtnPress={() => {
                role === 'establishment'
                  ? onCreateScheduleEst()
                  : onCreateSchedule();
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* time start and end modal */}
      <Modal
        style={[styles.filterModalSmall]}
        position={'center'}
        ref={refFilter}
        backdropPressToClose={false}
        backdropOpacity={0.25}
        keyboardTopOffset={50}
        backButtonClose={true}
        swipeToClose={false}
        backdropColor={colors.black}>
        <View style={[styles.flex(1), styles.mH(5)]}>
          <TouchableOpacity
            hitSlop={styles.hitSlop}
            onPress={() => refFilter.current.close()}>
            <Image source={assets.close} style={styles.close} />
          </TouchableOpacity>
          <Text style={styles.availablity}>{labels.availablity}</Text>
          {picker === true && (
            <>
              <DatePicker
                minimumDate={minTime}
                maximumDate={maxTime}
                date={timeStart}
                mode={'time'}
                minuteInterval={30}
                onDateChange={(e) => {
                  setTimeStart(e);
                  setUpdateTS(moment(e).format('hh:mm A'));
                }}
                style={styles.pickerCont}
              />
            </>
          )}
          {picker1 === true && (
            <>
              <DatePicker
                date={timeEnd}
                mode={'time'}
                minuteInterval={30}
                minimumDate={minTime}
                maximumDate={maxTime}
                onDateChange={(e) => {
                  setPicker(false);

                  setTimeEnd(e);
                  setUpdateTE(moment(e).format('hh:mm A'));
                }}
                style={styles.pickerCont}
              />
            </>
          )}
          <View style={[styles.ModalFilterCont]}>
            <ButtonWhite
              exstyle={styles.shadowbb}
              title={labels.clearall}
              onBtnPress={() => clearFeilds()}
            />
            <ButtonSmall
              title={labels.apply}
              onBtnPress={() => {
                refFilter.current.close();
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Availability;
