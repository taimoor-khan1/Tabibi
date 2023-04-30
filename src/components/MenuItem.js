import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import styles from '../assets/styles'
import colors from '../config/Colors'
import Snackbar from 'react-native-snackbar'
import labels from '../config/Labels'
import fonts from '../assets/fonts'
import {drGetProfile, getDetail} from '../store/actions'
import {useSelector, useDispatch} from 'react-redux'

const MenuItemComponent = ({
  navigation,
  data = {},
  status = true,
  subscription = false,
}) => {
  //Redux Store
  const dispatch = useDispatch()
  const {user, role, profile, estDoc} = useSelector(state => state.Auth)

  //Show Subscription Toast
  const showToast = type => {
    if (type == 'verify') {
      Snackbar.show({
        text: labels.notVerified,
        duration: Snackbar.LENGTH_LONG,
        numberOfLines: 10,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
        action: {
          text: 'Ok',
          textColor: colors.dim,
          onPress: () => {
            dispatch(drGetProfile({user_id: user?.userId, from: role}, false))
            dispatch(getDetail({from: role}))
          },
        },
      })
    } else {
      Snackbar.show({
        text: labels.buySubscription,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
        action: {
          text: 'go to',
          textColor: colors.dim,
          onPress: () => {
            Snackbar.dismiss()
            navigation.navigate('DrSubcriptionPlan')
          },
        },
      })
    }
  }
  return (
    <TouchableOpacity
      // disabled={!status}
      onPress={() => {
        !status
          ? showToast('verify')
          : subscription
          ? [data.callBack(), navigation.navigate(data.route, data.params)]
          : showToast('subs')
      }}>
      <View
        style={[
          styles.flexRow,
          styles.mV(8),
          data.title == 'Help Center'
            ? ''
            : {borderBottomWidth: 0.3, borderBottomColor: colors.grey},
        ]}>
        <View style={styles.flex(1)}>
          <Text
            style={
              !status
                ? [styles.menuItem, styles.color(colors.greyAA)]
                : styles.menuItem
            }>
            {data.title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
export default MenuItemComponent
