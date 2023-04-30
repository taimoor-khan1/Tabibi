import axios from 'axios';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';
import config from '.';
import Loading from './Loading';
import Snackbar from 'react-native-snackbar';
import fonts from '../assets/fonts';
import colors from '../config/Colors';
import {changeStack} from './NavigationService';
import labels from './Labels';
class Api {
  async _post(baseURL, endPoint, params, is_loading, extraHeader = {}) {
    // console.log(baseURL + endPoint);
    var token = await AsyncStorage.getItem('token_detail');
    if (token == null) {
      this.instance = axios.create({
        baseURL: baseURL,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          ...extraHeader,
        },
      });
    } else {
      this.instance = axios.create({
        baseURL: baseURL,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=UTF-8',
          Authorization: 'Bearer' + ' ' + JSON.parse(token).accessToken,
        },
      });
    }
    if (is_loading === true) {
      this.loading = Loading.show();
    }
    return this.instance
      .post(endPoint, params)
      .then((response) => {
        if (is_loading === true) {
          Loading.hide(this.loading);
        }
        // if (response.status === 401) {
        //   return this._sessionExpired();
        // }
        return response;
      })
      .catch((error) => {
        if (is_loading === true) {
          Loading.hide(this.loading);
        }
        if (error.response.status === 500) {
          // Toast.show(error.response.data.message);
        }
        if (error.response.status === 502) {
          // Toast.show('Server is down');
        }
        // console.log('err', error.response);
        // console.log('msg', error.message);
        // console.log('req', error.request);
        if (error.response.status === 502) {
          // Toast.show('Server is down');
        }
        // if (error.response.status === 401) {
        //   return this._sessionExpired();
        // }
        if (error.response.status === 413) {
          Toast.show('Uploaded file is too large');
        }
        return error.response.data;
      });
  }
  async _get(baseURL, endPoint, params, is_loading) {
    // console.log(baseURL + endPoint);
    var token = await AsyncStorage.getItem('token_detail');
    if (token === null) {
      this.instance = axios.create({
        baseURL: baseURL,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      });
    } else {
      this.instance = axios.create({
        baseURL: baseURL,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          Authorization: 'Bearer' + ' ' + JSON.parse(token).accessToken,
        },
      });
    }
    if (is_loading === true) {
      this.loading = Loading.show();
    }
    return this.instance
      .get(endPoint, params)
      .then((response) => {
        if (is_loading === true) {
          Loading.hide(this.loading);
        }
        // if (response.status === 401) {
        //   return this._sessionExpired();
        // }
        return response;
      })
      .catch((error) => {
        if (is_loading === true) {
          Loading.hide(this.loading);
        }
        if (error.response.status === 500) {
          Toast.show(error.response.data.message);
        }
        if (error.response.status === 502) {
          // Toast.show('Server is down');
        }
        // console.log('err', error.response);
        // console.log('msg', error.message);
        // console.log('req', error.request);
        // if (error.response.status === 401) {
        //   return this._sessionExpired();
        // }
        return error.response.data;
      });
  }
  async _put(baseURL, endPoint, params, is_loading) {
    // console.log(baseURL + endPoint);
    var token = await AsyncStorage.getItem('token_detail');
    if (token === null) {
      this.instance = axios.create({
        baseURL: baseURL,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      });
    } else {
      this.instance = axios.create({
        baseURL: baseURL,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          Authorization: 'Bearer' + ' ' + JSON.parse(token).accessToken,
        },
      });
    }
    if (is_loading === true) {
      this.loading = Loading.show();
    }
    return this.instance
      .put(endPoint, params)
      .then((response) => {
        if (is_loading === true) {
          Loading.hide(this.loading);
        }
        // if (response.status === 401) {
        //   return this._sessionExpired();
        // }
        return response;
      })
      .catch((error) => {
        if (is_loading === true) {
          Loading.hide(this.loading);
        }
        if (error.response.status === 500) {
          // Toast.show(error.response.data.message);
        }
        if (error.response.status === 502) {
          // Toast.show('Server is down');
        }
        // console.log('err', error.response);
        // console.log('msg', error.message);
        // console.log('req', error.request);
        // if (error.response.status === 401) {
        //   return this._sessionExpired();
        // }
        return error.response.data;
      });
  }
  async _patch(baseURL, endPoint, params, is_loading) {
    // console.log(baseURL + endPoint);
    var token = await AsyncStorage.getItem('token_detail');
    console.log(token, ' Token')
    if (token === null) {
      this.instance = axios.create({
        baseURL: baseURL,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      });
    } else {
      this.instance = axios.create({
        baseURL: baseURL,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          Authorization: 'Bearer' + ' ' + JSON.parse(token).accessToken,
        },
      });
    }
    if (is_loading === true) {
      this.loading = Loading.show();
    }
    return this.instance
      .patch(endPoint, params)
      .then((response) => {
        if (is_loading === true) {
          Loading.hide(this.loading);
        }
        // if (response.status === 401) {
        //   return this._sessionExpired();
        // }
        return response;
      })
      .catch((error) => {
        if (is_loading === true) {
          Loading.hide(this.loading);
        }
        if (error.response.status === 500) {
          // Toast.show(error.response.data.message);
        }
        if (error.response.status === 502) {
          // Toast.show('Server is down');
        }
        // console.log('err', error.response);
        // console.log('msg', error.message);
        // console.log('req', error.request);
        // if (error.response.status === 401) {
        //   return this._sessionExpired();
        // }
        return error.response.data;
      });
  }
  async _delete(baseURL, endPoint, params, is_loading) {
    // console.log(baseURL + endPoint);
    var token = await AsyncStorage.getItem('token_detail');
    if (token === null) {
      this.instance = axios.create({
        baseURL: baseURL,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      });
    } else {
      this.instance = axios.create({
        baseURL: baseURL,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          Authorization: 'Bearer' + ' ' + JSON.parse(token).accessToken,
        },
      });
    }
    if (is_loading === true) {
      this.loading = Loading.show();
    }
    return this.instance
      .delete(endPoint, params)
      .then((response) => {
        if (is_loading === true) {
          Loading.hide(this.loading);
        }

        // if (response.status === 401) {
        //   return this._sessionExpired();
        // }
        return response;
      })
      .catch((error) => {
        if (is_loading === true) {
          Loading.hide(this.loading);
        }
        if (error.response.status === 500) {
          // Toast.show(error.response.data.message);
        }
        if (error.response.status === 502) {
          // Toast.show('Server is down');
        }
        // console.log('err', error.response);
        // console.log('msg', error.message);
        // console.log('req', error.request);

        // if (error.response.status === 401) {
        //   return this._sessionExpired();
        // }
        return error.response.data;
      });
  }

  //FOR TOKEN EXPIRE SESSION EXPIRE
  async _sessionExpired() {
    // Snackbar.show({
    //   text: 'Session Expired !!!',
    //   duration: Snackbar.LENGTH_LONG,
    //   backgroundColor: colors.themeColor,
    //   fontFamily: fonts.PoppinsMedium,
    //   textColor: colors.dim,
    //   action: {
    //     text: 'Retry Later',
    //     textColor: colors.dim,
    //   },
    // });
    // await AsyncStorage.removeItem('token_detail');
    // await AsyncStorage.removeItem('user_detail');
    // changeStack('LoginStack');
  }
}

export default new Api();
