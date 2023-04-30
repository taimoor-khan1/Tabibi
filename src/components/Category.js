import React from 'react'
import styles from '../assets/styles'
import colors from '../config/Colors'
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import {assets} from '../assets/images'

const Category = ({
  options,
  isSelected = false,
  time = false,
  enableCategory = false,
  onItemPress = () => {},
}) => {
  // console.log(options,'options')
  return (
    <ScrollView horizontal 
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{flexGrow:1, }}
    
    >
      <View style={[styles.mT(15), styles.slotsContainer]}>
        {options.length ? (
          options.map((item, index) => {
            // console.log(item)
            return (
              <TouchableOpacity
                key={index}
                disabled={true}
                activeOpacity={1}
                style={[
                  time == true ? [styles.categoryCont] : styles.categoryCont,
                ]}
                onPress={() =>
                  item.status ? onItemPress(item.servieId) : null
                }>
          


                <LinearGradient
                  colors={
                    isSelected === item.servieId
                      ? [colors.btngr1, colors.btngr2, colors.btngr3]
                      : item.status
                      ? [colors.green1, colors.green2, colors.green3]
                      : [colors.red, colors.redLight, colors.redExtraLight]
                  }
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={[styles.catCont, styles.borderShadow]}>
                  <TouchableOpacity
                    onPress={() =>
                      item.status ? onItemPress(item.servieId) : null
                    }
                    disabled={enableCategory}>
                    <View
                      style={[
                        styles.flexRow,
                        {justifyContent: 'space-evenly'},
                      ]}>
                      {time && (
                        <Image
                          source={
                            item?.consultationType?.title === 'Video Call'
                              ? assets.videoCallWhite
                              : item.consultationType?.title ==='Walk-Ins'
                              ? assets.walkinWhite 
                              : assets.homeVisit
                          }
                          style={styles.mR(5)}
                        />
                      )}
                      <Text
                        style={
                          isSelected === item.servieId
                            ? [styles.textCategory, {color: colors.white}]
                            : item.status
                            ? [styles.textCategory, {color: colors.white}]
                            : [styles.textCategory, {color: colors.white}]
                        }>
                        {item.text}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </LinearGradient>
              
              </TouchableOpacity>
            )
          })
        ) : (
          <View>
            <Text
              style={[
                styles.textMedium,
                styles.fontSize(16),
                styles.color(colors.darkBlue),
                styles.mL(5),
                styles.mT(10),
              ]}>
              No Slots Available
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}
export default Category
