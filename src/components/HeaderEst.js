import React, {useState, useRef} from 'react';
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
} from 'react-native';
import styles from '../assets/styles';
import {Header, Icon} from 'react-native-elements';
import colors from '../config/Colors';
import config from '../config';
import {assets} from '../assets/images';
import labels from '../config/Labels';
import {Platform} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

const HeaderEst = ({
  showLeftIcon = false, //left Icon
  showRightIcon = false, //Right Icon
  showLeftText = false, //left Text
  showRightText = false, //Right Text
  showCenterText = false, //Center Text
  showCenterIcon = false, //Center Icon
  leftRoute = () => {}, //Left route call
  rightRoute = () => {}, //Right route call
  back = false, // if back true icon back shows
  ExtraStyle = {}, // Extra styles to pass
  title = labels.take, // title on Main screen
  meanHeading = config.api.version === 'PATIENT' ? labels.appointment : '', // main heading on Main screen
  subHeading = labels.headerSubtext, // sub headings on Main screen
}) => {
  // Declare state variables'
  const dispatch = useDispatch();
  const {loading} = useSelector((state) => state.Doctor);
  //Fuctions
  // SEARCH API CALL
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
                      name="chevron-right"
                      color={
                        config.api.version === 'DOCTOR'
                          ? colors.white
                          : colors.heading
                      }
                    />
                  ) : (
                    <Icon
                      name="chevron-left"
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
                      resizeMode="contain"
                      style={[
                        styles.left(25),
                        Platform.OS == 'ios' && styles.top(20),
                      ]}
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

      <View style={[styles.mL(30), styles.mT(120), styles.absolute]}>
        <View style={styles.flexRow}>
          <Text style={styles.h1_1}>
            {title}
            {'\n'}
            {loading ? (
              <ActivityIndicator size="large" color={colors.white} />
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
        </View>
        <View style={[styles.flexRow]}>
          <Text style={[styles.textLight, styles.color(colors.white)]}>
            {subHeading}
          </Text>
        </View>
      </View>
    </View>
  );
};
export default HeaderEst;
