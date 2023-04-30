import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {Input, Icon} from 'react-native-elements';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import fonts from '../../assets/fonts';
import ReactNativePickerModule from 'react-native-picker-module';
import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modalbox';
import Snackbar from 'react-native-snackbar';
import {
  ButtonSmall,
  GreadientHeader,
  ButtonWhite,
  ReactChipsInput,
} from '../../components';
import moment from 'moment';
import DrUtility from '../../config/DrUtility';
import {
  getDetail,
  getConsultationTypes,
  getEstDoctors,
  getPOS,
  getNotificationSettings,
} from '../../store/actions';
import {useDispatch, useSelector} from 'react-redux';

const DrEditSlot = ({navigation, route}) => {
  console.log(route?.params, 'DrEditSlot');
  //Redux STORE
  const dispatch = useDispatch();
  const {role, estDoc} = useSelector((state) => state.Auth);
  const {getConsultationlist} = useSelector((state) => state.Patient);
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
  const [consultation, setConsultation] = useState(
    route?.params?.schedule?.consultationType?.title
      ? route?.params?.schedule?.consultationType?.title
      : '',
  );
  const [consultationId, setConsultationId] = useState(
    route?.params?.schedule?.consultationType?.id,
  );
  const [purposeOfConsulttext, setpurposeOfConsulttext] = useState('');
  const [slotId] = useState(route?.params?.slotId);
  const [purpose] = useState(
    route?.params?.schedule?.purposes ? route?.params?.schedule?.purposes : [],
  );
  const [replacementDoctor, setReplacementDoctor] = useState(
    route?.params?.schedule?.replacementProvider
      ? route?.params?.schedule?.replacementProvider
      : '',
  );
  const [consultationDate, setConsultationDate] = useState(
    route?.params?.schedule?.consultationDate,
  );
  const [timeStart, setTimeStart] = useState(new Date(route?.params?.start));
  const [timeEnd, setTimeEnd] = useState(new Date(route?.params?.end));
  const [updateTS, setUpdateTS] = useState(
    moment(route?.params?.start).format('hh:mm A'),
  );
  const [updateTE, setUpdateTE] = useState(
    moment(route?.params?.end).format('hh:mm A'),
  );
  console.log(updateTE,"endTime");
  const [picker, setPicker] = useState(false);
  const [picker1, setPicker1] = useState(false);
  const [slot, setSlot] = useState(
    route?.params?.schedule?.perSlotTime
      ? route?.params?.schedule?.perSlotTime
      : '',
  );
  const [perSlotTime, setPerSlotTime] = useState(
    route?.params?.schedule?.perSlotTime
      ? route?.params?.schedule?.perSlotTime
      : '',
  );
  const [pay, setPay] = useState(
    route?.params?.schedule?.perSlotAmount
      ? route?.params?.schedule?.perSlotAmount
      : '',
  );
  const [timeData] = useState([
    {time: '30 min', value: 30},
    {time: '40 min', value: 40},
    {time: '50 min', value: 50},
    {time: '1 hour', value: 60},
    {time: '1.5 hour', value: 90},
    {time: '2 hour', value: 120},
  ]);
  //Notification
  const [preNotification, setPreNotification] = useState(
    route?.params?.schedule?.preAppointmentNotify?.title
      ? route?.params?.schedule?.preAppointmentNotify?.title
      : '',
  );
  const [preNotificationId, setPreNotificationId] = useState(
    route?.params?.schedule?.preAppointmentNotify?.id
      ? route?.params?.schedule?.preAppointmentNotify?.id
      : '',
  );
  const [postNotification, setPostNotification] = useState(
    route?.params?.schedule?.postAppointmentNotify?.title
      ? route?.params?.schedule?.postAppointmentNotify?.title
      : '',
  );
  const [postNotificationId, setPostNotificationId] = useState(
    route?.params?.schedule?.postAppointmentNotify?.id
      ? route?.params?.schedule?.postAppointmentNotify?.id
      : '',
  );

  //POC  States
  const [posData, setPosData] = useState([]);
  const [posFilter, setPosFilter] = useState([]);
  const [posId, setPosId] = useState('');
  const [showPOC, setShowPOC] = useState(false);
  const [chips, setChips] = useState([]);
  const [monthPop, setMonthPop] = useState(false);
  const [current, setCurrent] = useState(new Date(consultationDate));

  // Declare input reference field
  const refFilter = useRef();
  const refPicker = useRef();
  const refPicker2 = useRef();
  const refPicker4 = useRef();
  const refPicker5 = useRef();
  const refPicker6 = useRef();

  //**********Fuctions And API Calling*************

  //GET Data
  useEffect(() => {
    dispatch(getConsultationTypes());
    if (role == 'establishment') {
      dispatch(getDetail({from: role}));
      dispatch(getNotificationSettings());
      dispatch(getPOS(false, estDoc?.provider?.id));
    } else {
      dispatch(getDetail({from: role}));
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

  // // Set  purpose of consultation to state
  useEffect(() => {
    if (purpose) {
      setPosId(purpose?.id);
      setChips((prev) => [
        ...prev,
        {
          value: purpose?.poc?.title,
          color: purpose?.color,
          pocId: purpose?.poc?.id,
        },
      ]);
    }
  }, []);

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
  // Render of POC
  function rendarPOC({item}) {
    return (
      <TouchableOpacity
        onPress={() => {
          setpurposeOfConsulttext(item?.poc?.title);
          setPosId(item.id);
          setShowPOC(!showPOC);
          createChip(item);
        }}>
        <View style={styles.POCArr}>
          <Text style={styles.fontSize(12)}>{item?.poc?.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  // Clear time modal feilds
  const clearFeilds = () => {
    setTimeEnd(new Date());
    setTimeStart(new Date());
    setUpdateTS('');
    setUpdateTE('');
  };

  // Purpose of consultation
  const onSearchTyping = (text) => {
    setpurposeOfConsulttext(text);
    const newData = posData.filter((item) => {
      const itemData = item?.poc?.title.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setPosFilter(newData);
  };
  //Clear Doctor Data
  const clearDoctor = () => {
    setDoctorData({});
  };
  const onApplytime = () => {
    setMonthPop(false);
  };
  //Creating Time Slot for doctor schedule (Edit Schedule API)
  const onEditSchedule = () => {
    const payload = {
      slotId: slotId,
      consultationTypeId: consultationId,
      replacementProvider: replacementDoctor,
      consultationDate: moment(current).format('YYYY-MM-DD'), // 2019-09-16
      startTime: updateTS
        ? moment(consultationDate).format('dddd, LL') + ' ' + updateTS
        : '', // September 15, 2021 00:00 Am format
      endTime: updateTE
        ? moment(consultationDate).format('dddd, LL') + ' ' + updateTE
        : '', // September 15, 2021 00:00 Am format
      posId: posId,
      preNotificationId: preNotificationId,
      postNotificationId: postNotificationId,
      perSlotTime: perSlotTime,
      perSlotAmount: pay,
      repeat: 0,
    };
    console.log(payload);
    DrUtility.drEditSlot(payload, navigation, dispatch);
  };
  return (
    <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
      <GreadientHeader
        showLeftIcon={true}
        showRightIcon={false}
        showCenterText={labels.slotEdit}
        showLeftText={labels.back}
        back={true}
        leftRoute={() => navigation.goBack()}
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
            {/* ADD PROVIDER  */}
            {role === 'establishment' && (
              <>
                <Text style={[styles.availablityHeading, styles.mB(7)]}>
                  {labels.addDoctor}
                </Text>
                <View style={[styles.availCont1, styles.mL(10)]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.dropDown, styles.flex(1)]}
                    onPress={() => refPicker4.current.show()}>
                    <View style={[styles.flexRow]}>
                      <View style={[styles.leftFeild, styles.flex(0.8)]}>
                        <Text
                          style={[
                            styles.dropDownText,
                            styles.textNoti,
                            styles.mL(15),
                            styles.color(
                              addDoctor == '' ? colors.subText : colors.heading,
                            ),
                          ]}>
                          {addDoctor == '' ? labels.addDoctor : addDoctor}
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
                  pickerRef={refPicker4}
                  value={addDoctor}
                  title={labels.addDoctor}
                  items={establishmentDoctor.map((e) => e.provider?.firstName)}
                  selectedColor={colors.themeColor}
                  onValueChange={(value, i) => {
                    setAddDoctor(value);
                    establishmentDoctor
                      ?.filter((e) => e.provider?.firstName === value)
                      ?.map((item, i) => {
                        return (
                          setProviderId(item?.provider?.id),
                          setDoctorData(item?.provider)
                        );
                      });
                  }}
                />
              </>
            )}
            {doctorData?.id && (
              <View style={[styles.PatientArr]}>
                <View style={styles.newPatientView}>
                  <Image
                    source={
                      doctorData?.avatar
                        ? {uri: doctorData.avatar}
                        : assets.dummy
                    }
                    style={[styles.height(40), styles.width(40)]}
                    borderRadius={50}
                  />
                  <Text style={[styles.fontSize(12), styles.mL(10)]}>
                    {`${doctorData.firstName} ${doctorData.lastName}`}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => clearDoctor()}>
                  <Image source={assets.cross} />
                </TouchableOpacity>
              </View>
            )}
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
              }}
              // onSubmitEditing={(e) => dispatch(searchPOC())}
              rightIconContainerStyle={{width: 30}}
              rightIcon={
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{zIndex: 100}}
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
              onSubmitEditing={(e) => {}}
            />
            <Text style={[styles.availablityHeading, styles.mB(7)]}>
              {labels.consulationDate}:{' '}
              <Text
                style={[styles.fontSize(16), styles.color(colors.btngr3)]}
                onPress={() => setMonthPop(true)}>
                {moment(current).format('ll')}
              </Text>
            </Text>
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
                      {slot === 0
                        ? labels.selectSlot
                        : slot === 60
                        ? '1 hour'
                        : slot === 90
                        ? '1.5 hour'
                        : slot === 120
                        ? '2 hour'
                        : `${slot} `}
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
                  onSubmitEditing={(e) => {}}
                />
              </View>
            </View>
            <ReactNativePickerModule
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
                    return (
                      setPerSlotTime(item.value),
                      setUpdateTE(
                        moment(updateTS, 'hh:mm A')
                          .add(item.value, 'minutes')
                          .format('hh:mm A'),
                      )
                    );
                  });
              }}
            />
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
                disable={false}
                exstyle={[styles.shadowbb]}
                title={updateTE != '' ? updateTE : labels.timeend}
                onBtnPress={() => {
                  // refFilter.current.open();
                  // setPicker(false);
                  // setPicker1(true);
                  Snackbar.show({
                    text: labels.adjustTime,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: colors.themeColor,
                    fontFamily: fonts.PoppinsMedium,
                    textColor: colors.dim,
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
                style={[styles.dropDown, styles.flex(1)]}
                onPress={() => refPicker5.current.show()}>
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
                onPress={() => refPicker6.current.show()}>
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
              onBtnPress={() =>
                role === 'establishment'
                  ? alert('pending work')
                  : onEditSchedule()
              }
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
                date={timeStart}
                mode={'time'}
                onDateChange={(e) => {
                  setTimeStart(e);
                  setUpdateTS(moment(e).format('hh:mm A'));
                  // setUpdateTE(
                  //   moment(e, 'hh:mm A')
                  //     .add(perSlotTime, 'minutes')
                  //     .format('hh:mm A'),
                  // );
                }}
                style={styles.pickerCont}
              />
            </>
          )}
          {picker1 === true && (
            <>
              <DatePicker
                date={new Date()}
                mode={'time'}
                minimumDate={timeStart}
                onDateChange={(e) => {
                  setPicker(false);
                  setTimeEnd(e);
                  setUpdateTE(
                    moment(updateTS, 'hh:mm A')
                      .add(perSlotTime, 'minutes')
                      .format('hh:mm A'),
                  );
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
      {/* DATE SELECTION MODAL */}
      <ReactNativeModal
        style={[styles.height(300)]}
        backdropOpacity={0.5}
        isVisible={monthPop}
        onBackdropPress={() => setMonthPop(false)}>
        <View
          style={[
            styles.mH(20),
            styles.bR(20),
            styles.pV(20),
            styles.pH(20),
            styles.backgroundColor(colors.white),
          ]}>
          <TouchableOpacity
            // hitSlop={[styles.hitSlop]}
            onPress={() => setMonthPop(false)}>
            <Image source={assets.close} style={[styles.close]} />
          </TouchableOpacity>
          <>
            <DatePicker
              date={current}
              mode={'date'}
              minimumDate={new Date()}
              onDateChange={(date) => {
                setCurrent(date);
              }}
              style={styles.pickerCont2}
            />
          </>
          <View style={[styles.ModalFilterCont]}>
            <ButtonWhite
              exstyle={styles.shadowbb}
              title={labels.can}
              onBtnPress={() => {
                setMonthPop(false);
                setCurrent(new Date());
              }}
            />
            <ButtonSmall
              title={labels.apply}
              onBtnPress={() => {
                onApplytime();
              }}
            />
          </View>
        </View>
      </ReactNativeModal>
    </View>
  );
};

export default DrEditSlot;
