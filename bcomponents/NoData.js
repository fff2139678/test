/**
 * name:
 * desc:
 * date: 2018/11/24
 * author: fff
 */
import React from 'react';
import NodataImg from '../assets/no-data.png';

export default (props) => {
  const {type} = props;
  return (
    <div className={`no-data ${type}-no-data`}>
      <img src={NodataImg} alt="" />
      <div className="no-data-msg">暂无数据</div>
    </div>
  );
};
