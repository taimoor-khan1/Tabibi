import React, {useState, useRef} from 'react'
import {
  Image,
  View,
  Text,
  StatusBar,
  I18nManager,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from 'react-native'
import styles from '../assets/styles'
import {Header, Icon, Input} from 'react-native-elements'
import colors from '../config/Colors'
import config from '../config'
import {assets} from '../assets/images'
import labels from '../config/Labels'
import Toast from 'react-native-simple-toast'
import {Platform} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import {searchDoctor} from '../store/actions'

const HeaderHome = ({
  showLeftIcon = false, //left Icon
  showRightIcon = false, //Right Icon
  showLeftText = false, //left Text
  showRightText = false, //Right Text
  showCenterText = false, //Center Text
  showCenterIcon = false, //Center Icon
  leftRoute = () => {}, //Left route call
  rightRoute = () => {}, //Right route call
  onModal = () => {}, // filter modal call
  back = false, // if back true icon back shows
  filter = false, // if true filter icon shows
  doctor = false, // for doctor side UI update
  ExtraStyle = {}, // Extra styles to pass
  title = labels.take, // title on Main screen
  meanHeading = config.api.version === 'PATIENT' ? labels.appointment : '', // main heading on Main screen
  subHeading = labels.headerSubtext, // sub headings on Main screen
  navigation, // for navigations
  showSearch = true, // show search bar
  searched = '',
  setSearched = () => {},
  onSearchModal = () => {}, // search modal call
}) => {
  // Declare state variables'
  const dispatch = useDispatch()
  const {loading} = useSelector(state => state.Doctor)
  //Fuctions
  // SEARCH API CALL
  const onSearchSubmit = () => {
    if (!searched) {
      return Toast.show('Enter search text')
    }
    Toast.show(`${labels.searching + searched}`)
    const params = {
      isFilter: false,
      search: searched.trim(),
    }
    dispatch(searchDoctor(params, navigation, {searched}, true))
    Keyboard.dismiss()
    // setSearch('');
  }
  return (
    <View>
      <StatusBar
        backgroundColor={'transparent'}
        barStyle={'light-content'}
        translucent={true}
      />
      <Header
        containerStyle={[styles.headerhomeContainer, ExtraStyle]}
        backgroundImage={assets.headerBg}
        backgroundImageStyle={[styles.headerhomeBg, ExtraStyle]}
        // barStyle={'light-content'}
        // statusBarProps={{backgroundColor: colors.themeColor}}
        //////////////////////Left//////////////////////////
        leftComponent={
          <TouchableWithoutFeedback
            style={[styles.pmr10]}
            hitSlop={styles.hitSlop}
            onPress={() => leftRoute()}>
            <View
              style={[
                styles.justifyContent,
                styles.alignItems('center'),
                Platform.OS == 'ios' && {top: 18},
              ]}>
              {back ? (
                <View style={[styles.flexRow]}>
                  {I18nManager.isRTL ? (
                    <Icon
                      name='chevron-right'
                      color={
                        config.api.version === 'DOCTOR'
                          ? colors.white
                          : colors.heading
                      }
                    />
                  ) : (
                    <Icon
                      name='chevron-left'
                      color={
                        config.api.version === 'DOCTOR'
                          ? colors.white
                          : colors.heading
                      }
                    />
                  )}
                  <Text
                    style={[styles.headerLeftText, styles.color(colors.white)]}>
                    {showLeftText}
                  </Text>
                </View>
              ) : (
                <>
                  {showLeftIcon && (
                    <Image style={[styles.left(10)]} source={showLeftIcon} />
                  )}
                  <Text style={[styles.headerLeftText]}>{showLeftText}</Text>
                </>
              )}
            </View>
          </TouchableWithoutFeedback>
        }
        ///////////////////////Center/////////////////////////
        centerComponent={
          <View style={[styles.justifyContent, styles.alignItems('center')]}>
            {showCenterText && (
              <Text style={[styles.title, styles.topPadding]}>
                {showCenterText}
              </Text>
            )}
            {showCenterIcon && (
              <Image
                style={[styles.headerCenter, styles.top(5)]}
                source={showCenterIcon}
              />
            )}
          </View>
        }
        ////////////////////////Right////////////////////////
        rightComponent={
          <TouchableWithoutFeedback
            style={styles.pml10}
            hitSlop={styles.hitSlop}
            onPress={() => rightRoute()}>
            <View style={[styles.justifyContent, styles.alignItems('center')]}>
              {showRightIcon && (
                <View
                  style={[
                    styles.justifyContent,
                    styles.alignItems('center'),
                    styles.width_Percent(100),
                    styles.flexRow,
                  ]}>
                  {showRightIcon && (
                    <Image
                      source={showRightIcon}
                      resizeMode='contain'
                      style={
                        doctor
                          ? [
                              styles.left(25),
                              Platform.OS == 'ios' && styles.top(20),
                            ]
                          : [
                              Platform.OS == 'android' && styles.left(20),
                              Platform.OS == 'ios' && styles.top(15),
                            ]
                      }
                    />
                  )}
                  {showRightText && (
                    <Text style={[styles.headerRightText]}>
                      {showRightText}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        }
      />
      {config.api.version === 'DOCTOR' ? (
        <View style={[styles.mL(30), styles.mT(120), styles.absolute]}>
          <View style={styles.flexRow}>
            <Text style={styles.h1_1}>
              {title}
              {'\n'}
              {loading ? (
                <ActivityIndicator size='large' color={colors.white} />
              ) : (
                <Text
                  style={[
                    styles.h1,
                    styles.fontSize(24),
                    {textTransform: 'capitalize', lineHeight: 32},
                  ]}>
                  {meanHeading}
                </Text>
              )}
            </Text>
            {filter && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onModal()}
                style={styles.homeFilter}>
                <Image source={assets.search_filter} />
              </TouchableOpacity>
            )}
          </View>
          <View style={[styles.flexRow]}>
            <Text style={[styles.textLight, styles.color(colors.white)]}>
              {subHeading}
            </Text>
          </View>
        </View>
      ) : (
        <View style={[styles.mL(30), styles.mT(200), styles.absolute]}>
          <Text style={styles.h1_1}>
            {title}
            {'\n'}
            <Text
              style={[
                styles.h1,
                styles.fontSize(24),
                {textTransform: 'capitalize', lineHeight: 32},
              ]}>
              {meanHeading}
            </Text>
          </Text>
          <View style={[styles.flexRow]}>
            <Text style={[styles.textLight, styles.color(colors.white)]}>
              {subHeading}
            </Text>
          </View>
        </View>
      )}
      {showSearch && (
        <View style={styles.searchCont}>
          <Input
            inputContainerStyle={[styles.inputContainer]}
            placeholder={labels.serachPlace}
            inputStyle={[styles.inputStyle]}
            autoCapitalize='words'
            returnKeyType='search'
            value={searched}
            onChangeText={text => {
              setSearched(text.replace(/[^a-zA-Z1-9\s\.]/g, ''))
              text.length > 1 ? onSearchModal(true) : onSearchModal(false);
            }}
            onSubmitEditing={() => onSearchModal(true)}
            rightIconContainerStyle={{width: 30}}
            rightIcon={
              <TouchableOpacity
                activeOpacity={0.7}
                // style={{zIndex: 100}}
                onPress={() => {
                  onSearchSubmit()
                }}>
                <Image source={assets.search} />
              </TouchableOpacity>
            }
          />
        </View>
      )}
    </View>
  )
}
export default HeaderHome
