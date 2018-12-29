/**
 * Created by Rayr Lee on 2018/6/13.
 */
import {$_ajax} from './index';

export default {
  user () {
    return $_ajax.post ('bcuser/v1/user/getUserInfo');
  },
};
