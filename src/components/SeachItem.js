import React, {useState, useEffect, useRef} from 'react';
import {Rating} from 'react-native-elements';
import ImageLoad from 'react-native-image-placeholder';
import styles from '../assets/styles';
import {assets} from '../assets/images';
import colors from '../config/Colors';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  FlatList,
  Modal,
} from 'react-native';
import {Category, ButtonWhite, ButtonSmall} from '.././components';
import labels from '../config/Labels';
import Snackbar from 'react-native-snackbar';
import ButtonGradient from './Button1';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {distanceCount} from '../config/Distance';
import {getSlotsByDate, SaveDoctor} from '../store/actions';
import fonts from '../assets/fonts';

const SearchItem = ({
  navigation,
  image,
  providerId,
  title = false,
  subText = false,
  category = false,
  slots = false,
  rating,
  schedule,
  consultationTypeId,
  consultationPurposeId,
  availiablityDate,
  availiablityTime,
  doctorDetail,
  gradiendent = false,
  onPress = () => {},
  showRating = true,
  enableCategory = false,
  est = false,
  doctor,
  activeOpacity = 0.7,
}) => {
  //Store
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.Auth);
  const {
    getAppointmentSlots
  } = useSelector(state => state.Patient)
  // console.log("get appointments====",getAppointmentSlots)

  // Declare state variables'
  const [servieId, setServieId] = useState([]);
  const [countSlots, setCountSlots] = useState(0);
  const [distance, setDistance] = useState(0);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [showPOC, setShowPOC] = useState(false);
  const [pocData, setPocData] = useState({});
  const [updatedSlots,setUpdatedSlots]=useState(getAppointmentSlots)




  const getSlotsData= async(e)=>{
    const param = {
      id: providerId,
      // date: availiablityDate?availiablityDate:e,
      date: e,
      consultationTypeId:"",
      pocId:"",
      time:""
    };

    await dispatch(getSlotsByDate(param, false)).then((response) => {
      if (response !== 400) {
      // setUpdatedSlots(response?.data?.data)
      setUpdatedSlots(getAppointmentSlots)
        // updatedSlots = response?.data?.data;
        // updatedSlots=getAppointmentSlots;
      } else if (response === 400) {
        setUpdatedSlots([])
        // updatedSlots = [];
      }
    });

  }




  const onDateSelected = async (e) => {

    // const param = {
    //   id: providerId,
    //   date: availiablityDate?availiablityDate:e,
    //   consultationTypeId:consultationTypeId,
    //   pocId:consultationPurposeId,
    //   time:availiablityTime
    // };
    // // var updatedSlots = [];
    // await dispatch(getSlotsByDate(param, false)).then((response) => {
    //   if (response !== 400) {
    //   // setUpdatedSlots(response?.data?.data)
    //   setUpdatedSlots(getAppointmentSlots)
    //     // updatedSlots = response?.data?.data;
    //     // updatedSlots=getAppointmentSlots;
    //   } else if (response === 400) {
    //     setUpdatedSlots([])
    //     // updatedSlots = [];
    //   }
    // });
    const selectionDate = moment(new Date(e)).format('YYYY-MM-DD');
    const filterSchedule = schedule?.filter(
      (t) => t?.consultationDate === selectionDate,
    );
    const slots = filterSchedule?.length ? filterSchedule?.map((t) => t) : [];

    const data = getAppointmentSlots
      .sort((a, b) => {
        let tme = moment.utc(a?.startTime, ['HH:mm k']).format('HH:mm');
        let endtme = moment.utc(b?.endTime, ['HH:mm k']).format('HH:mm');

        return (
          moment.utc(a.consultationDate + ' ' + tme) -
          moment.utc(b.consultationDate + ' ' + endtme)
        );
      })
      .map((z, b) => {
        return {
          ...z,
          consultationType: z?.schedule?.consultationType,
          key: b + 1,
          text: `${moment(z?.startTime, ['hh:mm k']).format(
            'hh:mm A',
          )} to ${moment(z?.endTime, ['hh:mm k']).format('hh:mm A')}`,
          servieId: z?.id,
          selectedTime: `${z?.consultationDate} ${moment(z?.startTime, [
            'hh:mm k',
          ]).format('hh:mm A')}`,
          walkin:
            z?.schedule?.consultationType?.title === 'Video Call'
              ? false
              : true,
        };
      });
    // console.log(data, 'data')
    setSelectedSlots(data || []);

    setCountSlots(
      data?.length <= 9 ? '0' + data?.length : data?.length || '00',
    );
  };
 
  // console.log(selectedSlots, "slots")
  // set current date and get directions
  useEffect( () => {
   
    setUpdatedSlots(getAppointmentSlots)

    onDateSelected(
      moment(schedule?.[0]?.consultationDate).format('YYYY-MM-DD'),
    ); // get initial date slots
  }, [getAppointmentSlots]);
  
  useEffect( () => {
   
    setUpdatedSlots(getAppointmentSlots)
   

    // getSlotsData(
    //   moment(schedule?.[0]?.consultationDate).format('YYYY-MM-DD'),
    // ); // get initial date slots
  }, []);
  
