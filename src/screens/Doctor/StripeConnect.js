import React, {useEffect} from 'react'
import {BackHandler, Dimensions, View} from 'react-native'
import WebView from 'react-native-webview'
import {GreadientHeader} from '../../components'
import labels from '../../config/Labels'
import Snackbar from 'react-native-snackbar'
import colors from '../../config/Colors'
import {useSelector, useDispatch} from 'react-redux'
import {drGetProfile} from '../../store/actions'
import fonts from '../../assets/fonts'

const StripeConnect = ({navigation}) => {
  //Redux Store
  const dispatch = useDispatch()
  const {profile, role} = useSelector(state => state.Auth)

  //Back Handler Function
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () =>
      backHandlerFunc(),
    )
    return () => backHandler.remove()
  }, [])
  const backHandlerFunc = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'DrDashboard'}],
    })
  }
  const showToast = type => {
    if (type === 'sucess') {
      Snackbar.show({
        text: labels.stripeAccountSetup,
        duration: Snackbar.LENGTH_LONG,
        numberOfLines: 10,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
      })
    } else {
      Snackbar.show({
        text: labels.stripeAccountSetupFail,
        duration: Snackbar.LENGTH_LONG,
        numberOfLines: 10,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
      })
    }
  }
  return (
    <View style={{flex: 1}}>
      <GreadientHeader
        showLeftIcon={true}
        showRightIcon={false}
        showCenterText={labels.stripeConnect}
        showLeftText={labels.back}
        back={true}
        leftRoute={() => backHandlerFunc()}
      />
      {/* <View style={{ flex: 1, width: Dimensions.get('window').width - 500 }}> */}
      <WebView
        scrollEnabled={true}
        style={{height: Dimensions.get('screen').height - 500}}
        domStorageEnabled={true}
        cacheEnabled={true}
        source={{
          uri: `https://connect.stripe.com/oauth/v2/authorize?response_type=code&client_id=ca_KOtTz36eI9GzukQKxRo1L0her990Zr8F&scope=read_write&state=${profile.userId}&type=app`,
        }}
        onNavigationStateChange={state => {
          console.log('current_state', state)
          var pathArray = state.url.split('/')
          var protocol = pathArray[0]
          var host = pathArray[2]
          var url = protocol + '//' + host
          if (url === 'https://provider-service.tabibbi.com') {
            showToast('sucess')
            const params = {
              user_id: profile?.userId,
              from: role,
            }
            dispatch(drGetProfile(params, true))
            setTimeout(() => {
              navigation.goBack()
            }, 3000)
          } else {
            // showToast('fail')
            // navigation.goBack()
          }
        }}
      />
      {/* </View> */}
    </View>
  )
}

export default StripeConnect
