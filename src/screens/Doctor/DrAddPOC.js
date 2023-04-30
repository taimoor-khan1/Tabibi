import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  BackHandler,
} from 'react-native';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import fonts from '../../assets/fonts';
import {useDispatch, useSelector} from 'react-redux';
import ReactNativeModal from 'react-native-modal';
import ReactNativePickerModule from 'react-native-picker-module';
import {Input, Icon} from 'react-native-elements';
import {GreadientHeader, ButtonSmall} from '../../components';
import {
  SliderHuePicker,
  SliderSaturationPicker,
} from 'react-native-slider-color-picker';
import tinycolor from 'tinycolor2';
import Snackbar from 'react-native-snackbar';
import {
  getDetail,
  drGetProfile,
  searchPOC,
  createPOC,
  getPOS,
  getNotificationSettings,
  addPOS,
  addPOSEst,
  getEstDoctors,
  updatePOS,
} from '../../store/actions';

const DrAddPOC = ({navigation, route}) => {
  // REDUX STORE
  const {data,from}=route?.params
  
  const dispatch = useDispatch();
  const {user, profile, role} = useSelector((state) => state.Auth);
  const {getProfileDetail, notificationSetting, POC, establishmentDoctor} =
    useSelector((state) => state.Doctor);

  //POC Modal States
  console.log("establishmentDoctorestablishmentDoctorestablishmentDoctor",establishmentDoctor)
  const refConsulation = useRef();
  const refPicker4 = useRef();
  const [addDoctor, setAddDoctor] = useState('');
  const [doctorData, setDoctorData] = useState({});
  const [providerId, setProviderId] = useState('');
  const [purposeOfConsulttext, setpurposeOfConsulttext] = useState(data?.value !=null?data?.value:" ");
  const [pocId, setPocId] = useState(data?.pocId !=null?data?.pocId:" ");
  const [showPOC, setShowPOC] = useState(false);
  const [location, setLocation] = useState(getProfileDetail?.location[0]?.address);
  const [locationId, setLocationId] = useState(getProfileDetail?.location[0]?.id);
  const [showLocation, setShowLocation] = useState(false);
  const [colorsData] = useState([
    {name: 'Red', hex: '#FF0000'},
    {name: 'Orange', hex: '#FF7F00'},
    {name: 'Yellow', hex: '#FFFF00'},
    {name: 'Green', hex: '#00FF00'},
    {name: 'Blue', hex: '#0000FF'},
    {name: 'Indigo', hex: '#4B0082'},
    {name: 'Voilet', hex: '#9400D3'},
    {name: 'Pink', hex: '#FF69B4'},
    {name: 'Brown', hex: '#964B00'},
  ]);
  const [showCustom, setShowCustom] = useState(false);
  const [oldColor, setOldColor] = useState(colors.blue);
  const [chipColor, setChipColor] = useState(data?.color ? data?.color:"" );
  const [chips, setChips] = useState([]);
  const [posId, setPosId] = useState('');
  const [locations, setLocations] = useState([]);

  //Notification
  const refPreNotification = useRef();
  const refPostNotification = useRef();
  const [preNotification, setPreNotification] = useState(data?.preAppointmentNotify ? data?.postAppointmentNotify?.title :"");
  const [preNotificationId, setPreNotificationId] = useState(data?.preAppointmentNotify ? data?.preAppointmentNotify?.id : null);
  const [postNotification, setPostNotification] = useState(data?.postAppointmentNotify ? data?.postAppointmentNotify?.title :"" );
  const [postNotificationId, setPostNotificationId] = useState(data?.postAppointmentNotify ? data?.postAppointmentNotify?.id :null);

  //per slot
  const refSlot = useRef();
  const [timeData] = useState([
    {time: '30 min', value: 30},
    {time: '40 min', value: 40},
    {time: '50 min', value: 50},
    {time: '1 hour', value: 60},
    {time: '1.5 hour', value: 90},
    {time: '2 hour', value: 120},
  ]);
  const [slot, setSlot] = useState(data?.perSlotTime ? data?.perSlotTime :30);
  const [perSlotTime, setPerSlotTime] = useState(30);
  const [pay, setPay] = useState(data?.perSlotAmount ? data?.perSlotAmount : 0);

  //BACK HANDLER
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () =>
      Snackbar.dismiss(),
    );
    return () => backHandler.remove();
  }, []);
  // GET USER PROFILE DATA
  useEffect(() => {
    const params = {
      user_id: user?.userId,
      from: role,
    };
    dispatch(drGetProfile(params));
    dispatch(getDetail({from: role}));
    dispatch(getNotificationSettings());
    dispatch(getPOS());
    if (role == 'establishment') {
      dispatch(getEstDoctors());
    }
  }, []);
  const clearDoctor=()=>{
    setAddDoctor("")
    setProviderId(""),

    setDoctorData({})
  }

  //SET PROFILE DETAILS DATA
  useEffect(() => {
    setLocations(
      getProfileDetail?.location?.length ? getProfileDetail?.location : [],
    );
    var chips = [];
    getProfileDetail?.purposes?.length
      ? getProfileDetail?.purposes?.map((item, ind) => {
          chips.push({
            value: item?.poc?.title,
            color: item?.color,
            pocId: item?.poc?.id,
            posId: item?.id,
          });
        })
      : [];
    setChips(chips);
  }, [getProfileDetail]);

  // Render of POC
  function rendarPOC({item}) {
    return (
      <TouchableOpacity
        onPress={() => {
          setpurposeOfConsulttext(item.title);
          setPocId(item.id);
          setShowPOC(!showPOC);
        }}>
        <View style={styles.POCArr}>
          <Text style={styles.fontSize(12)}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  // Render of POC LOCATION
  function renderLocation({item}) {
    return (
      <TouchableOpacity
        onPress={() => {
          setLocationId(item.id);
          setLocation(item.address);
          setShowLocation(!showLocation);
        }}>
        <View style={styles.POCArr}>
          <Text style={styles.fontSize(12)}>{item.address}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  //NO RECORD RENDER
  function noRecord() {
    return (
      <TouchableOpacity  onPress={() => {
        purposeOfConsulttext.length
          ? createNewPOC()
          : Snackbar.show({
              text: 'POC title is empty',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: colors.themeColor,
              fontFamily: fonts.PoppinsMedium,
              textColor: colors.dim,
            });
      }} >
         <Text
        style={[
          styles.disabletext,
          styles.mT(10),
          styles.mL(3),
        ]}>{`${labels.clickToAdd} "${purposeOfConsulttext}"`}</Text>
      </TouchableOpacity>
     
    );
  }
  // Purpose of consultation
  const onSearchTyping = (text) => {
    setpurposeOfConsulttext(text);
    if (text.length > 0) {
      const params = {
        title: text.trim(),
      };
      dispatch(searchPOC(params));
    }
  };
  // NEW POC API
  const createNewPOC = () => {
    setShowPOC(false);
    var check = POC.map((item) => item.title).includes(purposeOfConsulttext);
    if (!check) {
      dispatch(createPOC({title: purposeOfConsulttext}, false)).then((res) => {
        if (res.status === 200) {
          setPocId(res?.data?.id);
        }
      });
    }
  };
  // Create Poc Chip
  const createPocChip = () => {
    if (role === 'establishment' && !providerId) {
      Snackbar.show({
        text: labels.validaddDoctor,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
      });
      return false;
    }
    var validation = `${
      !purposeOfConsulttext
        ? labels.validPOC
        : !chipColor
        ? labels.selectColor
        : !locationId
        ? labels.selectLocation
        : true
    }`;
    if (validation === 'true') {
      var check = chips.map((item) => item.pocId).includes(pocId);
      if (check) {
        Snackbar.show({
          text: labels.alreadyHave,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: colors.themeColor,
          fontFamily: fonts.PoppinsMedium,
          textColor: colors.dim,
        });
      } else {
        const payload = {
          pocId: pocId,
          color: chipColor,
          locationId: locationId,
          perSlotTime: perSlotTime,
          perSlotAmount: pay,
        };
        preNotificationId && preNotificationId
          ? (payload['preNotificationId'] = preNotificationId)
          : '',
          postNotificationId && postNotificationId
            ? (payload['postNotificationId'] = postNotificationId)
            : '',
          providerId && providerId ? (payload['providerId'] = providerId) : '',
          console.log(payload, 'ADD POC');
        if (role === 'provider') {
          dispatch(addPOS(payload, true)).then((res) => {
            if (res === 200) {
              dispatch(getDetail({from: role}));
              navigation.goBack();
              successPOC();
            } else {
              console.log('err');
            }
          });
        } else {
          dispatch(addPOSEst(payload, true)).then((res) => {
            if (res === 200) {
              dispatch(getDetail({from: role}));
              navigation.goBack();
              successPOC();
            } else {
              console.log('err');
            }
          });
        }
      }
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
  // edit Poc Chip
  const editPocChip = () => {
    if (role === 'establishment' && !providerId) {
      Snackbar.show({
        text: labels.validaddDoctor,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
      });
      return false;
    }
    var validation = `${
      !purposeOfConsulttext
        ? labels.validPOC
        : !chipColor
        ? labels.selectColor
        : !locationId
        ? labels.selectLocation
        : true
    }`;
    if (validation === 'true') {
      var check = chips.map((item) => item.pocId).includes(pocId);
      // if (check) {
      //   Snackbar.show({
      //     text: labels.alreadyHave,
      //     duration: Snackbar.LENGTH_LONG,
      //     backgroundColor: colors.themeColor,
      //     fontFamily: fonts.PoppinsMedium,
      //     textColor: colors.dim,
      //   });
      // } 
      // else {
        const payload = {
          pocId: pocId,
          locationId: locationId,
          color: chipColor,
          preNotificationId:preNotificationId,
          postNotificationId:postNotificationId,
          perSlotTime: perSlotTime,
          perSlotAmount: pay,
        };
        preNotificationId && preNotificationId
          ? (payload['preNotificationId'] = preNotificationId)
          : '',
          postNotificationId && postNotificationId
            ? (payload['postNotificationId'] = postNotificationId)
            : '',
          providerId && providerId ? (payload['providerId'] = providerId) : '',
          console.log(payload, 'ADD POC');
 
        if (role === 'provider') {
          dispatch(updatePOS( data?.posId,payload, true)).then((res) => {
            if (res === 200) {
              dispatch(getDetail({from: role}));
              navigation.goBack();
              successPOC();
            } else {
              console.log('err');
            }
          });
        } else {
          dispatch(updatePOS(data?.posId,payload, true)).then((res) => {
            if (res === 200) {
              dispatch(getDetail({from: role}));
              navigation.goBack();
              successPOC();
            } else {
              console.log('err');
            }
          });
        }
      
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
  // Toast for Notifications
  const showToast = (type) => {
    if (type == 'est') {
      Snackbar.show({
        text: labels.verifyEstDoc,
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
              type === 'pre' ? {index: 0} : {index: 1},
            );
          },
        },
      });
    }
  };
  //Toast for POC SUCCESS
  const successPOC = (type) => {
    Snackbar.show({
      text: labels.podadded,
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: colors.green1,
      fontFamily: fonts.PoppinsMedium,
      numberOfLines: 4,
      textColor: colors.dim,
    });
  };
  return (
    <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
      <GreadientHeader
        showLeftIcon={true}
        showRightIcon={false}
        showCenterText={labels.pocs}
        showLeftText={labels.back}
        back={true}
        leftRoute={() => {
          Snackbar.dismiss();
          navigation.goBack();
        }}
      />
      <KeyboardAvoidingView
        style={styles.flex(1)}
        behavior={Platform.OS == 'ios' && 'padding'}>
        <ScrollView
          bounces={false}
          style={styles.backgroundColor(colors.themeWhite)}
          showsVerticalScrollIndicator={false}>
          <View style={styles.mH(20)}>
            <Text
              style={[
                styles.availablity,
                styles.fontSize(16),
                styles.mT(20),
                styles.mL(0),
              ]}>
              {from==="edit"?labels.editPOC:labels.addNewPOC}
            </Text>
            <View style={styles.height(25)} />
            {/* ADD PROVIDER  */}
            {role === 'establishment' && (
              <>
                <Text
                  style={[
                    styles.availablityHeading,
                    styles.mB(10),
                    styles.fontSize(14),
                    styles.margin(0),
                  ]}>
                  {labels.addDoctor}
                </Text>
                <View style={[styles.availCont1, styles.mL(10)]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.dropDown, styles.flex(1)]}
                    onPress={() =>
                      establishmentDoctor?.filter(
                        (e) => e?.status === 'accepted',
                      ).length
                        ? refPicker4.current.show()
                        : showToast('est')
                    }>
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
                  titleStyle={styles.profileText}
                  itemStyle={styles.pickerItem1}
                  pickerRef={refPicker4}
                  value={addDoctor}
                  title={labels.addDoctor}
                  items={establishmentDoctor
                    ?.filter((e) => e?.status === 'accepted')
                    .map((e) => 
                    
                    
                    
                 
                  
                     e.provider?.fullName
                 
                    
                    
                    )}
                  selectedColor={colors.themeColor}
                  onValueChange={(value, i) => {
                    setAddDoctor(value);
                    establishmentDoctor
                      ?.filter((e) => e.provider?.fullName === value)
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
              <View
                style={[
                  styles.PatientArr,
                  styles.backgroundColor(colors.white),
                ]}>
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
                <TouchableOpacity
                  style={styles.justifyContent}
                  onPress={() => clearDoctor()}>
                  <Image source={assets.cross} />
                </TouchableOpacity>
              </View>
            )}
            <Text
              style={[
                styles.availablityHeading,
                styles.mT(5),
                styles.mB(10),
                styles.fontSize(14),
                styles.margin(0),
              ]}>
              {from==="edit"?labels.editPOC:labels.addNewPOC}
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
              onSubmitEditing={(e) => Keyboard.dismiss()}
              rightIconContainerStyle={{width: 30}}
              // rightIcon={
              //   <TouchableOpacity
              //     activeOpacity={0.7}
              //     style={{zIndex: 100}}
              //     onPress={() => {
              //       purposeOfConsulttext.length
              //         ? createNewPOC()
              //         : Snackbar.show({
              //             text: 'POC title is empty',
              //             duration: Snackbar.LENGTH_LONG,
              //             backgroundColor: colors.themeColor,
              //             fontFamily: fonts.PoppinsMedium,
              //             textColor: colors.dim,
              //           });
              //     }}>
              //     <Image source={assets.plus} />
              //   </TouchableOpacity>
              // }
            />
            {showPOC ? (
              <View style={styles.POCView}>
                <FlatList
                  nestedScrollEnabled={true}
                  data={POC}
                  renderItem={rendarPOC}
                  keyExtractor={(item) => item.title}
                  ListEmptyComponent={noRecord()}
                />
              </View>
            ) : null}

            {/* Color Picker */}
            <View style={[styles.flexRow, styles.justifyCntSP]}>
              <Text
                style={[
                  styles.availablityHeading,
                  styles.mT(5),
                  styles.fontSize(14),
                  styles.margin(0),
                ]}>
                {labels.color}
              </Text>
              <View style={styles.flexRow}>
                <View
                  style={[
                    styles.pocColor,
                    {overflow: 'hidden', backgroundColor: chipColor},
                  ]}
                />
                <Text
                  onPress={() => setShowCustom(!showCustom)}
                  style={[
                    styles.availablityHeading,
                    styles.mT(5),
                    styles.fontSize(12),
                    styles.margin(0),
                    styles.mL(5),
                  ]}>
                  {showCustom ? labels.hide : labels.addCustom}
                </Text>
              </View>
            </View>
            <View style={[styles.colorView]}>
              {colorsData.map((item, index) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setOldColor(item.hex);
                      setChipColor(tinycolor(item.hex).toHexString());
                    }}>
                    <View
                      style={[
                        styles.pocColor,
                        styles.backgroundColor(item.hex),
                      ]}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
            {showCustom ? (
              <>
                <View style={[styles.height(12), styles.width_Percent('95%')]}>
                  <SliderSaturationPicker
                    oldColor={oldColor}
                    trackStyle={[
                      styles.height(12),
                      styles.width_Percent('95%'),
                    ]}
                    thumbStyle={styles.thumb}
                    useNativeDriver={true}
                    onColorChange={(e) => {
                      setOldColor(e);
                      setChipColor(tinycolor(e).toHexString());
                    }}
                    style={[
                      styles.height(12),
                      styles.bR(6),
                      styles.backgroundColor(
                        tinycolor({
                          h: tinycolor(oldColor).toHsv().h,
                          s: 1,
                          v: 1,
                        }).toHexString(),
                      ),
                    ]}
                  />
                </View>
                <View style={[styles.slideHuePicker, styles.mL(10)]}>
                  <SliderHuePicker
                    oldColor={oldColor}
                    trackStyle={[
                      styles.height(12),
                      styles.width_Percent('95%'),
                    ]}
                    thumbStyle={styles.thumb}
                    useNativeDriver={true}
                    onColorChange={(e) => {
                      setOldColor(e);
                      setChipColor(tinycolor(e).toHexString());
                    }}
                  />
                </View>
              </>
            ) : null}
            {/* LOCATION */}
            <Text
              style={[
                styles.availablityHeading,
                styles.mT(5),
                styles.fontSize(14),
                styles.margin(0),
                styles.mB(10),
              ]}>
              {labels.selectLocation}
            </Text>
            <View
              style={[
                styles.countryFeildCont,
                styles.width_Percent('95%'),
                styles.alignSelf,
              ]}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.dropDown, styles.flex(1)]}
                onPress={() => setShowLocation(!showLocation)}>
                <View style={[styles.flexRow]}>
                  <View style={[styles.leftFeild, styles.flex(0.8)]}>
                    <Text
                      style={[
                        styles.dropDownText,
                        styles.textNoti,
                        styles.mL(15),
                        styles.color(
                          location === '' ? colors.subText : colors.heading,
                        ),
                      ]}>
                      {location === '' ? labels.selectLocation : location}
                    </Text>
                  </View>
                  <View style={[styles.rightArrowDown, styles.flex(0.2)]}>
                    <Icon
                      name={showLocation ? 'chevron-up' : 'chevron-down'}
                      color={colors.heading}
                      type="evilicon"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            {showLocation && (
              <View style={[styles.POCView, styles.mT(5)]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <FlatList
                    data={locations}
                    renderItem={renderLocation}
                    keyExtractor={(item) => item.address}
                    ListEmptyComponent={noRecord}
                  />
                </ScrollView>
              </View>
            )}
            {/* TIME SLOT */}
            <Text style={[styles.availablityHeading, styles.mB(7)]}>
              {labels.selectSlot}
            </Text>
            <View style={[styles.countryFeildCont]}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.dropDown, styles.flex(0.6)]}
                onPress={() => refSlot.current.show()}>
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
                  onSubmitEditing={(e) => {}}
                />
              </View>
            </View>
            <ReactNativePickerModule
              titleStyle={styles.profileText}
              itemStyle={styles.pickerItem1}
              pickerRef={refSlot}
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
            {/* Pre Notification */}
            <Text style={[styles.availablityHeading, styles.mB(7)]}>
              {labels.preNotification}
            </Text>
            <View style={[styles.availCont1, styles.flex(0)]}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.dropDown, styles.flex(1)]}
                onPress={() =>
                  notificationSetting?.filter(
                    (filter) => filter.type === 'pre-appointment',
                  ).length > 0
                    ? refPreNotification.current.show()
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
                pickerRef={refPreNotification}
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
                    ? refPostNotification.current.show()
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
                pickerRef={refPostNotification}
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
              title={labels.add}
              onBtnPress={() => {

            if(from==='edit')
              {
                editPocChip()

              }else{

              createPocChip()
              }
              }
              
              }
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
export default DrAddPOC;
