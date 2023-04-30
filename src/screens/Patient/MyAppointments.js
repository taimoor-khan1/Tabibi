import React, {useEffect, useRef, useState} from 'react'
import {View, Image, BackHandler, ScrollView, FlatList} from 'react-native'
import styles from '../../assets/styles'
import {assets} from '../../assets/images'
import labels from '../../config/Labels'
import colors from '../../config/Colors'
import {
  GreadientHeader,
  TabBarr,
  ListItem,
  NoRecordComponent,
} from '../../components'
import {useDispatch, useSelector} from 'react-redux'
import {getAnAppointment} from '../../store/actions'
import moment from 'moment'

const MyAppointments = ({navigation, route}) => {
  //Redux Store
  const dispatch = useDispatch()
  const {appointmentList, providersList, lovedOneById} = useSelector(
    state => state.Patient,
  )
  // Declare state variables'
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [appointments, setAppointments] = useState([])
  const [status, setStatus] = useState('booked')
  const [TabsList] = useState([
    {name: labels.upcommings},
    {name: labels.current},
    {name: labels.past},
  ])

  //Fuctions

  //SEt APPOINTMENTS LIST
  useEffect(() => {
    if (appointmentList.length > 0) {
      var userData = {}
      providersList.map(item => {
        userData = {...userData, [item.id]: item}
      })
      var provider = appointmentList
      var loveOnes = lovedOneById
      const keys = Object.keys(userData)
      const providerExist =
        provider && provider.filter(item => keys.includes(item?.providerId))
      const loveOneExist = {}
      loveOnes &&
        loveOnes.map(item => {
          loveOneExist[item.id] = item
        })
      provider =
        providerExist &&
        providerExist
          // .filter((e) => e.consultationTypeId === id)
          .map((item, index) => {
            var data = userData[item?.providerId]
            return {
              ...item,
              provider: data,
              loveOne: loveOneExist[item?.lovedOneId] || false,
            }
          })
      // console.log(providersList, 'data', userData, 'keys');

      //Sorting
      const sorted = provider.sort((a, b) => {
        const dateA = new Date(`${a.createdAt}`).valueOf()
        const dateB = new Date(`${b.createdAt}`).valueOf()
        if (dateA < dateB) {
          return 1
        }
        return -1
      })
      setAppointments(sorted)
      // console.log(sorted)
    } else {
      setAppointments([])
    }
  }, [appointmentList, providersList, lovedOneById])
  //Get Appointments
  useEffect(() => {
    dispatch(getAnAppointment({status}, true))
  }, [status])

  //BACK HANDLER
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () =>
      onBackComponent(navigation),
    )
    return () => backHandler.remove()
  }, [])

  const onBackComponent = navigation => {
    navigation.reset({
      index: 0,
      routes: [{name: 'DrawerStack'}],
    })
    return true
  }
   console.log(appointments, 'appointments');
  return (
    <View style={[styles.flex(1), styles.backgroundColor(colors.white)]}>
      <GreadientHeader
        showLeftIcon={true}
        showCenterText={labels.appointment}
        showLeftText={labels.back}
        leftRoute={() =>
          navigation.reset({
            index: 0,
            routes: [{name: 'DrawerStack'}],
          })
        }
        back={true}
      />

      <View style={[styles.height(20)]} />
      <TabBarr
        Tab={TabsList.map(item => item.name)}
        handelSelection={e => {
          setSelectedIndex(e)
          setStatus(
            e === 0
              ? 'booked'
              : e === 1
              ? 'completed'
              : e === 2
              ? 'canceled'
              : 'booked',
          )
        }}
        index={selectedIndex}
      />
      <View style={[styles.height(20)]} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedIndex == 0 && (
          <FlatList
            scrollEnabled={true}
            data={appointments}
            showsHorizontalScrollIndicator={false}
            style={styles.flex(1)}
            ListEmptyComponent={
              <View style={styles.mT(150)}>
                <NoRecordComponent />
              </View>
            }
            renderItem={({item, index}) => (
              console.log(item,"provider"),
              <>
                <ListItem
                  image={item?.provider?.avatar}
                  title={`Dr. ${item?.provider?.firstName} ${item?.provider?.lastName}`}
                  lovedOne={
                    item?.lovedOneId != null
                      ? `${item?.loveOne?.firstName} ${item?.loveOne?.lastName}`
                      : false
                  }
                  relation={
                    item?.lovedOneId != null ? item?.loveOne?.relation : false
                  }
                  category={item?.detail?.specialities}
                  subText={moment(item?.startTime).format('DD MMM YYYY')}
                  rating={item?.provider?.rating ? item?.provider?.rating : 0}
                  status={status}
                  aTime={`${moment(item?.startTime)
                    .utc()
                    .format('hh:mm A')} to ${moment(item?.endTime)
                    .utc()
                    .format('hh:mm A')}`}
                  horizontal={true}
                  onPress={() =>
                    navigation.navigate('PatientConsulationDetail', {
                      data: item,
                      status: status,
                    })
                  }
                />
              </>
            )}
          />
        )}
        {selectedIndex == 1 && (
          <FlatList
            scrollEnabled={true}
            data={appointments}
            showsHorizontalScrollIndicator={false}
            style={styles.flex(1)}
            ListEmptyComponent={
              <View style={styles.mT(150)}>
                <NoRecordComponent />
              </View>
            }
            renderItem={({item, index}) => (
              console.log(item?.provider?.rating,"provider1"),
              <>
                <ListItem
                  image={item?.provider?.avatar}
                  title={`Dr. ${item?.provider?.firstName} ${item?.provider?.lastName}`}
                  lovedOne={
                    item?.lovedOneId != null
                      ? `${item?.loveOne?.firstName} ${item?.loveOne?.lastName}`
                      : false
                  }
                  relation={
                    item?.lovedOneId != null ? item?.loveOne?.relation : false
                  }
                  category={item?.detail?.specialities}
                  subText={moment(item?.startTime).format('DD MMM YYYY')}
                  rating={item?.provider?.rating ? item?.provider?.rating : 0}
                  status={status}
                  aTime={`${moment(item?.startTime)
                    .utc()
                    .format('hh:mm A')} to ${moment(item?.endTime)
                    .utc()
                    .format('hh:mm A')}`}
                  horizontal={true}
                  onPress={() =>
                    navigation.navigate('PatientConsulationDetail', {
                      data: item,
                      status: status,
                    })
                  }
                />
              </>
            )}
          />
        )}
        {selectedIndex == 2 && (
          <FlatList
            scrollEnabled={true}
            data={appointments}
            showsHorizontalScrollIndicator={false}
            style={styles.flex(1)}
            ListEmptyComponent={
              <View style={styles.mT(150)}>
                <NoRecordComponent />
              </View>
            }
            renderItem={({item, index}) => (
              <>
                <ListItem
                  image={item?.provider?.avatar}
                  title={`Dr. ${item?.provider?.firstName} ${item?.provider?.lastName}`}
                  lovedOne={
                    item?.lovedOneId != null
                      ? `${item?.loveOne?.firstName} ${item?.loveOne?.lastName}`
                      : false
                  }
                  relation={
                    item?.lovedOneId != null ? item?.loveOne?.relation : false
                  }
                  category={item?.detail?.specialities}
                  subText={moment(item?.startTime).format('DD MMM YYYY')}
                  rating={item?.provider?.rating ? item?.provider?.rating : 0}
                  status={status}
                  aTime={`${moment(item?.startTime)
                    .utc()
                    .format('hh:mm A')} to ${moment(item?.endTime)
                    .utc()
                    .format('hh:mm A')}`}
                  horizontal={true}
                  onPress={() =>
                    navigation.navigate('PatientConsulationDetail', {
                      data: item,
                      status: status,
                    })
                  }
                />
              </>
            )}
          />
        )}
      </ScrollView>
      <Image source={assets.bottom_image} style={styles.bottomImg} />
    </View>
  )
}

export default MyAppointments
