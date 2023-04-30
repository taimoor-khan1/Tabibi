import React, {useRef, useState} from 'react';
import {Animated, Dimensions, StyleSheet, View} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler';
// You can import from local files
// or any pure javascript modules available in npm
const {height: SCREEN_HEIGHT, width} = Dimensions.get('window');

export default function DragAction({children}) {
  const dragY = useRef(new Animated.Value(10));
  const [size, setSize] = useState({width: 10, height: 10});

  const onHandleStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      dragY.current.extractOffset();
    }

    if (
      event.nativeEvent.translationX < 0 &&
      event.nativeEvent.translationY > 0
    ) {
      // translationX: 176.6666717529297
      // translationY: -146.66665649414062
      setSize({
        ...size,
        width: event.nativeEvent.translationX * -1,
        height: event.nativeEvent.translationY,
        left: event.nativeEvent.absoluteX,
        bottom: event.nativeEvent.absoluteY,
      });
      // console.log('onBegan EVENT   1', event.nativeEvent);
    } else if (
      event.nativeEvent.translationX > 0 &&
      event.nativeEvent.translationY < 0
    ) {
      setSize({
        ...size,
        width: event.nativeEvent.translationX,
        height: event.nativeEvent.translationY * -1,
        right: event.nativeEvent.absoluteX,
        top: event.nativeEvent.absoluteY,
      });
      // console.log('onBegan EVENT  4', event.nativeEvent);
    } else if (event.nativeEvent.translationX < 0) {
      setSize({
        ...size,
        width: event.nativeEvent.translationX * -1,
        height: event.nativeEvent.translationY * -1,
        left: event.nativeEvent.absoluteX,
        top: event.nativeEvent.absoluteY,
      });
      // console.log('onBegan EVENT   2', event.nativeEvent);
    } else {
      setSize({
        ...size,
        width: event.nativeEvent.translationX,
        height: event.nativeEvent.translationY,
      });
      // console.log('onBegan EVENT   3', event.nativeEvent);
    }
  };
  const onGestureEvent = (event) => {
    // console.log(event.nativeEvent, 'onBegan');
    setSize({
      ...size,
      left: event.nativeEvent.absoluteX,
      top: event.nativeEvent.absoluteY,
    });
  };
  return (
    <PanGestureHandler
      onBegan={onGestureEvent}
      onGestureEvent={onHandleStateChange}
      activeOffsetX={[-1000, 1000]}
      activeOffsetY={[-10, 10]}>
      <View style={styles.container}>
        {children}
        <Animated.View style={[size, styles.boxBorder]} />
      </View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    zIndex: 100000,
  },
  boxBorder: {
    position: 'absolute',
    // zIndex: -1000,
    borderWidth: 1,
    borderColor: 'yellow',
  },
});
