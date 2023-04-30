import React, {useEffect, useState} from 'react'
import {View, Text, ScrollView, FlatList, RefreshControl} from 'react-native'
import styles from '../../assets/styles'
import labels from '../../config/Labels'
import ReactNativeModal from 'react-native-modal'
import {
  TabBarr,
  ConsulVideoItem,
  NoRecordComponent,
  ButtonSmall,
  ButtonWhite,
} from '../../components'
import moment from 'moment'
import {useDispatch, useSelector} from 'react-redux'
import {cancelAppointment, getConsultationList} from '../../store/actions'

const ConsulationVideo = ({navigation, id}) => {
  //REDUX STORE
  const dispatch = useDispatch()
  const {estDoc} = useSelector(state => state.Auth)
  const {consultaionList, consultaionData, loading} = useSelector(
    state => state.Doctor,
  )
  const {lovedOneById} = useSelector(state => state.Patient)
  // Declare state variables'
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [status, setStatus] = useState('booked')
  const [refreshing, setRefreshing] = React.useState(false)
  const [cancelPopUp, setCancelPopUp] = useState(false)
  const [cancelId, setCancelId] = useState('')
  const [list, setList] = useState([])
  const [TabsList] = useState([
    {name: labels.booked},
    {name: labels.completed},
    {name: labels.canceled},
  ])

  //Refresh funtion
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout))
  }
  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    if (estDoc?.provider) {
      dispatch(getConsultationList({status}, false, estDoc?.provider?.id))
    } else {
      dispatch(getConsultationList({status}, false))
    }
    wait(1000).then(() => setRefreshing(false))
  }, [])

  // GET Consultation id list
  useEffect(() => {
    if (estDoc?.provider) {
      dispatch(getConsultationList({status}, false, estDoc?.provider?.id))
    } else {
      dispatch(getConsultationList({status}, false))
    }
  }, [status, selectedIndex])

  //Action for set list
  useEffect(() => {
    if (consultaionList?.length > 0) {
      var userData = {}
      consultaionList?.map(item => {
        userData = {...userData, [item.id]: item}
      })
      // console.log(userData,'userData')
      var patients = consultaionData
      var loveOnes = lovedOneById
      const keys = Object.keys(userData)
      const patientExist =
        patients && patients.filter(item => keys.includes(item.patientId))
      const loveOneExist = {}
      loveOnes &&
        loveOnes.map(item => {
          loveOneExist[item.id] = item
        })
      patients =
        patientExist &&
        patientExist
          .filter(e => e?.consultationTypeId == id)
          .map((item, index) => {
            var data = userData[item?.patientId]
            return {
              ...item,
              patient: data,
              loveOne: loveOneExist[item?.lovedOneId] || false,
              time: `${moment(item?.startTime)
                .utc()
                .format('hh:mm A')} to ${moment(item?.endTime)
                .utc()
                .format('hh:mm A')}`,
            }
          })
      // console.log(loveOneExist, 'data');

      //Sorting
      const sorted = patients.sort((a, b) => {
        const dateA = new Date(`${a.createdAt}`).valueOf()
        const dateB = new Date(`${b.createdAt}`).valueOf()
        if (dateA < dateB) {
          return 1
        }
        return -1
      })
      setList(sorted)
    } else {
      setList([])
    }
  }, [consultaionList, lovedOneById])
  // console.log(list);
  //Cancel Appoinment
  const cancelAppoint = id => {
    setCancelPopUp(false)
    dispatch(cancelAppointment({id, from: 'doctor'}, navigation, true))
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.height(20)} />

      <Text style={[styles.homeHeading, styles.mL(20)]}>
        {labels.videoConsultation}
      </Text>

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
              : '',
          )
        }}
        index={selectedIndex}
      />
      {selectedIndex == 0 && (
        <View style={styles.mH(20)}>
          <FlatList
            data={list?.filter(e => e.status === 'booked')}
            contentContainerStyle={styles.mT(10)}
            ListEmptyComponent={
              <View style={styles.mT(150)}>
                <NoRecordComponent title={'Please Wait...'} loading={loading} />
              </View>
            }
            renderItem={({item, index}) => {
              return (
                <ConsulVideoItem
                  navigation={navigation}
                  id={item.id}
                  avatar={item?.patient?.avatar}
                  title={`${item?.patient?.firstName} ${item?.patient?.lastName}`}
                  lovedOne={
                    item?.lovedOneId != null
                      ? `${item?.loveOne?.firstName} ${item?.loveOne?.lastName}`
                      : false
                  }
                  relation={
                    item?.lovedOneId != null ? item?.loveOne?.relation : false
                  }
                  date={item?.startTime}
                  stime={item?.startTime}
                  etime={item?.endTime}
                  cancel={false}
                  onProfile={() =>
                    navigation.navigate('DrPatientDetail', {
                      id: item?.patientId,
                      data: item,
                      status: status,
                      from: true,
                    })
                  }
                  onPress={() =>
                    navigation.navigate('DrConsulationDetail', {
                      data: item,
                      status: status,
                      walkIn: false,
                    })
                  }
                  cancelAppoint={() => {
                    setCancelId(item?.id), setCancelPopUp(true)
                  }}
                  onReschedule={() =>
                    navigation.navigate('DrReschedule', {
                      appointment: item,
                      time: item.time,
                      schedule: {
                        consultationDate: moment(item?.startTime).format(
                          'YYYY-MM-DD',
                        ),
                      },
                    })
                  }
                />
              )
            }}
          />
        </View>
      )}
      {selectedIndex == 1 && (
        <View style={styles.mH(20)}>
          <FlatList
            data={list?.filter(e => e.status === 'completed')}
            contentContainerStyle={styles.mT(10)}
            ListEmptyComponent={
              <View style={styles.mT(150)}>
                <NoRecordComponent title={'Please Wait...'} loading={loading} />
              </View>
            }
            renderItem={({item, index}) => {
              return (
                <ConsulVideoItem
                  navigation={navigation}
                  id={item.id}
                  avatar={item?.patient?.avatar}
                  title={`${item?.patient?.firstName} ${item?.patient?.lastName}`}
                  lovedOne={
                    item?.lovedOneId != null
                      ? `${item?.loveOne?.firstName} ${item?.loveOne?.lastName}`
                      : false
                  }
                  relation={
                    item?.lovedOneId != null ? item?.loveOne?.relation : false
                  }
                  date={item?.startTime}
                  stime={item?.startTime}
                  etime={item?.endTime}
                  cancel={true}
                  onProfile={() =>
                    navigation.navigate('DrPatientDetail', {
                      id: item?.patientId,
                      data: item,
                      status: status,
                      from: true,
                    })
                  }
                  onPress={() =>
                    navigation.navigate('DrConsulationDetail', {
                      data: item,
                      status: status,
                      walkIn: false,
                    })
                  }
                  cancelAppoint={() => {
                    setCancelId(item?.id), setCancelPopUp(true)
                  }}
                  onReschedule={() =>
                    navigation.navigate('DrReschedule', {
                      appointment: item,
                      time: item.time,
                      schedule: {
                        consultationDate: moment(item?.startTime).format(
                          'YYYY-MM-DD',
                        ),
                      },
                    })
                  }
                />
              )
            }}
          />
        </View>
      )}
      {selectedIndex == 2 && (
        <View style={styles.mH(20)}>
          <FlatList
            data={list?.filter(e => e.status === 'canceled' || 'reject')}
            contentContainerStyle={styles.mT(10)}
            ListEmptyComponent={
              <View style={styles.mT(150)}>
                <NoRecordComponent title={'Please Wait...'} loading={loading} />
              </View>
            }
            renderItem={({item, index}) => {
              return (
                <ConsulVideoItem
                  navigation={navigation}
                  id={item.id}
                  avatar={item?.patient?.avatar}
                  title={`${item?.patient?.firstName} ${item?.patient?.lastName}`}
                  lovedOne={
                    item?.lovedOneId != null
                      ? `${item?.loveOne?.firstName} ${item?.loveOne?.lastName}`
                      : false
                  }
                  relation={
                    item?.lovedOneId != null ? item?.loveOne?.relation : false
                  }
                  date={item?.startTime}
                  stime={item?.startTime}
                  etime={item?.endTime}
                  cancel={true}
                  onProfile={() =>
                    navigation.navigate('DrPatientDetail', {
                      id: item?.patientId,
                      data: item,
                      status: status,
                      from: true,
                    })
                  }
                  onPress={() =>
                    navigation.navigate('DrConsulationDetail', {
                      data: item,
                      status: status,
                      walkIn: false,
                    })
                  }
                  cancelAppoint={() => {
                    setCancelId(item?.id), setCancelPopUp(true)
                  }}
                  onReschedule={() =>
                    navigation.navigate('DrReschedule', {
                      appointment: item,
                      time: item.time,
                      schedule: {
                        consultationDate: moment(item?.startTime).format(
                          'YYYY-MM-DD',
                        ),
                      },
                    })
                  }
                />
              )
            }}
          />
        </View>
      )}
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
              onBtnPress={() => cancelAppoint(cancelId)}
            />
          </View>
          <View style={styles.height(10)} />
        </View>
      </ReactNativeModal>
    </ScrollView>
  )
}

export default ConsulationVideo