useEffect(() => {
  (async() => {
    await getDirection();
  })()
}, [])

  //Action for Get Directions
  const getDirection = async () => {
    const position = await AsyncStorage.getItem('position');

    const current = {
      latitude: JSON.parse(position).coords.latitude,
      longitude: JSON.parse(position).coords.longitude,
    };
    // console.log("user Location===========>",current)
    const drLocation = {
      latitude: doctorDetail.location[0].latitude,
      longitude: doctorDetail.location[0].longitude,
    };
    // console.log("Dr Location===========>",drLocation)
    const distance = distanceCount(current, drLocation);
    setDistance(distance);
  };

  //Action for POC selection
  const onSelectionPOC = (item) => {
    const service = selectedSlots.filter((text) => text.status);
    const selected = service.filter((text) => text.servieId === item);
    setPocData(selected?.[0]);
    if (
      moment(selected?.[0].selectedTime, 'YYYY-MM-DD hh:mm A').valueOf() <=
      moment().valueOf()
    ) {
      showToast();
    } else {
      if (Object.values(user).length > 0) {
        setShowPOC(true);
      } else {
        // console.log(doctor)
        dispatch(SaveDoctor(doctor, navigation));
      }
    }
  };
  const nav = () => {
    // console.log(pocData)
    navigation.navigate('LovedOne', {
      from: true,
      serviceId: pocData?.servieId,
      purposeId: pocData?.schedule?.purposes?.id,
      providerId: pocData?.providerId,
      consultationId: pocData?.consultationType?.id,
      perSlotAmount: pocData?.schedule?.perSlotAmount,
      consultationTypeId: pocData?.consultationType?.id,
      postAppointmentNotify: pocData?.schedule?.postAppointmentNotify,
      preAppointmentNotify: pocData?.schedule?.preAppointmentNotify,
      walkin: pocData?.walkin,
    });
  };

  const showToast = () => {
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
  };
  function capitalizeFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
  }
  // console.log(pocData);
  return (
    <>
      <TouchableOpacity activeOpacity={activeOpacity}>
        <View style={[styles.mV(10), styles.mH(20),]}>
          <View
            style={[
              styles.ListItmCont,
              styles.flex(1),
              styles.bR(20),
              styles.padding(10),
              styles.shadowbb,
            ]}>
            <View style={[styles.rowCont]}>
              <View style={(styles.flex(1), styles.alignItems('flex-start'))}>
                <ImageLoad
                  source={image ? {uri: image} : assets.dummy}
                  placeholderStyle={styles.ListImg}
                  style={[styles.ListImg, {width: 80, height: 80}]}
                  borderRadius={Platform.OS === 'ios' ? 50 : 50}
                  loadingStyle={{size: 'small', color: colors.themeColor}}
                />
              </View>
              <View style={[styles.flex(1), styles.flexRow]}>
                <View style={[styles.flex(5), styles.mL(5)]}>
                  <Text
                    style={styles.textSearchTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {title}
                  </Text>
                  <Text
                    style={styles.textSearchSub}
                    numberOfLines={2}
                    ellipsizeMode={'tail'}>
                    {category}
                  </Text>
                  <Text
                    style={[styles.textLight, styles.textTransformCap]}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}>
                    {subText}
                  </Text>
                </View>
                {showRating && (
                  <View
                    style={[
                      styles.alignItemsFlexend,
                      styles.mT(5),
                      styles.mR(5),
                    ]}>
                    <View style={styles.flexRow}>
                      <Text
                        style={[
                          styles.slots,
                          styles.mR(4),
                          styles.color(colors.grey),
                        ]}>
                        {distance} km
                      </Text>
                      <Image source={assets.redPin} />
                    </View>
                    <View style={[styles.flexRow]}>
                      <Text
                        style={[
                          gradiendent == true
                            ? [styles.textBlack, styles.color(colors.white)]
                            : styles.textBlack,
                          styles.mR(5),
                          styles.fontSize(12),
                          slots ? styles.mT(3) : styles.mT(18),
                        ]}>
                        {rating}
                      </Text>
                      <Rating
                        type="custom"
                        ratingColor="#fec311"
                        ratingBackgroundColor={colors.grey}
                        tintColor={
                          gradiendent == true ? '#46C1FB' : colors.white
                        }
                        readonly
                        startingValue={4}
                        ratingCount={5}
                        imageSize={15}
                      />
                    </View>
                  </View>
                )}
              </View>
            </View>
            {est ? null : (
              <>
                <View style={[styles.slotsContainerAvailable]}>
                  <Text
                    style={[
                      styles.textMedium,
                      styles.fontSize(16),
                      styles.color(colors.darkBlue),
                      styles.mL(5),
                      styles.mT(10),
                    ]}>
                    {labels.availableSlots}
                  </Text>
                  {countSlots !== -1 && (
                    <View style={styles.slotsBedge}>
                      <Text
                        style={[
                          styles.slotsBedgeText,
                          styles.textMedium,
                          styles.fontSize(16),
                          styles.color(colors.darkBlue),
                        ]}>
                        {countSlots}
                      </Text>
                    </View>
                  )}
                </View>
                <CustomCalendarView
                  datesGet={schedule}
                  onDateSelected={(e) => {
                    getSlotsData(e);
                    onDateSelected(e);
                    
                  }}
                />

                <Category
                  enableCategory={enableCategory}
                  time={true}
                  options={selectedSlots.filter((text) => text.status)}
                  isSelected={servieId}
                  onItemPress={(value, ind) => {
                    onSelectionPOC(value);
                  }}
                />
              </>
            )}

            <ButtonGradient
              title={labels.viewDetail}
              type={false}
              gradient={true}
              onBtnPress={onPress}
            />
          </View>
          <Modal
            animationType="fade"
            visible={showPOC}
            transparent={true}
            onRequestClose={() => {
              setShowPOC(false);
            }}>
            <View style={styles.centeredView}>
              <View style={[styles.notificationView, styles.shadowbb]}>
                <TouchableOpacity
                  hitSlop={styles.hitSlop}
                  style={styles.imageCross}
                  onPress={() => setShowPOC(false)}>
                  <Image source={assets.cross} />
                </TouchableOpacity>
                <View style={[styles.mT(10)]}>
                  <Text
                    style={[
                      styles.h2,
                      styles.textAlign,
                      {textTransform: 'capitalize'},
                    ]}>
                    {labels.slotDetail}
                  </Text>
                  <Text style={[styles.h3, styles.color(colors.heading)]}>
                    {`${labels.bookingDate}: ${moment(
                      pocData?.consultationDate,
                    ).format('ll')}`}
                  </Text>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      styles.paragraph2,
                      styles.mL(10),
                      {textTransform: 'capitalize'},
                    ]}>
                    {`${labels.purpose}: ${pocData?.schedule?.purposes?.poc?.title}`}
                  </Text>
                  <Text style={[styles.paragraph2, styles.mL(10)]}>
                    {`${labels.time}: ${pocData?.text}`}
                  </Text>
                  <Text style={[styles.paragraph2, styles.mL(10)]}>
                    {`${labels.timeSlot}: ${pocData?.schedule?.perSlotTime} min`}
                  </Text>
                  <Text style={[styles.paragraph2, styles.mL(10)]}>
                    {`${labels.slotAmount}: ${pocData?.schedule?.perSlotTime}`}
                  </Text>
                  <Text style={[styles.paragraph2, styles.mL(10)]}>
                    {`${labels.consultaionType}: ${pocData?.consultationType?.title}`}
                  </Text>
                  <View
                    style={[
                      styles.flexRow,
                      styles.alignSelf,
                      styles.mH(45),
                      styles.mT(5),
                    ]}>
                    <ButtonWhite
                      exstyle={styles.shadowbb}
                      title={labels.no}
                      onBtnPress={() => setShowPOC(false)}
                    />
                    <ButtonSmall
                      title={labels.yes}
                      onBtnPress={() => {
                        setShowPOC(false);
                        nav();
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableOpacity>
    </>
  );
};
export default SearchItem;



export const CustomCalendarView = ({datesGet, onDateSelected = () => {}}) => {
  const [current, setCurrent] = useState(datesGet?.consultationDate);
  
  const scrollRef = useRef();
  const onDateSelectedLocal = (date) => {
    setCurrent(date);

    onDateSelected(date);
  };
  return (
    <>
      <FlatList
        ref={scrollRef}
        data={datesGet && datesGet}
        horizontal={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        ListFooterComponent={() => <View style={{width: 50}}></View>}
        // nestedScrollEnabled
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={[
              styles.calenderDatesStyle,
              styles.selectedDate(
                current === item?.consultationDate ? true : false,
              ),
            ]}
            onPress={() => {
              onDateSelectedLocal(item?.consultationDate),
                scrollRef?.current?.scrollToIndex({
                  animated: true,
                  index: index,
                });
            }}>
            <View style={styles.calenderDatesDot} />
            <Text style={styles.CustomeDateTxt}>
              {moment(item?.consultationDate, ['YYYY MM DD']).format('ll')}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[styles.disabletext, styles.mT(10)]}>
            {labels.notFound}
          </Text>
        }
      />
    </>
  );
};
