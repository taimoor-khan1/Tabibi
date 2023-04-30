import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { GreadientHeader } from '../../components'
import colors from '../../config/Colors'
import { assets } from '../../assets/images'
import labels from '../../config/Labels'
import styles from '../../assets/styles';


export default function PrivacyPolicy({navigation}) {
  return (
 
          <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <GreadientHeader
          showLeftIcon={true}
          showCenterText={labels.Privacy}
          showLeftText={labels.back}
          back={true}
       
          leftRoute={() => navigation.goBack()}
        />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
         
          
        </ScrollView>
   
      </View>

  )
}
