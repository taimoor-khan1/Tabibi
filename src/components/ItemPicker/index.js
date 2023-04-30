import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import {SafeAreaView} from 'react-native-safe-area-context';

const ReactNativePickerModule = ({
  pickerRef,
  value,
  items,
  title,
  onValueChange,
  cancelButton,
  confirmButton,
  onCancel,
  contentContainerStyle,
  titleStyle,
  itemStyle,
  useNativeDriver,
  confirmButtonDisabledTextStyle,
  confirmButtonEnabledTextStyle,
  cancelButtonTextStyle,
  backdropColor,
  backdropOpacity,
  selectedColor,
  confirmButtonStyle,
  cancelButtonStyle,
}) => {
  const dismissPress = () => {
    setIsVisible(false);
    if (onCancel) {
      onCancel();
    }
  };
  const [isVisible, setIsVisible] = useState(false);
  const [selected, setSelected] = useState({index: 0});
  const [selectedValue, setSelectedValue] = useState();
  const setDefaultSelectedValue = () =>
    setSelectedValue(
      !value
        ? typeof items[0] === 'object'
          ? items[0].value
          : items[0]
        : value,
    );
  useEffect(() => {
    pickerRef.current = {
      show: () => setIsVisible(true),
      hide: dismissPress,
    };
  });

  const EmptyListMessage = ({item}) => {
    return (
      // Flat List Item
      <Text style={styles.emptyListStyle} onPress={() => getItem(item)}>
        No Data Found
      </Text>
    );
  };

  const ItemView = ({item, index}) => {
    return (
      <View style={styles.itemStyle}>
        {item?.icon()}
        <Text
          style={{
            color: index + 1 === selected.index ? selectedColor : undefined,
          }}>
          {item.date}
        </Text>
      </View>
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  const ListHeader = () => {
    //View to set in Header
    return <View style={styles.headerFooterStyle} />;
  };

  const ListFooter = () => {
    //View to set in Footer
    return <View style={styles.headerFooterStyle} />;
  };

  const getItem = (item) => {
    // Function for click on an item
    alert('Id : ' + item.id + ' Title : ' + item.title);
  };
  const _onViewableItemsChanged = useCallback(({viewableItems, changed}) => {
    // console.log('Changed in this iteration', {
    //   ...changed[0],
    //   index: changed[0].index - 2,
    // });
    setSelectedValue(changed[0].item.value);
    setSelected({...changed[0], index: changed[0].index});
  }, []);

  const _viewabilityConfig = {
    itemVisiblePercentThreshold: 10,
  };

  const handleScroll = (event) => {
    let yOffset = event.nativeEvent.contentOffset.y;
    let contentHeight = event.nativeEvent.contentSize.height;
    let value = yOffset / contentHeight;
    console.log(
      event.nativeEvent,
      items.length,
      yOffset / event.nativeEvent.contentOffset.y,
    );
  };

  return (
    <Modal
      backdropColor={backdropColor}
      backdropOpacity={backdropOpacity}
      onBackdropPress={dismissPress}
      onBackButtonPress={dismissPress}
      onShow={setDefaultSelectedValue}
      useNativeDriver={useNativeDriver}
      isVisible={isVisible}
      style={{justifyContent: 'flex-end'}}
      hideModalContentWhileAnimating={true}>
      <View style={[styles.content, contentContainerStyle]}>
        <View style={styles.titleView}>
          <Text style={[styles.titleText, titleStyle]}>{title}</Text>
        </View>
        <View
          // itemStyle={itemStyle}
          // selectedValue={selectedValue}
          style={{maxHeight: 200, overflow: 'hidden'}}
          // onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
        >
          <FlatList
            onViewableItemsChanged={_onViewableItemsChanged}
            viewabilityConfig={_viewabilityConfig}
            initialNumToRender={1}
            // pagingEnabled
            onScroll={handleScroll}
            data={items}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            //Header to show above listview
            ListHeaderComponent={ListHeader}
            //Footer to show below listview
            ListFooterComponent={ListFooter}
            renderItem={ItemView}
            ListEmptyComponent={EmptyListMessage}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={value === selectedValue}
          onPress={() => {
            onValueChange(selectedValue);
            setIsVisible(false);
          }}
          style={[styles.confirmButtonView, confirmButtonStyle]}>
          <Text
            style={[
              styles.confirmButtonText,
              selectedValue === value
                ? confirmButtonDisabledTextStyle
                : confirmButtonEnabledTextStyle,
            ]}>
            {confirmButton}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cancelButton}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.cancelButtonView, cancelButtonStyle]}
          onPress={dismissPress}>
          <Text style={[styles.cancelButtonText, cancelButtonTextStyle]}>
            {cancelButton}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  confirmButtonView: {
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(165,165,165,0.2)',
    paddingVertical: 15,
  },
  confirmButtonText: {
    fontWeight: '500',
    fontSize: 18,
    textAlign: 'center',
  },
  cancelButton: {
    marginVertical: 10,
  },
  cancelButtonView: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
  },
  cancelButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    color: 'rgba(0,122,255,1)',
  },
  titleView: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(165,165,165,0.2)',
  },
  titleText: {
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
    color: '#bdbdbd',
  },
  emptyListStyle: {
    padding: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  itemStyle: {
    padding: 10,
    minHeight: 50,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  headerFooterStyle: {
    width: '100%',
    height: 30,
  },
  textStyle: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    padding: 7,
  },
});

ReactNativePickerModule.defaultProps = {
  confirmButtonEnabledTextStyle: {
    color: 'rgba(0,122,255,1)',
  },
  confirmButtonDisabledTextStyle: {
    color: 'rgba(0,0,0,0.2)',
  },
  cancelButton: 'Cancel',
  confirmButton: 'Confirm',
  useNativeDriver: true,
};

export default ReactNativePickerModule;
