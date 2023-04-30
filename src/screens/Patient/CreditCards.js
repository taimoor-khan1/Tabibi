import React, {useEffect, useRef, useState} from 'react'
import {View, Image, Text, TouchableOpacity} from 'react-native'
import styles from '../../assets/styles'
import {assets} from '../../assets/images'
import labels from '../../config/Labels'
import colors from '../../config/Colors'
import Modal from 'react-native-modalbox'
import Snackbar from 'react-native-snackbar'
import ReactNativeModal from 'react-native-modal'
import {
  AddBtn,
  GreadientHeader,
  ButtonGradient,
  SelectoinCategory,
  ButtonSmall,
} from '../../components'
import {useDispatch, useSelector} from 'react-redux'
import {
  capturedPayment,
  getCard,
  getSlotInfo,
  deleteCard,
} from '../../store/actions'
import fonts from '../../assets/fonts'

const CreditCard = ({navigation, route}) => {
  const [from] = useState(route?.params?.from)
  const [push] = useState(route?.params?.push)
  //Redux Store
  const dispatch = useDispatch()
  const {creditsCards: creditCards, slotInfo} = useSelector(
    state => state.Patient,
  )
  // Declare state variables'
  const [options, setOptions] = useState([])
  const [paymentCard, setPaymentCard] = useState(null)
  const [Paymenttype, setPaymenttype] = useState('card')
  const [appointPopup, setAppointPopup] = useState(false)
  const [postAppointData, setPostAppointData] = useState(
    route?.params?.postAppointData,
  )
  // Declare input reference field
  const refPopUp = useRef()

  //Action for Set Card List
  useEffect(() => {
    const cards = creditCards.map((text, index) => {
      return {
        ...text,
        servieId: text?.id,
        title: `${text.nameOnCard}\nxxxx xxxx xxxx ${text.cardNumber}`,
        complete: true,
      }
    })
    setOptions(cards)
  }, [creditCards])

  //Action for get cards
  useEffect(() => {
    dispatch(getCard(true))
    if (push && route?.params?.slotId) {
      dispatch(getSlotInfo(route?.params?.slotId, false))
    }
  }, [])

  //Fuctions
  const popUp = () => {
    refPopUp.current.close()
    navigation.navigate('MyAppointments')
  }

  //Function for Payment Api
  const capturedPaymentFunc = () => {
    //FOR CASH AND FOR CREDIT CARD
    if (Paymenttype === 'card') {
      if (paymentCard === null) {
        Snackbar.show({
          text: labels.cardSelect,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: colors.themeColor,
          fontFamily: fonts.PoppinsMedium,
          textColor: colors.dim,
        })
      } else {
        const data = {
          appointmentId: route?.params?.consultationId,
          cardId: paymentCard?.stripeCardId,
          customerId: paymentCard?.stripeCustomerId,
          totalAmount: route?.params?.perSlotAmount,
          paymentType: Paymenttype,
        }
        // with credit card
        dispatch(capturedPayment(data, navigation)).then(status => {
          if (status === 200) {
            if (postAppointData != null) {
              setAppointPopup(true)
            } else {
              refPopUp.current.open()
              setTimeout(() => {
                navigation.navigate('MyAppointments')
              }, 6000)
            }
          }
        })
      }
    } else {
      const data = {
        appointmentId: route?.params?.consultationId,
        paymentType: Paymenttype,
        totalAmount: route?.params?.perSlotAmount,
      }
      // with cash
      dispatch(capturedPayment(data, navigation)).then(status => {
        if (status === 200) {
          if (postAppointData != null) {
            setAppointPopup(true)
          } else {
            refPopUp.current.open()
            setTimeout(() => {
              refPopUp.current.close()
              navigation.navigate('MyAppointments')
            }, 6000)
          }
        }
      })
    }
  }

  const pendingPayment = () => {
    const data = {
      appointmentId: route?.params?.consultationId,
      cardId: paymentCard?.stripeCardId,
      customerId: paymentCard?.stripeCustomerId,
      totalAmount: slotInfo?.schedule?.perSlotAmount,
      paymentType: 'card',
    }
    console.log(data)
    // with credit card
    dispatch(capturedPayment(data, navigation)).then(status => {
      if (status === 200) {
        refPopUp.current.open()
        setTimeout(() => {
          refPopUp.current.close()
          navigation.navigate('MyAppointments')
        }, 6000)
      }
    })
  }

  //On Delete
  const onDelete = id => {
    console.log(id)
    const payload = {
      data: {
        cardId: id,
      },
    }
    dispatch(deleteCard(payload, true)).then(res => {
      if (res === 200) {
        dispatch(getCard(true))
        setPaymentCard(null)
      }
    })
  }
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <GreadientHeader
          showLeftIcon={true}
          showRightIcon={false}
          showCenterText={labels.payment}
          showLeftText={labels.back}
          back={true}
          leftRoute={() => navigation.goBack()}
        />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <AddBtn type={false} onBtnPress={() => navigation.navigate('AddCard')} />
        <View style={styles.height(40)} />
        <View style={styles.mH(20)}>
          {route?.params?.walkin === true && (
            <>
              <View style={[styles.flexRow, styles.justifyCntSA]}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setPaymenttype('card')}>
                  <View style={styles.flexRow}>
                    <Image
                      source={
                        Paymenttype === 'card'
                          ? assets.checkedBox
                          : assets.checkbox
                      }
                      style={styles.mR(5)}
                    />
                    <Text style={[styles.selectTitle]}>{labels.Card}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setPaymenttype('cash'), setPaymentCard(null)
                  }}>
                  <View style={styles.flexRow}>
                    <Image
                      source={
                        Paymenttype === 'cash'
                          ? assets.checkedBox
                          : assets.checkbox
                      }
                      style={styles.mR(5)}
                    />
                    <Text style={[styles.selectTitle]}>{labels.Cash}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}
          {Paymenttype === 'card' && (
            <SelectoinCategory
              options={options.length ? options : []}
              isSelected={paymentCard?.id}
              from={false}
              lovedOne={true}
              payment={true}
              prescriptions={false}
              onDelete={id => onDelete(id)}
              onItemPress={value => {
                setPaymentCard(value)
              }}
            />
          )}
          {from === false && (
            <View style={[styles.mH(8), styles.mT(15)]}>
              <ButtonGradient
                title={labels.confirm}
                type={false}
                disabled={
                  Paymenttype === 'card' && paymentCard === null ? true : false
                }
                onBtnPress={() =>
                  push ? pendingPayment() : capturedPaymentFunc()
                }
              />
            </View>
          )}
        </View>
      </View>

      {/* BOOK APPOINTMENT MODAL */}
      <Modal
        style={[styles.modal]}
        position={'center'}
        ref={refPopUp}
        backdropPressToClose={false}
        backdropOpacity={0.8}
        keyboardTopOffset={50}
        backButtonClose={false}
        swipeToClose={false}
        backdropColor={colors.black}>
        <Image
          source={assets.sucessfull}
          style={styles.doneBox}
          resizeMode='contain'
        />
        <Text style={[styles.sucessTitle, styles.mT(20)]}>{labels.sucess}</Text>
        <View style={[styles.width(200), styles.mT(15)]}>
          <ButtonGradient
            title={labels.yourAppointment}
            type={false}
            onBtnPress={() => popUp()}
          />
        </View>
      </Modal>
      {/* POST APPOINTMENT MODAL */}
      <ReactNativeModal
        backdropOpacity={0.5}
        isVisible={appointPopup}
        onBackButtonPress={() => {
          setAppointPopup(false)
          refPopUp.current.open()
        }}>
        <View style={[styles.aboutMePopUpContainer]}>
          <Text style={[styles.h2, styles.textAlign, styles.mT(25)]}>
            {postAppointData?.title && postAppointData?.title}
          </Text>
          <Text style={[styles.textSemiBold, styles.textAlign, styles.mT(5)]}>
            {postAppointData?.description && postAppointData?.description}
          </Text>
          <View
            style={[
              styles.flexRow,
              styles.alignSelf,
              styles.mH(45),
              styles.mT(5),
            ]}>
            <ButtonSmall
              title={'ok'}
              onBtnPress={() => {
                setAppointPopup(false)
                refPopUp.current.open()
              }}
            />
          </View>
          <View style={styles.height(10)} />
        </View>
      </ReactNativeModal>
    </>
  )
}

export default CreditCard
