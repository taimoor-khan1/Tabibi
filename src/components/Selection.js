import React, {useEffect, useState} from 'react'
import styles from '../assets/styles'
import colors from '../config/Colors'
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native'
import {assets} from '../assets/images'
import labels from '../config/Labels'
import fonts from '../assets/fonts'
import {NoRecordComponent} from './index'

const SelectoinCategory = ({
  options,
  isSelected = false,
  lovedOne = false,
  prescriptions = false,
  payment = false,
  from = false,
  onDelete = () => {},
  onItemPress = () => {},
}) => {
  const [data, setData] = useState([])
  useEffect(() => {
    setData(options)
  }, [options])

  return (
    <>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        bounce={false}
        style={[styles.mT(15)]}>
        {data?.length > 0 ? (
          data.map((item, index) => {
            return (
              <TouchableOpacity
                activeOpacity={1}
                key={index}
                style={[[styles.selectionCont]]}
                onPress={() =>
                  (from == false && prescriptions) || payment
                    ? onItemPress(item)
                    : onItemPress(item.servieId)
                }>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    (from == false && prescriptions) || payment
                      ? onItemPress(item)
                      : onItemPress(item.servieId)
                  }
                  style={
                    prescriptions
                      ? [styles.selectCont1, styles.borderShadow]
                      : [styles.selectCont, styles.borderShadow]
                  }>
                  {lovedOne ? (
                    <>
                      <View style={[styles.flexRow]}>
                        {from === false ? (
                          <Image
                            source={
                              isSelected === item.servieId
                                ? assets.checkedBox
                                : assets.checkbox
                            }
                            style={styles.mR(5)}
                          />
                        ) : (
                          <View style={styles.mR(20)} />
                        )}
                        <Text style={[styles.selectTitle]}>{item.title}</Text>
                        {payment && (
                          <View
                            style={[
                              styles.flex(1),
                              styles.justifyContent,
                              {alignItems: 'flex-end'},
                            ]}>
                            <TouchableOpacity
                              onPress={() => onDelete(item.servieId)}>
                              <Image
                                source={assets.deleteNotification}
                                style={[styles.height(20), styles.width(20)]}
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                      {!item.complete && (
                        <Text style={[styles.selectSubtext]}>
                          {labels.notComplete}
                        </Text>
                      )}
                    </>
                  ) : (
                    <View>
                      <View style={[styles.flexRow, styles.justifyCntSP]}>
                        <View>
                          <Text
                            style={[
                              prescriptions
                                ? styles.selectTitle1
                                : styles.selectTitle,
                            ]}>
                            {item.title}
                          </Text>
                          {prescriptions && (
                            <Text
                              style={{
                                marginLeft: 12,
                                marginBottom: 4,
                                color: colors.subText,
                                fontFamily: fonts.PoppinsRegular,
                                fontSize: 11,
                              }}>
                              {item.subtext}
                            </Text>
                          )}
                        </View>

                        {prescriptions ? (
                          <Image source={assets.download} />
                        ) : (
                          <>
                            {from == false && (
                              <Image
                                source={
                                  isSelected === item.servieId
                                    ? assets.checkedBox
                                    : assets.checkbox
                                }
                              />
                            )}
                          </>
                        )}
                      </View>
                      {payment && (
                        <View style={[styles.flex(0.1), styles.justifyContent]}>
                          <TouchableOpacity
                            onPress={() => onDelete(item.servieId)}>
                            <Image
                              source={assets.deleteNotification}
                              style={[styles.height(20), styles.width(20)]}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              </TouchableOpacity>
            )
          })
        ) : (
          <View style={styles.mV(10)}>
            <NoRecordComponent />
          </View>
        )}
      </ScrollView>
    </>
  )
}
export default SelectoinCategory
