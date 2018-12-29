/**
 * Created by Rayr Lee on 2017/12/18.
 */

export default {
  get (k) {
    return window.localStorage.getItem (`mall_web_${k}`);
  },
  set (k, v) {
    window.localStorage.setItem (`mall_web_${k}`, v);
  },
  delete (k) {
    window.localStorage.removeItem (`mall_web_${k}`);
  },
};
