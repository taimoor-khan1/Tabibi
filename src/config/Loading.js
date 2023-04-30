import Loading from 'react-native-loader-overlay';
import Colors from '../config/Colors';

class LoaderOverlay {
  show() {
    return Loading.show({
      color: Colors.darkWhite,
      size: 30,
      overlayColor: 'rgba(0,0,0,0.4)',
      closeOnTouch: true,
      loadingType: 'Spinner', // 'Bubbles', 'DoubleBounce', 'Bars', 'Pulse', 'Spinner'
    });
  }

  hide(loader) {
    Loading.hide(loader);
  }
}

export default new LoaderOverlay();
