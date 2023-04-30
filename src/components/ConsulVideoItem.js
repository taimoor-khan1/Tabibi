import React from 'react'
import {View, Image, Text, TouchableOpacity} from 'react-native'
import styles from '../assets/styles'
import {assets} from '../assets/images'
import labels from '../config/Labels'
import {ButtonGradient} from '../components'
import moment from 'moment'
import {useDispatch, useSelector} from 'react-redux'

const ConsulVideoItem = ({
  avatar,
  title,
  date,
  id,
  stime,
  etime,
  cancel = false,
  relation = false,
  lovedOne = false,
  onReschedule = () => {},
  onPress = () => {},
  onProfile = () => {},
  cancelAppoint = () => {},
}) => {
  //REDUX STORE
  const {role, estDoc} = useSelector(state => state.Auth)
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.89}
        onPress={() =>  onPress()}>
        <View
          style={[
            styles.mV(10),
            styles.ContractorItmCont,
            styles.borderShadow,
          ]}>
          <View style={[styles.rowCont]}>
            <View style={(styles.flex(2), styles.alignItemsFlexStart)}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => onProfile()}>
                <Image
                  source={avatar ? {uri: avatar} : assets.avatar}
                  style={[styles.contractorImg]}
                  borderRadius={50}
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.flex(1)]}>
              <Text
                style={[styles.consulTitle]}
                numberOfLines={1}
                ellipsizeMode='tail'>
                {title}
              </Text>
              {lovedOne && (
                <View style={styles.flexRow}>
                  <Text
                    style={[styles.textRegular, {textTransform: 'capitalize'}]}
                    numberOfLines={1}
                    ellipsizeMode='tail'>
                    {lovedOne}
                  </Text>
                  {relation && (
                    <Text
                      style={[styles.textLight, {textTransform: 'capitalize'}]}
                      numberOfLines={1}
                      ellipsizeMode={'tail'}>
                      {` (${relation})`}
                    </Text>
                  )}
                </View>
              )}
              <View
                style={[
                  styles.flexRow,
                  styles.alignItemsFlexStart,
                  styles.mT(5),
                ]}>
                <Image source={assets.dateIcon} style={styles.mR(5)} />
                <Text style={[styles.consulVideo]}>
                  {moment(date).format('DD MMM YYYY')}
                </Text>
              </View>
              <View style={[styles.flexRow, styles.alignItemsFlexStart]}>
                <Image source={assets.watch} style={styles.watch} />
                <Text style={[styles.consulVideo, styles.mT(5)]}>
                  {moment(stime)
                    .utc()
                    .format('hh:mm A')}{' '}
                  to{' '}
                  {moment(etime)
                    .utc()
                    .format('hh:mm A')}
                </Text>
              </View>
            </View>
          </View>
          {!cancel && role === 'provider' && (
            <View style={[styles.flexColomn, styles.mH(5)]}>
              <View style={[styles.flexRow]}>
                <View style={[styles.flex(1), styles.mR(10)]}>
                  <ButtonGradient
                    title={labels.reschedule}
                    type={false}
                    gradient={true}
                    onBtnPress={() => onReschedule()}
                  />
                </View>
                <View style={[styles.flex(1)]}>
                  <ButtonGradient
                    title={labels.can}
                    type={false}
                    gradient={true}
                    cancel={true}
                    onBtnPress={() => cancelAppoint()}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </>
  )
}

export default ConsulVideoItem
