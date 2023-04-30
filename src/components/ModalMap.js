import React, {useState, useRef, useEffect} from 'react'
import {
  View,
  Platform,
  PermissionsAndroid,
  Image,
  TouchableOpacity,
  Linking,
  Text,
  Modal,
} from 'react-native'
import styles from '../assets/styles'
import {assets} from '../assets/images'
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'
import AsyncStorage from '@react-native-community/async-storage'
import Geolocation from '@react-native-community/geolocation'
import labels from '../config/Labels'
import Toast from 'react-native-simple-toast'
import {ButtonGradient} from '../components'

const ModalMap = ({
  navigation,
  markerPostion = () => {},
  mapHeight = 200,
  mapWidth = '100%',
}) => {
  // Declare state variables'
  const [region, setRegion] = useState({
    latitude: 24.7136,
    longitude: 46.6753,
    latitudeDelta: 0.004756622849171777,
    longitudeDelta: 0.008940137922763824,
  })
  const [markerCoords, setMarkerCoords] = useState({
    latitude: 0,
    longitude: 0,
  })
  const [locationPopup, setLocationPopup] = useState(false)
  // Declare Refs
  const refMarker = useRef()
  // Request Permission
  useEffect(() => {
    requestPermission()
  }, [])

  // Fuction for permission
  const requestPermission = async () => {
    if (Platform.OS === 'ios') {
      try {
        const auth = await Geolocation.requestAuthorization('always')
        if (auth === 'granted') {
          // getInitialState();
          await geoLocation()
        }
      } catch (err) {
        console.warn(err)
      }
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        )
        var authorized = 'granted'
        if (authorized === granted) {
          await geoLocation()
        }
      } catch (err) {
        console.warn(err)
      }
    }
  }
  // Function for Geo Location
  const geoLocation = async () => {
    var position = await AsyncStorage.getItem('position')
    if (position == null) {
      Geolocation.getCurrentPosition(
        async position => {
          await AsyncStorage.setItem('position', JSON.stringify(position))
          setRegion({
            latitudeDelta: 0.004756622849171777,
            longitudeDelta: 0.008940137922763824,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        error => {
          if (error.code === 1) {
            console.log('Error: Location Access is denied!')
          } else if (error.code === 2) {
            setLocationPopup(true)
          }
          // Toast.show(JSON.stringify(error));
          Toast.show(error.message)
          console.log(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 200000,
          maximumAge: 10000,
          showLocationDialog: true,
        },
      )
    } else {
      setRegion({
        latitudeDelta: 0.004756622849171777,
        longitudeDelta: 0.008940137922763824,
        latitude: JSON.parse(position).coords.latitude,
        longitude: JSON.parse(position).coords.longitude,
      })
    }
  }

  // Function for Region Change
  const onRegionChange = async (coords, params) => {
    // console.log('coords', coords, 'params', params);
    await AsyncStorage.setItem('position', JSON.stringify(coords))
    if (params.isGesture) {
      setRegion({
        latitudeDelta: coords.latitudeDelta,
        longitudeDelta: coords.longitudeDelta,
        latitude: coords.latitude,
        longitude: coords.longitude,
      })
    }
  }
  // console.log('Marker', markerCoords);
  return (
    <>
      <View style={[styles.mV(5)]}>
        <View>
          <MapView
            style={{height: mapHeight, width: mapWidth}}
            provider={Platform.OS === 'android' && PROVIDER_GOOGLE}
            region={region}
            showsUserLocation={true}
            showsCompass={true}
            showsBuildings={true}
            zoomTapEnabled={true}
            onRegionChangeComplete={(coords, params) =>
              onRegionChange(coords, params)
            }
            onPress={e => {
              Platform.OS === 'ios' &&
                onRegionChange(e.nativeEvent.coordinate, {isGesture: true})
              setMarkerCoords(e.nativeEvent.coordinate)
              markerPostion(e.nativeEvent.coordinate)
            }}
            // loadingEnabled
            loadingIndicatorColor='#2FB8F8'
            loadingBackgroundColor='transparent'>
            <Marker
              draggable
              ref={refMarker}
              key={1}
              coordinate={markerCoords}
              onDragEnd={e => {
                setMarkerCoords(e.nativeEvent.coordinate)
                // markerPostion(e.nativeEvent.coordinate);
              }}
              // onDrag={(e) => console.log('drag', e.nativeEvent.coordinate)}
            >
              <Image
                resizeMode='contain'
                source={assets.markerPin}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </Marker>
          </MapView>
        </View>
      </View>
      <Modal
        animationType='fade'
        visible={locationPopup}
        transparent={true}
        onRequestClose={() => setLocationPopup(false)}>
        <View style={styles.centeredView}>
          <View style={styles.permissionView}>
            <TouchableOpacity
              style={styles.imageCross}
              onPress={() => setLocationPopup(false)}>
              <Image source={assets.cross} />
            </TouchableOpacity>
            <View style={[styles.mT(30)]}>
              <Text style={[styles.h2, styles.textAlign]}>
                {labels.locationPermission}
              </Text>
              <Text
                style={[styles.paragraph2, styles.textAlign, styles.mT(20)]}>
                Your current GPS location is turn off please turn on the
                location
              </Text>
              <ButtonGradient
                title={'open setting'}
                type={false}
                gradient={true}
                onBtnPress={() => Linking.openSettings()}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}
export default ModalMap
