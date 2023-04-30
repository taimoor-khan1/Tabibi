import React, { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler';
import colors from './src/config/Colors';
// You can import from local files
// or any pure javascript modules available in npm
const { height, width } = Dimensions.get('window');

export default function App(props) {
  const {
    children,
    CalendarData,
    allowDrag = {},
    onSelected,
    setDragPermission,
  } = props;
  const { commonProps = {}, containerHeight, scrollRef } = CalendarData;
  const { dateRange, cellHeight } = commonProps;
  const [DATE_RANGE, setDATE_RANGE] = useState({});
  // scrollView.current.scrollTo({
  //   y: (cellHeight * scrollOffsetMinutes) / 60,
  //   animated: false,
  // });

  var SelectDate = DATE_RANGE[allowDrag?.date?.$D];
  var totalCell = 7 * 25;
  var CellPerRowWith = width / 8;

  useEffect(() => {
    var _DATE_RANGE = {};
    dateRange.map((item, index) => {
      _DATE_RANGE = { ..._DATE_RANGE, [item.$D]: index + 1 };
    });
    setDATE_RANGE(_DATE_RANGE);
  }, [dateRange]);

  const dragY = useRef(new Animated.Value(0));
  const [size, setSize] = useState({
    width: CellPerRowWith,
    height: cellHeight,
  });
  const getTopBox = () => {
    var cellLimite = Math.round((height - 300) / cellHeight);
    cellLimite = Platform.OS === 'ios' ? cellLimite - 1 : cellLimite;
    // console.log(cellLimite - (24 - Math.abs(allowDrag?.hour-7)));
    if (Math.abs(allowDrag?.hour-7) > cellLimite && Math.abs(allowDrag?.hour-7) < 24 - cellLimite) {
      return 0;
    } else if (Math.abs(allowDrag?.hour-7) > cellLimite) {
      return (cellLimite - (24 - Math.abs(allowDrag?.hour-7))) * cellHeight + 10;
    } else {
      return Math.abs(allowDrag?.hour-7) * cellHeight;
    }
  };
  useEffect(() => {
    if (allowDrag && DATE_RANGE[allowDrag.date.$D]) {
      var cellLimite = Math.round((height - 300) / cellHeight - 1);
      setSize({
        width: CellPerRowWith,
        height: cellHeight/4,
        left: DATE_RANGE[allowDrag.date.$D] * (width / 8), //event.nativeEvent.absoluteX,
        top: getTopBox(),
      });
      if (Math.abs(allowDrag?.hour-7) > cellLimite && scrollRef) {
        scrollRef?.current?.scrollTo({
          y: Math.abs(allowDrag?.hour-7) * cellHeight,
          animated: false,
        });
      }
      console.log(allowDrag , (width / 8))
    }
  }, [allowDrag, DATE_RANGE]);

  const onHandleStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      dragY.current.extractOffset();
    }
    if (
      event.nativeEvent.translationX < 0 &&
      event.nativeEvent.translationY > 0
    ) {
      setSize({
        ...size,
        // width: event.nativeEvent.translationX * -1,
        height:Math.round(event.nativeEvent.translationY/ (cellHeight/4))*(cellHeight/4),
        left: getHorizontalValue(event.nativeEvent.absoluteX),
        // bottom: event.nativeEvent.absoluteY,
      });
      console.log('onBegan EVENT   1', Math.round(event.nativeEvent.translationY/ (cellHeight/4))*(cellHeight/4));
    } else if (
      event.nativeEvent.translationX > 0 &&
      event.nativeEvent.translationY < 0
    ) {
      setSize({
        ...size,
        // width: event.nativeEvent.translationX,
        height: Math.round(event.nativeEvent.translationY * -1/ (cellHeight/4))*(cellHeight/4) ,
        // right: event.nativeEvent.absoluteX,
        top: event.nativeEvent.absoluteY - 300,
      });
      console.log('onBegan EVENT  4', Math.round(event.nativeEvent.translationY/ (cellHeight/4))*(cellHeight/4));
    } else if (event.nativeEvent.translationX < 0) {
      setSize({
        ...size,
        // width: event.nativeEvent.translationX * -1,
        height: Math.round(event.nativeEvent.translationY  * -1/ (cellHeight/4))*(cellHeight/4),
        left: event.nativeEvent.absoluteX,
        // top: event.nativeEvent.absoluteY - 300,
      });
      console.log('onBegan EVENT   2', Math.round(event.nativeEvent.translationY/ (cellHeight/4))*(cellHeight/4));
    } else {
      setSize({
        ...size,
        // width: event.nativeEvent.translationX,
        height: Math.round(event.nativeEvent.translationY/ (cellHeight/4))*(cellHeight/4),
        left: getHorizontalValue(event.nativeEvent.absoluteX),
      });
      console.log('onBegan EVENT   3', Math.round(event.nativeEvent.translationY/ (cellHeight/4))*(cellHeight/4));
    }
  };
  const onGestureEvent = (event) => {
    console.log(
      `startTime:'${Math.abs(allowDrag?.hour-7)},${size.width / CellPerRowWith}
        'endTime:'${Math.abs(allowDrag?.hour-7) + size.height / cellHeight}
        'Start Date'${allowDrag.date.$D}
        'End Date'${allowDrag.date.$D +
      Math.round(size.left / (width / 8)) -
      DATE_RANGE[allowDrag.date.$D]
      }LEFT:${DATE_RANGE[allowDrag.date.$D] * CellPerRowWith}`,
      'onBegan Start',
    );
  };
  var _TIME = ((allowDrag?.hour) + size.height / cellHeight)
    .toFixed(2)
    .split('.');
    
  const _onSelected = () => {
    if (allowDrag) {
      var data = {
        startTime: (allowDrag?.hour),
        endTime: { hours: _TIME[0], min: ((_TIME[1] / 100) * 60).toFixed(0) },
        StartDate: allowDrag.date.$D,
        EndDate:
          allowDrag.date.$D +
          Math.round(size.left / (width / 8)) -
          DATE_RANGE[allowDrag.date.$D],
      };
      onSelected(data);
      setDragPermission(null);
    }
  };
  const getHorizontalValue = (value) => {
    // console.log(width / 8,CellPerRowWith, 'value 3');
    // if (Platform.OS === 'android') {
      return DATE_RANGE && Math.round(value / (width / 8))*CellPerRowWith
    // return DATE_RANGE &&
    //   DATE_RANGE[allowDrag?.date?.$D] &&
    //   DATE_RANGE[
    //   allowDrag?.date.$D +
    //   Math.round(value / (width / 8)) -
    //   DATE_RANGE[allowDrag?.date.$D]
    //   ]
    //   ? DATE_RANGE[
    //   allowDrag?.date.$D +
    //   Math.round(value / (width / 8)) -
    //   DATE_RANGE[allowDrag?.date.$D]
    //   ] *
    //   (width / 8)
    //   : value;
    // } else {
    //   return value;
    // }
  };
  var cellLimite = (height - 300) / cellHeight - 1;
  // console.log(Math.abs(allowDrag?.hour-7) > cellLimite, scrollRef?.current, 'scrollRef');
  return (
    <>
      {allowDrag != null ? (
        <PanGestureHandler
          onBegan={onGestureEvent}
          minDelta={50}
          onGestureEvent={onHandleStateChange}
          onEnded={_onSelected}
          activeOffsetX={[0, width - 60]}
          activeOffsetY={[-1, 1]}>
          <View style={styles.container}>
            {children}
            {allowDrag ? (
              <View style={[size, styles.boxBorder]}>
                <Text style={styles.time}>start: {(allowDrag?.hour)}</Text>
                <Text style={styles.addedSign}>+</Text>
                <Text style={styles.time}>
                  end: {_TIME[0]}:{((_TIME[1] / 100) * 60).toFixed(0)}
                </Text>
              </View>
            ) : null}
          </View>
        </PanGestureHandler>
      ) : (
        <View style={styles.container}>{children}</View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
    overflow: 'hidden',
  },
  boxBorder: {
    position: 'absolute',
    zIndex: -1,
    borderWidth: 2,
    borderStyle: 'dotted',
    borderColor: 'gray',
    backgroundColor: '#00A4F140',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addedSign: {
    fontSize: 13,
    color: colors.white,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 8,
    color: colors.white,
  },
});
