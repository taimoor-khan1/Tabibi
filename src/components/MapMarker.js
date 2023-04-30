import React from 'react';
import {View, Text, Image} from 'react-native';
import styles from '../assets/styles';
import {assets} from '../assets/images';
import colors from '../config/Colors';
import LinearGradient from 'react-native-linear-gradient';

const MapMarker = ({name, subtext, image}) => {
  return (
    <>
      <View style={[styles.mapView]}>
        <Image
          source={image ? {uri: image} : assets.avatar}
          resizeMode="cover"
          style={[styles.mapImg]}
        />
        <View style={{zIndex: -1}}>
          <LinearGradient
            colors={[colors.btngr1, colors.btngr2, colors.btngr3]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[styles.mapGradientCont, {position: 'absolute', top: -10}]}>
            <View>
              <Text style={[styles.mapViewText]} numberOfLines={1}>
                {name}
              </Text>
              <Text style={styles.mapViewTextLight} numberOfLines={1}>
                {subtext}
              </Text>
            </View>
          </LinearGradient>
        </View>
      </View>
    </>
  );
};
export default MapMarker;
