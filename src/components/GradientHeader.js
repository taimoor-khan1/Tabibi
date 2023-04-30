import React from 'react';
import {
  Image,
  View,
  Text,
  StatusBar,
  I18nManager,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import styles from '../assets/styles';
import { Header, Icon, Rating } from 'react-native-elements';
import colors from '../config/Colors';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets/images';

const GreadientHeader = ({
  navigation,
  showLeftIcon = false,
  showRightIcon = false,
  showLeftText = false,
  showRightText = false,
  showCenterText = false,
  showCenterIcon = false,
  modalShow = false,
  modalBtn = () => { },
  leftRoute = () => { },
  rightRoute = () => { },
  title = false,
  category = false,
  subText = false,
  back = false,
  profile = false,
  prescription = false,
  profileImage = false,
  rating = '',
}) => {
  return (
    <View>
      <StatusBar
        backgroundColor={'transparent'}
        barStyle="light-content"
        translucent={true}
      />
      {profile == true ? (
        <View>
          <LinearGradient
            colors={[colors.btngr1, colors.btngr2, colors.btngr3]}
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.headerGradienCont,
              styles.borderShadow,
              styles.height(170),
              { position: 'absolute' },
            ]}>
            <Header
              containerStyle={[styles.headerContainer]}
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
                    ]}>
                    {showLeftIcon && back ? (
                      <View style={[styles.flexRow, styles.top(3)]}>
                        {I18nManager.isRTL ? (
                          <Icon name="chevron-right" color={colors.white} />
                        ) : (
                          <Icon name="chevron-left" color={colors.white} />
                        )}
                        <Text
                          style={[
                            styles.headerLeftText,
                            styles.color(colors.white),
                          ]}>
                          {showLeftText}
                        </Text>
                      </View>
                    ) : (
                      <>
                        {showLeftIcon && (
                          <Image
                            style={[styles.headerCenter]}
                            source={showLeftIcon}
                          />
                        )}
                        <Text style={[styles.headerLeftText]}>
                          {showLeftText}
                        </Text>
                      </>
                    )}
                  </View>
                </TouchableWithoutFeedback>
              }
              ///////////////////////Center/////////////////////////
              centerComponent={
                <View
                  style={[styles.justifyContent, styles.alignItems('center')]}>
                  {showCenterText && (
                    <Text
                      style={[
                        styles.title,
                        styles.color(colors.white),
                        styles.PoppinsMedium,
                        styles.pT(5),
                        styles.fontSize(16),
                      ]}>
                      {showCenterText}
                    </Text>
                  )}
                  {showCenterIcon && (
                    <Image
                      style={[styles.headerCenter]}
                      source={showCenterIcon}
                    />
                  )}
                </View>
              }
              ////////////////////////Right////////////////////////
              rightComponent={
                <TouchableWithoutFeedback
                  style={styles.pml10}
                  // hitSlop={styles.hitSlop}
                  onPress={() => {
                    rightRoute();
                    modalBtn();
                  }}>
                  <View
                    style={[
                      styles.justifyContent,
                      styles.alignItems('flex-end'),
                    ]}>
                    {showRightIcon && (
                      <View
                        style={[
                          styles.justifyContent,
                          styles.alignItems('flex-end'),
                          styles.width_Percent(100),
                          styles.flexRow
                        ]}>
                        {showRightIcon && (
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={(e) => modalBtn(e)}>
                            <Image
                              source={showRightIcon}
                              resizeMode="contain"
                              style={{ right: -20 }}
                            />
                          </TouchableOpacity>
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
          </LinearGradient>
          <View
            style={[
              styles.flex(5),
              styles.gh,
            ]}>
            <Image
              source={profileImage ? { uri: profileImage } : assets.avatar}
              borderRadius={120 / 2}
              style={
                profileImage
                  ? [styles.ProfileEditImg, { borderWidth: 1.5 }]
                  : [styles.ProfileEditImg]
              }
            />
            <Text
              style={[
                styles.textSemiBold,
                styles.fontSize(19),
                styles.textTransformCap,
              ]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {title}
            </Text>
            {prescription && (
              <Text
                style={[styles.textSemiBold, styles.fontSize(19)]}
                numberOfLines={1}
                ellipsizeMode="tail"></Text>
            )}
            <Text
              style={[styles.textMedium, styles.fontSize(16), styles.mH(30)]}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {category}
            </Text>
            <Text
              style={[styles.textLight, styles.fontSize(16)]}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {subText}
            </Text>
            {profile && !prescription && (
              <>
                <Rating
                  readonly
                  tintColor={colors.themeWhite}
                  imageSize={20}
                  style={[styles.top(8)]}
                  ratingCount={5}
                  startingValue={rating}
                />
                <Text style={styles.rate}>{rating}</Text>
              </>
            )}
          </View>
        </View>
      ) : (
        <LinearGradient
          colors={[colors.btngr1, colors.btngr2, colors.btngr3]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.headerGradienCont, styles.borderShadow]}>
          <Header
            containerStyle={styles.headerContainer}
            //////////////////////Left//////////////////////////
            leftComponent={
              <TouchableWithoutFeedback
                style={[styles.pmr10]}
                hitSlop={styles.hitSlop}
                onPress={() => leftRoute()}>
                <View
                  style={[styles.justifyContent, styles.alignItems('center')]}>
                  {showLeftIcon && back ? (
                    <View style={[styles.flexRow, styles.top(3)]}>
                      {I18nManager.isRTL ? (
                        <Icon name="chevron-right" color={colors.white} />
                      ) : (
                        <Icon name="chevron-left" color={colors.white} />
                      )}
                      <Text
                        style={[
                          styles.headerLeftText,
                          styles.color(colors.white),
                        ]}>
                        {showLeftText}
                      </Text>
                    </View>
                  ) : (
                    <>
                      {showLeftIcon && (
                        <Image
                          style={[styles.headerCenter]}
                          source={showLeftIcon}
                        />
                      )}
                      <Text style={[styles.headerLeftText]}>
                        {showLeftText}
                      </Text>
                    </>
                  )}
                </View>
              </TouchableWithoutFeedback>
            }
            ///////////////////////Center/////////////////////////
            centerComponent={
              <View
                style={[styles.justifyContent, styles.alignItems('center')]}>
                {showCenterText && (
                  <Text
                    style={[
                      styles.color(colors.white),
                      styles.PoppinsMedium,
                      styles.pT(5),
                      styles.mL(10),
                      styles.fontSize(16),
                    ]}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}>
                    {showCenterText}
                  </Text>
                )}
                {showCenterIcon && (
                  <Image
                    style={[styles.headerCenter]}
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
                <View
                  style={[
                    styles.justifyContent,
                    styles.alignItems('flex-end')
                  ]}>
                  {showRightIcon && (
                    <View
                      style={[
                        styles.justifyContent,
                        styles.alignItems('flex-end'),
                        styles.width_Percent(100),
                        styles.flexRow,

                      ]}>
                      {showRightIcon && (
                        <TouchableOpacity
                          style={{
                            right: -20
                          }}
                          hitSlop={styles.hitSlop}
                          activeOpacity={0.7}
                          onPress={(e) => modalBtn(e)}>
                          <Image source={showRightIcon} resizeMode="contain" />
                        </TouchableOpacity>
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
        </LinearGradient>
      )
      }
    </View >
  );
};
export default GreadientHeader;
