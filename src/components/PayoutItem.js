import React, {useState} from 'react';
import styles from '../assets/styles';
import labels from '../config/Labels';
import colors from '../config/Colors';
import {assets} from '../assets/images';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import {View, Text, Image, TouchableOpacity} from 'react-native';

const PayoutItem = ({
  image = false,
  ammount = '',
  description,
  date,
  from,
  est = false,
  doctor,
}) => {
  const [showImage, setShowImage] = useState(false);

  return (
    <>
      <View
        style={[
          styles.mT(10),
          styles.mB(40),
          styles.payoutItmCont,
          styles.borderShadow,
        ]}>
        <View style={[styles.payoutTopCont]}>
          <View style={[styles.flex(1), styles.justifyCntSA]}>
            <Text
              style={[
                styles.textSemiBold,
                styles.color(colors.black),
                styles.fontSize(32),
              ]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {`$${ammount.toFixed(2)}`}
            </Text>
            <Text
              style={[styles.textPay]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {`${labels.sentBy} ${from}`}
            </Text>
          </View>
          <View style={[styles.flex(1)]}>
            <Text
              style={[styles.textDate, styles.textAlignRight]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {moment
                .utc(date)
                .utcOffset(moment().utcOffset())
                .format('DD MMM YYYY')}
            </Text>
            <Text
              style={[styles.textDate, styles.textAlignRight]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {moment
                .utc(date)
                .utcOffset(moment().utcOffset())
                .format('HH:MM A')}
            </Text>
          </View>
        </View>
        {est && (
          <View style={[styles.payoutTopCont, styles.mT(0)]}>
            <View style={[styles.flex(1), styles.justifyCntSA]}>
              <Text
                style={[
                  styles.textSemiBold,
                  styles.color(colors.black),
                  styles.fontSize(17),
                ]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {labels.toDoc}
              </Text>
              <View style={[styles.flexRow, styles.alignItemCenter]}>
                <Image
                  source={
                    doctor?.avatar ? {uri: doctor?.avatar} : assets.avatar
                  }
                  style={[styles.payouttImg]}
                  borderRadius={50}
                />
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.fontSize(14),
                    styles.mL(10),
                    styles.textBlack,
                  ]}>
                  {`${doctor?.firstName} ${doctor?.lastName}`}
                </Text>
              </View>
            </View>
          </View>
        )}
        <View style={[styles.payoutTopCont, styles.mT(0)]}>
          <View style={[styles.flex(1), styles.justifyCntSA]}>
            <Text
              style={[
                styles.textSemiBold,
                styles.color(colors.black),
                styles.fontSize(17),
              ]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {labels.Description}
            </Text>
            <Text style={[styles.textPay, styles.fontSize(14)]}>
              {description}
            </Text>
          </View>
        </View>

        {showImage ? (
          <>
            <View style={styles.height(20)} />
            <Text
              style={[
                styles.textSemiBold,
                styles.color(colors.black),
                styles.fontSize(17),
              ]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {labels.attachement}
            </Text>
            <View style={styles.height(20)} />
            <Image
              borderRadius={5}
              source={image ? {uri: image} : assets.dummy}
              style={{
                width: '100%',
                height: 200,
                alignSelf: 'center',
              }}
            />
            <View style={styles.height(20)} />
          </>
        ) : (
          <View style={[styles.flexRow, styles.mV(5)]}>
            <Image source={assets.screenShot} style={styles.mH(4)} />
            <Text style={styles.SS}>{labels.screenShot}</Text>
            <View style={styles.height(30)} />
          </View>
        )}
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.payoutBtn]}
          activeOpacity={0.7}
          onPress={() => {
            setShowImage(!showImage);
          }}>
          <LinearGradient
            colors={[colors.btngr1, colors.btngr2, colors.btngr3]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[styles.borderShadow, styles.BtnContView]}>
            <View>
              <Text style={[styles.color(colors.white), styles.NormalBtnText]}>
                {showImage ? labels.hide : labels.view}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default PayoutItem;
