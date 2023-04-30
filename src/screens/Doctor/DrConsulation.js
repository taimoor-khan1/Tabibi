import React, {useEffect, useState} from 'react'
import {View, Image} from 'react-native'
import styles from '../../assets/styles'
import {assets} from '../../assets/images'
import labels from '../../config/Labels'
import colors from '../../config/Colors'
import {ConsulationHome, ConsulationVideo, ConsulationPerson} from '../index'
import {useSelector} from 'react-redux'
import {GreadientHeader, Tabber} from '../../components'

const DrConsulation = ({navigation}) => {
  // Declare state variables'
  const [index, setIndex] = useState(0)
  const {getConsultationlist} = useSelector(state => state.Patient)

  //Tabber change
  const handleTabChange = index => {
    setIndex(index)
  }

  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <GreadientHeader
          showLeftIcon={true}
          showCenterText={labels.consul}
          showLeftText={labels.back}
          back={true}
          leftRoute={() => navigation.goBack()}
        />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <View style={styles.height(20)} />
        <Tabber
          tab1={labels.video}
          tab2={labels.walkIn}
          tab3={labels.homeVist}
          onTabPress={e => handleTabChange(e)}
          selectedIndex={index}
        />
        {index === 0 && (
          <ConsulationVideo
            navigation={navigation}
            id={getConsultationlist
              ?.filter(a => a.title === 'Video Call')
              ?.map(item => item?.id)}
          />
        )}
        {index === 1 && (
          <ConsulationPerson
            navigation={navigation}
            id={getConsultationlist
              ?.filter(a => a.title === 'Walk-Ins')
              ?.map(item => item?.id)}
          />
        )}
        {index === 2 && (
          <ConsulationHome
            navigation={navigation}
            id={getConsultationlist
              ?.filter(a => a.title === 'Home Visit')
              ?.map(item => item?.id)}
          />
        )}
      </View>
    </>
  )
}

export default DrConsulation
