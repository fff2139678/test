/*
* ajax异步请求方法
* */
import axios from 'axios';
import $_url from './url';
import $_util from './util';
import $_toast from './toast';

axios.defaults.headers.common['clientType'] = 0;

export default {
  post (url, params = {}) {
    return new Promise ((resolve, reject) => {
      let realParams = $_url.initDel (params); // 过滤参数
      axios.defaults.headers.common[
        'accessToken'
      ] = window.localStorage.getItem ('mall_web_token');
      axios.defaults.headers.common['accessSign'] = $_util.signFn (realParams);
      axios
        .post (`/${url}`, realParams)
        .then (res => {
          if (res.status === 200) {
            switch (res.data.code) {
              case 100000:
                resolve (res.data.data);
                break;
              case 100006:
                window.location.href = `/login?redirect_url=${encodeURIComponent (location.href)}&type=mall`;
                break;
              case 100008:
                window.location.href = `/login?redirect_url=${encodeURIComponent (location.href)}&type=mall`;
                break;
              default:
                reject (res.data);
                break;
            }
          } else {
            console.warn (res.status);
            reject (res.status);
          }
        })
        .catch (err => {
          reject (err);
        });
    });
  },
};
