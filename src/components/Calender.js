import React, {useState} from 'react'
import colors from '../config/Colors'
import {CalendarList} from 'react-native-calendars'
import fonts from '../assets/fonts'
import labels from '../config/Labels'
import Snackbar from 'react-native-snackbar'
import {getDrDashboard, getDrDashboardAppointment} from '../store/actions'
import {useSelector, useDispatch} from 'react-redux'
import moment from 'moment'

const Calendar_CC = ({
  setDate = () => {},
  navigation,
  onRouteToMainCalender = false,
  pagingEnabled = false,
  scrollEnabled = false,
  index,
  avability = false,
}) => {
  //Redux Store
  const dispatch = useDispatch()
  const {profile, estDoc} = useSelector(state => state.Auth)
  const {drDashboard, drAppointment} = useSelector(state => state.Doctor)

  const [selectedDay, onSelectDay] = useState(moment().format('YYYY-MM-DD'))
  //Fuction for Marked Dates
  //POC DATES
  const markedPOC = (array, key) => {
    if (array) {
      const initialValue = {}
      return array.reduce((obj, item) => {
        return {
          ...obj,
          [item?.consultationDate]: {
            marked: true,
            dotColor: item?.status ? 'green' : 'red',
            customStyles: {
              container: {
                justifyContent: 'center',
              },
            },
          },
          [selectedDay]: {
            selected: false,
            dotColor: colors.btngr3,
            marked: true,
            customStyles: {
              container: {
                justifyContent: 'center',
              },
            },
          },
          [moment().format('YYYY-MM-DD')]: {
            selected: true,
            customStyles: {
              container: {
                justifyContent: 'center',
              },
            },
          },
        }
      }, initialValue)
    } else {
      var newData = {}
      return (newData = {
        [selectedDay]: {
          selected: false,
          dotColor: colors.btngr3,
          marked: true,
          customStyles: {
            container: {
              justifyContent: 'center',
            },
          },
        },
        [moment().format('YYYY-MM-DD')]: {
          selected: true,
          customStyles: {
            container: {
              justifyContent: 'center',
            },
          },
        },
      })
    }
  }
  //APPOINTMENTS
  const markedAppoint = (array, key) => {
    if (array.length) {
      const initialValue = {}
      return array.reduce((obj, item) => {
        return {
          ...obj,
          [moment(item?.startTime).format('YYYY-MM-DD')]: {
            marked: true,
            dotColor:
              item?.status === 'booked'
                ? '#E90101'
                : item?.status === 'completed'
                ? '#4caf50'
                : '',
            customStyles: {
              container: {
                justifyContent: 'center',
              },
            },
          },
          [selectedDay]: {
            selected: false,
            dotColor: colors.btngr3,
            marked: true,
            customStyles: {
              container: {
                justifyContent: 'center',
              },
            },
          },
          [moment().format('YYYY-MM-DD')]: {
            selected: true,
            customStyles: {
              container: {
                justifyContent: 'center',
              },
            },
          },
        }
      }, initialValue)
    } else {
      var newData = {}
      return (newData = {
        [selectedDay]: {
          selected: false,
          dotColor: colors.btngr3,
          marked: true,
          customStyles: {
            container: {
              justifyContent: 'center',
            },
          },
        },
        [moment().format('YYYY-MM-DD')]: {
          selected: true,
          customStyles: {
            container: {
              justifyContent: 'center',
            },
          },
        },
      })
    }
  }

  const getDashboardData = date => {
    const params = {
      period: date, // curent day month
    }
    if (index === 0) {
      if (estDoc?.provider) {
        dispatch(getDrDashboard(params, false, estDoc?.provider?.id))
      } else {
        dispatch(getDrDashboard(params, false))
      }
    } else {
      if (estDoc?.provider) {
        dispatch(getDrDashboardAppointment(params, false, estDoc?.provider?.id))
      } else {
        dispatch(getDrDashboardAppointment(params, false))
      }
    }
  }

  return (
    <CalendarList
      onVisibleMonthsChange={months => {
        getDashboardData(moment(months[0].dateString).format('YYYY-MM'))
      }}
      
      horizontal={true}
      scrollEnabled={scrollEnabled}
      showScrollIndicator={true}
      style={{backgroundColor: 'transparent', alignSelf: 'center'}}
      markingType={'custom'}
      markedDates={
        index === 0
          ? markedPOC(
              drDashboard?.consultaions?.length && drDashboard?.consultaions,
            )
          : markedAppoint(drAppointment)
      }
      pagingEnabled={pagingEnabled}
      onDayLongPress={day => {
        onSelectDay(day.dateString)
        setDate(day.dateString)
        onRouteToMainCalender
          ? navigation.navigate('DrCalendarView', {
              setMode: 'day',
              date: day.dateString,
            })
          : navigation.navigate('DrDayView', {
              setMode: 'day',
              date: day.dateString,
            })
      }}
      onDayPress={day => {
        onSelectDay(day.dateString)
        setDate(day.dateString)
        profile?.status
          ? onRouteToMainCalender
            ? navigation.navigate('DrCalendarView', {
                setMode: 'day',
                date: day.dateString,
                from: true,
              })
            : avability === false
            ? navigation.navigate('DrDayView', {
                setMode: 'day',
                date: day.dateString,
              })
            : null
          : Snackbar.show({
              text: labels.notVerified,
              duration: Snackbar.LENGTH_LONG,
              numberOfLines: 10,
              backgroundColor: colors.themeColor,
              fontFamily: fonts.PoppinsMedium,
              textColor: colors.dim,
              action: {
                text: 'Ok',
                textColor: colors.dim,
                onPress: () => {},
              },
            })
      }}
      theme={{
        selectedDayBackgroundColor: colors.btngr1,
        backgroundColor: 'transparent',
        calendarBackground: 'transparent',
        dayTextColor: colors.darkGrey,
        todayTextColor: colors.darkGrey,
        textDisabledColor: 'red',
        arrowColor: colors.darkGrey,
        disabledArrowColor: '#d9e1e8',
        monthTextColor: colors.darkGrey,
        textDayFontFamily: fonts.PoppinsSemiBold,
        textMonthFontFamily: fonts.PoppinsSemiBold,
        textDayHeaderFontFamily: fonts.PoppinsSemiBold,
        textDayFontSize: 12,
        textMonthFontSize: 12,
        textDayHeaderFontSize: 12,
      }}
    />
  )
}
export default Calendar_CC
