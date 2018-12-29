/*
* 工具方法
* */
import md5 from 'md5';
import $_date from './date';

export default {
  signFn (data) {
    // 签名
    let str = md5 (JSON.stringify (data) + 'aj2ung7829njqp');
    return (
      str.charAt (20) +
      str.charAt (17) +
      str.charAt (1) +
      str.charAt (1) +
      str.charAt (0) +
      str.charAt (7)
    );
  },
  salt (str, pass = 'nd387y29gl') {
    // 加盐
    return md5 (str + pass);
  },
  formatPercent (val) {
    // 百分比格式化
    return val >= 1
      ? '100.00%'
      : val <= -1 ? '-100.00%' : Number (val * 100).toFixed (2) + '%';
  },
  debounce (time, handler) {
    /*
        * 防抖函数
        * */
    let last;
    return function () {
      let ctx = this;
      let args = arguments;
      clearTimeout (last);
      last = setTimeout (function () {
        handler.apply (ctx, args);
      }, time);
    };
  },
  getDistributeByArr (dimension, res) {
    /*
        * 获取时间维度信息
        * */
    let distributeObj = {};
    switch (dimension) {
      case 1:
        distributeObj = {
          arrList: [
            {
              id: 0,
              name: '时',
            },
          ],
          curId: 0,
        };
        break;
      case 2:
        distributeObj = {
          arrList: [
            {
              id: 0,
              name: '时',
            },
            {
              id: 1,
              name: '日',
            },
          ],
          curId: 0,
        };
        break;
      case 3:
        distributeObj = {
          arrList: [
            {
              id: 1,
              name: '日',
            },
          ],
          curId: 1,
        };
        break;
      case 4:
        if (res.length === 1) {
          distributeObj = {
            arrList: [
              {
                id: 0,
                name: '时',
              },
              {
                id: 1,
                name: '日',
              },
            ],
            curId: 0,
          };
        } else {
          let dayOfRange = (res[1] - res[0]) / (1000 * 3600 * 24);
          if (dayOfRange >= 7) {
            distributeObj = {
              arrList: [
                {
                  id: 1,
                  name: '日',
                },
              ],
              curId: 1,
            };
          } else {
            distributeObj = {
              arrList: [
                {
                  id: 0,
                  name: '时',
                },
                {
                  id: 1,
                  name: '日',
                },
              ],
              curId: 0,
            };
          }
        }
        break;
      case 5:
        let dayOfRange = (res[1] - res[0]) / (1000 * 3600 * 24);
        if (dayOfRange >= 28) {
          distributeObj = {
            arrList: [
              {
                id: 2,
                name: '周',
              },
            ],
            curId: 2,
          };
        } else if (dayOfRange >= 7) {
          distributeObj = {
            arrList: [
              {
                id: 1,
                name: '日',
              },
              {
                id: 2,
                name: '周',
              },
            ],
            curId: 1,
          };
        } else {
          distributeObj = {
            arrList: [
              {
                id: 0,
                name: '时',
              },
              {
                id: 1,
                name: '日',
              },
            ],
            curId: 0,
          };
        }
        break;
      default:
        let Months = $_date.getMonthsNum (res[0], res[1]);
        if (Months > 3) {
          distributeObj = {
            arrList: [
              {
                id: 3,
                name: '月',
              },
            ],
            curId: 3,
          };
        } else if (Months > 1) {
          distributeObj = {
            arrList: [
              {
                id: 2,
                name: '周',
              },
              {
                id: 3,
                name: '月',
              },
            ],
            curId: 2,
          };
        } else {
          distributeObj = {
            arrList: [
              {
                id: 1,
                name: '日',
              },
            ],
            curId: 1,
          };
        }
        break;
    }
    return distributeObj;
  },
};
