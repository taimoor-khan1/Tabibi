import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal as RNModal,
} from 'react-native'
import styles from '../../assets/styles'
import { assets } from '../../assets/images'
import labels from '../../config/Labels'
import colors from '../../config/Colors'
import { Icon } from 'react-native-elements'
import Snackbar from 'react-native-snackbar'
import {
  GreadientHeader,
  PlanItem,
  NoRecordComponent,
  ButtonGradient,
} from '../../components'
import {
  getDrCard,
  getSubscription,
  getSubscriptionUser,
  subscribe,
  cancelSubscription,
} from '../../store/actions'
import { useDispatch, useSelector } from 'react-redux'
import fonts from '../../assets/fonts'

const DrSubcriptionPlan = ({ navigation }) => {
  //Redux store
  const dispatch = useDispatch()
  const { subscriptions, subscriptionsList } = useSelector(state => state.Calling)
  const { creditsCards } = useSelector(state => state.Doctor)

  // Declare state variables'
  const [cardId, setCardId] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [card, setCard] = useState('')
  const [subscribePopup, setSubscribePopup] = useState(false)
  const [showCardList, setShowCardList] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const [active, setActive] = useState({})

  //Functions and API calling
  useEffect(() => {
    dispatch(getDrCard(false))
    dispatch(getSubscription({}, true))
    dispatch(getSubscriptionUser({}, false))
  }, [])

  //Set Active Subscription
  useEffect(() => {
    if (subscriptions && subscriptions) {
      setActive(subscriptions)
    } else {
    }
  }, [subscriptions])

  //Subscribe Function
  const onSubscribe = item => {
    const payload = {
      subscriptionId: item?.id,
      productId: item?.productId,
      cardId: cardId,
      customerId: customerId,
    }
    console.log(payload)
    setLoading(true)
    dispatch(subscribe(payload, true)).then(res => {
      if (res === 200) {
        dispatch(getSubscription({}, false))
        dispatch(getSubscriptionUser({}, false))
        setSubscribePopup(false)
        setLoading(false)
      } else {
        setSubscribePopup(false)
        setLoading(false)
      }
    })
  }

  //Cancel Subscription Function
  const onCancelSubscription = id => {
    dispatch(cancelSubscription({ id: id }, true)).then(res => {
      console.log("response bro====>", res)
      if (res === 200) {
        dispatch(getSubscription({}, false))
        dispatch(getSubscriptionUser({}, false))
      }
    })
  }

  const showToast = () => {
    Snackbar.show({
      text: labels.noCreditCard,
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: colors.themeColor,
      fontFamily: fonts.PoppinsMedium,
      textColor: colors.dim,
      action: {
        text: 'go to',
        textColor: colors.dim,
        onPress: () => {
          navigation.navigate('DrPayment')
          Snackbar.dismiss()
          setSubscribePopup(false)
        },
      },
    })
  }
  function rendarCardList({ item }) {
    return (
      <TouchableOpacity
        onPress={() => {
          setCard(`${item.nameOnCard} ${item.cardNumber}`)
          setCardId(item.stripeCardId)
          setCustomerId(item.stripeCustomerId)
          setShowCardList(false)
          // set('')
        }}>
        <View style={styles.languageArr}>
          <Text
            style={styles.fontSize(
              12,
            )}>{`${item.nameOnCard} ${item.cardNumber}`}</Text>
        </View>
      </TouchableOpacity>
    )
  }
  // console.log(subscriptions?.subscription?.id, '  ', subscriptionsList)
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.white)]}>
        <GreadientHeader
          showLeftIcon={true}
          showCenterText={labels.subscriptions}
          showLeftText={labels.back}
          back={true}
          leftRoute={() => navigation.goBack()}
        />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <View style={styles.height(20)} />
          <View style={styles.mH(20)}>
            <FlatList
              scrollEnabled={true}
              data={subscriptionsList}
              showsVerticalScrollIndicator={false}
              style={styles.flex(1)}
              ListEmptyComponent={
                <View style={styles.mT(150)}>
                  <NoRecordComponent />
                </View>
              }
              renderItem={({ item, index }) => (

                <>
                  <PlanItem
                    blue={item?.duration === 'month' ? true : false}
                    title={item?.title}
                    subscription={
                      item?.duration === 'month'
                        ? labels.monthly
                        : item?.duration === '6 month'
                          ? `6 ${labels.weekly}`
                          : labels.yearly
                    }
                    price={item?.price}
                    description={`✓ ${item?.description}`}
                    cancel={
                      item?.providerSubscribe?.[0]?.cancelAt ? false : true
                    }
                    status={item?.providerSubscribe?.length > 0 ? true : false}
                    show={
                      subscriptions?.subscription?.id
                        ? subscriptions?.subscription?.id === item?.id
                          ? true
                          : false
                        : true
                    }
                    onCancel={() =>
                      onCancelSubscription(item?.providerSubscribe?.[0]?.id)
                    }
                    onSubscribe={() => {
                      setData(item)
                      setSubscribePopup(true)
                    }}
                  />
                </>
              )}
            />
          </View>
          <View style={styles.height(30)} />
        </ScrollView>
        {/* SUBSCRIPTION MODAL */}
        <RNModal
          animationType='slide'
          transparent={true}
          visible={subscribePopup}
          onRequestClose={() => setSubscribePopup(false)}>
          <View style={[styles.subsCont, styles.shadowbb]}>
            <TouchableOpacity
              hitSlop={styles.hitSlop}
              style={[styles.modalCrossIcon]}
              onPress={() => setSubscribePopup(false)}>
              <Image source={assets.close} />
            </TouchableOpacity>
            <Text
              style={[
                styles.h2,
                styles.textAlign,
                styles.mV(10),
                styles.mH(20),
              ]}>
              {labels.selectCard}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.preAppointmentIntervalNotifInputContainer,
                styles.shadowbb,
              ]}
              onPress={() =>
                creditsCards?.length > 0
                  ? [setShowCardList(!showCardList)]
                  : showToast()
              }>
              <View style={[styles.flexRow]}>
                <View style={[styles.leftFeild, styles.flex(0.8)]}>
                  <Text
                    style={[
                      styles.dropDownText,
                      styles.textNoti,
                      styles.mL(15),
                      styles.color(colors.subText),
                    ]}
                    numberOfLines={1}
                    ellipsizeMode='tail'>
                    {card === '' ? 'Select card' : card}
                  </Text>
                </View>
                <View style={[styles.rightArrowDown, styles.flex(0.2)]}>
                  <Icon
                    name={showCardList ? 'chevron-up' : 'chevron-down'}
                    color={colors.heading}
                    type='evilicon'
                  />
                </View>
              </View>
            </TouchableOpacity>
            {showCardList && (
              <View style={[styles.languageView, styles.mT(15)]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <FlatList
                    data={creditsCards && creditsCards}
                    renderItem={rendarCardList}
                    keyExtractor={item => item.name}
                    ListEmptyComponent={
                      <Text style={styles.POCError}>{labels.noData}</Text>
                    }
                  />
                </ScrollView>
              </View>
            )}
            {loading ? (
              <ActivityIndicator
                size='large'
                color={colors.btngr1}
                style={styles.mB(10)}
              />
            ) : (
              <View style={[styles.width90, styles.alignSelf, styles.mB(10)]}>
                <ButtonGradient
                  title={'select'}
                  type={false}
                  gradient={true}
                  onBtnPress={() => {
                    onSubscribe(data)
                  }}
                />
              </View>
            )}
          </View>
        </RNModal>
      </View >
    </>
  )
}

export default DrSubcriptionPlan
