import React, {useEffect, useRef, useState} from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  Modal,
  TouchableOpacity,
} from 'react-native'
import styles from '../../assets/styles'
import {assets} from '../../assets/images'
import Snackbar from 'react-native-snackbar'
import labels from '../../config/Labels'
import fonts from '../../assets/fonts'
import colors from '../../config/Colors'
import {
  GreadientHeader,
  ButtonGradient,
  TabBarr,
  TextCont,
  Category,
  SearchItem,
  ReviewItem,
  ButtonWhite,
  ButtonSmall,
} from '../../components'
import {useDispatch, useSelector} from 'react-redux'
import {
  searchDoctorProfile,
  searchEstDoctorProfile,
  getPatientEstDoctors,
  getReviews,
  getSlotsByDate,
} from '../../store/actions'
import {Rating} from 'react-native-elements'
import moment from 'moment'
import {CustomCalendarView} from '../../components/SeachItem'

const Profile = ({navigation, route}) => {
  //Redux Store
  const dispatch = useDispatch()
  const {user} = useSelector(state => state.Auth)
  const {
    searchDoctorProfile: doctorProfile,
    patientEstDoctors,
    reviews,
    doctorList
  } = useSelector(state => state.Patient)

  // Declare state variables'
  const [est] = useState(route?.params?.est)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedSlots, setSelectedSlots] = useState([])
  const [countSlots, setCountSlots] = useState('00')
  const [servieId, setServieId] = useState(null)
  const [showPOC, setShowPOC] = useState(false)
  const [pocData, setPocData] = useState({})
  const [TabsList] = useState([
    {name: labels.about},
    {name: est ? labels.estDoctor : labels.availabilty},
    {name: labels.location},
    {name: labels.reviews},
  ])


  //Functions and API

  // Get Doctor Profile Detail API
  useEffect(() => {
    const id = route?.params?.id
    console.log("provider id======>",id)
    if (est) {
      dispatch(searchEstDoctorProfile({id}))
      dispatch(getPatientEstDoctors({id}))
    } else {
      dispatch(searchDoctorProfile({id}))
      dispatch(getReviews({id}))
    }
    onDateSelected(doctorList?.[0]?.schedule?.length > 0 && doctorList?.[0]?.schedule?.[0]?.consultationDate)
    // onDateSelected(moment(new Date()).format('YYYY-MM-DD'))
  }, [])

  // Date Selection
  const onDateSelected = async e => {
    const id = route?.params?.id
    const param = {
      id: id,
      date: e,
      pocId:"",
      time:"",
      consultationTypeId:""
    }
    var updatedSlots = []
    await dispatch(getSlotsByDate(param, false)).then(response => {
      if (response !== 400) {
        updatedSlots = response?.data?.data
      } else if (response === 400) {
        updatedSlots = []
      }
    })

    const selectionDate = moment(new Date(e)).format('YYYY-MM-DD')
    const filterSchedule = doctorProfile?.schedule?.filter(
      t => t.consultationDate === selectionDate,
    )

    const slots = filterSchedule?.length ? filterSchedule?.map(t => t) : []
    const data = updatedSlots.length
      ? updatedSlots?.sort((a,b) => {
     
        let tme = moment.utc(a?.startTime, ['HH:mm k']).format('HH:mm')
        let endtme = moment.utc(b?.endTime, ['HH:mm k']).format('HH:mm')
       
     
        return moment.utc(a.consultationDate+" "+tme) - moment.utc(b.consultationDate+" "+endtme)
      }).map((z, b) => {
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
            walkin: z?.schedule?.consultationType?.title !== 'Video Call',
          }
        })
      : []
    setSelectedSlots(data || [])
    setCountSlots(data?.length <= 9 ? '0' + data?.length : data?.length || '00')
    // console.log(data)
  }

  //Action for POC selection
  const onSelectionPOC = item => {
    const service = selectedSlots.filter(text => text.status)
    const selected = service.filter(text => text.servieId === item)
    setPocData(selected?.[0])
    if (
      moment(selected?.[0].selectedTime, 'YYYY-MM-DD hh:mm A').valueOf() <=
      moment().valueOf()
    ) {
      showToast()
    } else {
      if (Object.values(user).length > 0) {
        setShowPOC(true)
      } else {
        navigation.replace('LoginStack', {screen: 'Login'})
      }
    }
  }

  //Toast validations
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
          Snackbar.dismiss()
        },
      },
    })
  }

  // navigation handling
  const nav = () => {
    navigation.navigate('LovedOne', {
      from: true,
      serviceId: servieId,
      purposeId: pocData?.schedule?.purposes?.id,
      providerId: pocData?.providerId,
      consultationId: pocData?.consultationType?.id,
      perSlotAmount: pocData?.schedule?.perSlotAmount,
      consultationTypeId: pocData?.consultationType.id,
      postAppointmentNotify: pocData?.schedule?.postAppointmentNotify,
      preAppointmentNotify: pocData?.schedule?.preAppointmentNotify,
      walkin: pocData?.walkin,
    })
  }

  return (
    <>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <GreadientHeader
          showLeftIcon={true}
          showCenterText={labels.profile}
          showLeftText={labels.back}
          leftRoute={() => navigation.goBack()}
          back={true}
          profile={true}
          title={
            est
              ? doctorProfile?.name
              : doctorProfile?.firstName
              ? `Dr. ${doctorProfile?.fullName}`
              : ''
          }
          category={doctorProfile?.detail?.specialities}
          profileImage={doctorProfile?.avatar}
          subText={`${doctorProfile?.city} ${doctorProfile?.country}`}
          rating={doctorProfile?.rating ? doctorProfile?.rating : 0}
        />
        <View style={[styles.height(100)]} />
        <TabBarr
          Tab={TabsList.map(item => item.name)}
          handelSelection={e => {
            setSelectedIndex(e)
          }}
          index={selectedIndex}
        />
        {selectedIndex === 0 && (
          <View style={styles.mH(25)}>
            <TextCont
              heading={labels.aboutme}
              isParaghaph={true}
              paragraph={
                doctorProfile?.detail?.aboutUS
                  ? doctorProfile?.detail?.aboutUS
                  : labels.notFound
              }
            />
            <View style={[styles.spacer]} />
            <TextCont
              heading={labels.languageSpoken}
              points={true}
              list={true}
              data={
                doctorProfile?.detail?.spokenLanguages
                  ? doctorProfile?.detail?.spokenLanguages
                  : []
              }
            />
            <View style={[styles.spacer]} />
            <TextCont
              heading={labels.speciallizes}
              points={true}
              list={true}
              data={
                doctorProfile?.detail?.specaillizesIn
                  ? doctorProfile?.detail?.specaillizesIn
                  : []
              }
            />
            <View style={[styles.spacer, styles.mT(20)]} />
            <TextCont
              heading={labels.consulation}
              consultation={true}
              data={
                doctorProfile?.detail?.consultationFees
                  ? doctorProfile?.detail?.consultationFees
                  : []
              }
            />
            <View style={[styles.spacer, styles.mT(20)]} />
            <TextCont
              heading={labels.qualification}
              points={true}
              list={true}
              numberOfLines={2}
              data={
                doctorProfile?.detail?.qualifications
                  ? doctorProfile?.detail?.qualifications
                  : []
              }
            />
          </View>
        )}

        {selectedIndex === 1 && (
          <View>
            {est ? (
              <>
                <Text style={[styles.availablityHeading, styles.mB(7)]}>
                  {labels.selectDoctor}
                </Text>
                <FlatList
                  ListEmptyComponent={
                    <View style={[styles.pT(40), styles.alignItemCenter]}>
                      <Text style={styles.paragraph}>{labels.noData}</Text>
                    </View>
                  }
                  scrollEnabled={true}
                  data={patientEstDoctors}
                  renderItem={({item, index}) => (
                    <>
                      <SearchItem
                        activeOpacity={1}
                        navigation={navigation}
                        title={`${item?.provider?.firstName} ${item?.provider?.lastName}`}
                        category={item?.provider?.cat}
                        subText={item?.provider?.text}
                        providerId={item?.provider?.id}
                        doctorDetail={item?.provider?.detail}
                        slots={item?.provider?.slots}
                        schedule={item?.provider?.schedule}
                        rating={item?.provider?.ratting}
                        enableCategory={item?.provider?.enableCategory}
                        image={item?.avatar}
                        est={true} //hide schedules
                        onPress={
                          () =>
                            navigation.push('Profile', {
                              id: item?.provider?.id,
                              est: false,
                              key: Math.random(),
                            })
                          // navigation.setParams('Profile', {
                          // id: item?.provider?.id,
                          // est: false,
                          // })
                        }
                      />
                    </>
                  )}
                />
              </>
            ) : (
              <>
                <View style={[styles.slotsContainerAvailable, styles.mH(25)]}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={[styles.h2, styles.mT(18)]}>
                    {labels.availablity}
                  </Text>
                </View>
                <CustomCalendarView
                  datesGet={doctorProfile?.schedule}
                  onDateSelected={e => onDateSelected(e)}
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
                <View style={[styles.mH(25), styles.mB(10)]}>
                  <Category
                    time={true}
                    options={selectedSlots}
                    isSelected={servieId}
                    onItemPress={(value, ind) => {
                      setServieId(value)
                    }}
                  />
                </View>
              </>
            )}
          </View>
        )}

        {selectedIndex === 2 && (
          <View style={styles.mH(25)}>
            <TextCont
              heading={labels.location + 's:'}
              location={true}
              data={doctorProfile?.location ? doctorProfile?.location : []}
            />
          </View>
        )}
        {selectedIndex === 3 && (
          <View style={styles.reviewsWrapper}>
            <FlatList
              ListEmptyComponent={
                <View style={[styles.pT(40), styles.alignItemCenter]}>
                  <Text style={styles.paragraph}>{labels.noData}</Text>
                </View>
              }
              scrollEnabled={true}
              data={reviews}
              renderItem={({item, index}) => (
                <ReviewItem
                  image={item?.patient?.avatar}
                  title={
                    item?.patient?.firstName + ' ' + item?.patient?.lastName
                  }
                  rating={item?.rate}
                  date={item?.createdAt}
                  description={item?.review}
                />
              )}
            />
          </View>
        )}
        <Modal
          animationType='fade'
          visible={showPOC}
          transparent={true}
          onRequestClose={() => {
            setShowPOC(false)
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
                  ellipsizeMode='tail'
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
                      setShowPOC(false)
                      nav()
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
      <View style={[styles.pH(0), styles.bottom(0)]}>
        {selectedIndex === 1 && (
          <ButtonGradient
            gradient={true}
            bottom={true}
            disabled={servieId === null}
            title={labels.bookAppointment}
            onBtnPress={() => onSelectionPOC(servieId)}
          />
        )}
      </View>
    </>
  )
}
export default Profile
