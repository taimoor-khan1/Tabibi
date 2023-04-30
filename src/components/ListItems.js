import React from 'react';
import {Rating} from 'react-native-elements';
import ImageLoad from 'react-native-image-placeholder';
import styles from '../assets/styles';
import {assets} from '../assets/images';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../config/Colors';
import {View, Text, TouchableOpacity, Platform, Dimensions} from 'react-native';
const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

const ListItem = ({
  navigation,
  image,
  aTime,
  title = false,
  subText = false,
  category = false,
  slots = false,
  rating,
  horizontal,
  gradiendent = false,
  isSchedule = false,
  onPress = () => {},
  showRating = true,
  time = [],
  relation = false,
  lovedOne = false,
  activeOpacity = 0.7,
}) => {
  return (
    <>
      <TouchableOpacity activeOpacity={activeOpacity} onPress={() => onPress()}>
        <View
          style={[
            styles.mV(10),
            styles.shadowbb,
            horizontal == true && [
              {
                marginHorizontal: gradiendent == true ? 7 : 20,
                width:
                  gradiendent == true ? windowWidth * 0.8 : windowWidth * 0.89,
              },
            ],
          ]}>
          <LinearGradient
            style={[
              styles.ListItmCont,
              {
                width:
                  gradiendent == true ? windowWidth * 0.8 : windowWidth * 0.89,
              },
            ]}
            colors={
              gradiendent == true
                ? [colors.btngr1, colors.btngr2, colors.btngr3]
                : [colors.white, colors.white, colors.white]
            }
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <View style={[styles.rowCont]}>
              <View style={(styles.flex(1), styles.alignItems('flex-start'))}>
                {isSchedule ? (
                  <View
                    style={[
                      styles.height(80),
                      styles.width(80),
                      styles.justifyContentCenter,
                      styles.alignItemsFlexend,
                    ]}>
                    {time &&
                      time.map((item, index) => (
                        <Text
                          key={index}
                          style={[
                            styles.textSemiBold,
                            styles.color(colors.btngr1),
                            styles.fontSize(12),
                          ]}>
                          {item}
                        </Text>
                      ))}
                    {!time.length && (
                      <Text
                        style={[
                          styles.textSemiBold,
                          styles.color(colors.btngr1),
                          styles.fontSize(12),
                        ]}>
                        Pendding...
                      </Text>
                    )}
                  </View>
                ) : (
                  <ImageLoad
                    source={image ? {uri: image} : assets.dummy}
                    placeholderStyle={styles.ListImg}
                    style={styles.ListImg}
                    borderRadius={Platform.OS === 'ios' ? 50 : 50}
                    loadingStyle={{size: 'small', color: colors.themeColor}}
                  />
                )}
              </View>
              {isSchedule && (
                <View
                  style={[
                    styles.height(50),
                    styles.width(1),
                    styles.borderR(1, colors.lightGrey),
                    styles.mH(10),
                  ]}
                />
              )}
              <View style={[styles.flex(1), styles.flexRow]}>
                <View style={[styles.flex(5)]}>
                  {title && (
                    <View style={styles.flexRow}>
                      <Text
                        style={
                          gradiendent == true
                            ? [
                                styles.textSemiBold,
                                styles.color(colors.white),
                                {textTransform: 'capitalize'},
                              ]
                            : [
                                styles.textSemiBold,
                                {textTransform: 'capitalize'},
                              ]
                        }
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {title}
                      </Text>
                    </View>
                  )}
                  {lovedOne && (
                    <View style={styles.flexRow}>
                      <Text
                        style={[
                          styles.textRegular,
                          {textTransform: 'capitalize'},
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {lovedOne}
                      </Text>
                      {relation && (
                        <Text
                          style={
                            gradiendent == true
                              ? [
                                  styles.textLight,
                                  styles.color(colors.white),
                                  {textTransform: 'capitalize'},
                                ]
                              : [
                                  styles.textLight,
                                  {textTransform: 'capitalize'},
                                ]
                          }
                          numberOfLines={1}
                          ellipsizeMode={'tail'}>
                          {` (${relation})`}
                        </Text>
                      )}
                    </View>
                  )}
                  {category && (
                    <Text
                      style={
                        gradiendent == true
                          ? [
                              styles.textMedium,
                              styles.color(colors.white),
                              {textTransform: 'capitalize'},
                            ]
                          : [styles.textMedium, {textTransform: 'capitalize'}]
                      }
                      numberOfLines={1}
                      ellipsizeMode={'tail'}>
                      {category}
                    </Text>
                  )}
                  {subText && (
                    <>
                      <Text style={[styles.consulVideo]}>{aTime}</Text>
                      <Text
                        style={[
                          styles.textLight,
                          {textTransform: 'capitalize', fontSize: 13},
                        ]}
                        numberOfLines={1}
                        ellipsizeMode={'tail'}>
                        {subText}
                      </Text>
                    </>
                  )}
                </View>
                {showRating && (
                  <View
                    style={[
                      styles.flex(2),
                      styles.alignItemsFlexend,
                      styles.mT(5),
                      styles.mR(10),
                    ]}>
                    {slots && <Text style={[styles.slots]}>{slots} Slots</Text>}
                    <View
                      style={[
                        styles.flexRow,
                        styles.alignItemsFlexStart,
                        styles.justifyCntSP,
                      ]}>
                      <View style={[styles.flexRow]}>
                        <Text
                          style={[
                            gradiendent == true
                              ? [styles.textBlack, styles.color(colors.blue)]
                              : [styles.textBlack, styles.color(colors.blue)],
                            styles.mR(5),
                            styles.fontSize(12),
                            slots ? styles.mT(3) : styles.mT(18),
                          ]}>
                          {rating}
                        </Text>
                        <Rating
                          type="custom"
                          ratingColor="#fec311"
                          ratingBackgroundColor={colors.grey}
                          tintColor={
                            gradiendent == true ? '#46C1FB' : colors.white
                          }
                          readonly
                          style={slots ? styles.mT(4) : styles.mT(18)}
                          startingValue={1}
                          ratingCount={1}
                          imageSize={15}
                        />
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    </>
  );
};
export default ListItem;
