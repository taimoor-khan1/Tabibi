import React, {useState} from 'react'
import {View, Text, Image, TouchableOpacity} from 'react-native'
import styles from '../assets/styles'
import colors from '../config/Colors'
import LinearGradient from 'react-native-linear-gradient'

const Tabber = ({selectedIndex, tab1, tab2, tab3, onTabPress = () => {}}) => {
  const handleTabChange = index => {
    setSelectedIndex(index)
  }
  return (
    <View style={[styles.pH(20), styles.pB(5)]}>
      <View>
        <View style={[styles.moreListBorder, styles.mT(20), styles.shadowbb]}>
          <View style={styles.flexRow}>
            <LinearGradient
              colors={
                selectedIndex == 0
                  ? [colors.btngr1, colors.btngr2, colors.btngr3]
                  : [colors.white, colors.white, colors.white]
              }
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={[
                styles.flex(1),
                selectedIndex == 0
                  ? styles.activeTabStyle
                  : styles.inActiveTabStyle,
              ]}>
              <TouchableOpacity onPress={() => onTabPress(0)}>
                <Text
                  style={[
                    styles.activeTabTextStyle2,
                    selectedIndex == 0
                      ? {color: colors.white}
                      : {color: colors.text},
                    tab3 && styles.fontSize(14),
                  ]}
                  numberOfLines={1}>
                  {tab1}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
            <LinearGradient
              colors={
                selectedIndex == 1
                  ? [colors.btngr1, colors.btngr2, colors.btngr3]
                  : [colors.white, colors.white, colors.white]
              }
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={[
                styles.flex(1),
                selectedIndex === 1
                  ? styles.activeTabStyle
                  : styles.inActiveTabStyle,
              ]}>
              <TouchableOpacity onPress={() => onTabPress(1)}>
                <Text
                  style={[
                    styles.activeTabTextStyle2,
                    selectedIndex === 1
                      ? {color: colors.white}
                      : {color: colors.text},
                    tab3 && styles.fontSize(14),
                  ]}
                  numberOfLines={1}>
                  {tab2}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
            {tab3 && (
              <LinearGradient
                colors={
                  selectedIndex == 2
                    ? [colors.btngr1, colors.btngr2, colors.btngr3]
                    : [colors.white, colors.white, colors.white]
                }
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={[
                  styles.flex(1),
                  selectedIndex === 2
                    ? styles.activeTabStyle
                    : styles.inActiveTabStyle,
                ]}>
                <TouchableOpacity onPress={() => onTabPress(2)}>
                  <Text
                    style={[
                      styles.activeTabTextStyle2,
                      selectedIndex === 2
                        ? {color: colors.white}
                        : {color: colors.text},
                      tab3 && styles.fontSize(13),
                    ]}
                    numberOfLines={1}>
                    {tab3}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}
export default Tabber
