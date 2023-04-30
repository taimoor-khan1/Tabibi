import React from 'react';
import {
  Image,
  View,
  Text,
  StatusBar,
  I18nManager,
  TouchableWithoutFeedback,
} from 'react-native';
import styles from '../assets/styles';
import {Header, Icon} from 'react-native-elements';
import colors from '../config/Colors';
import config from '../config';
// import {connect} from 'react-redux';

const HeaderBack = ({
  showLeftIcon = false,
  showRightIcon = false,
  showLeftText = false,
  showRightText = false,
  showCenterText = false,
  showCenterIcon = false,
  leftRoute = () => {},
  rightRoute = () => {},
  back = false,
}) => {
  return (
    <View>
      <StatusBar backgroundColor={colors.themeColor} barStyle="light-content" />
      <Header
        containerStyle={styles.headerContainer}
        //////////////////////Left//////////////////////////
        leftComponent={
          <TouchableWithoutFeedback
            style={[styles.pmr10]}
            hitSlop={styles.hitSlop}
            onPress={() => leftRoute()}>
            <View style={[styles.justifyContent, styles.alignItems('center')]}>
              {showLeftIcon && back ? (
                <View style={[styles.flexRow, styles.justifyContentCenter]}>
                  {I18nManager.isRTL ? (
                    <Icon
                      name="chevron-right"
                      color={
                        config.api.version === 'PATIENT'
                          ? colors.white
                          : colors.heading
                      }
                    />
                  ) : (
                    <Icon
                      name="chevron-left"
                      color={
                        config.api.version === 'PATIENT'
                          ? colors.white
                          : colors.heading
                      }
                    />
                  )}
                  <Text style={[styles.headerLeftText]}>{showLeftText}</Text>
                </View>
              ) : (
                <>
                  {showLeftIcon && (
                    <Image
                      style={[styles.headerCenter]}
                      source={showLeftIcon}
                    />
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
              <Image style={[styles.headerCenter]} source={showCenterIcon} />
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
                    <Image source={showRightIcon} resizeMode="contain" />
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
    </View>
  );
};
export default HeaderBack;
