import './index.scss';
import React from 'react';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import {$_ajax} from 'services';
import {XIcon, XToggle, XModal} from 'xcomponents';
import ModifyPwd from './modify_pwd';

@inject ('TokenStore', 'UserStore')
@observer
export default class Component extends React.Component {
  static propTypes = {};

  static defaultProps = {};

  componentDidMount () {}

  componentWillReceiveProps (nextProps) {}

  signOutFn () {
    let _this = this;
    $_ajax
      .post ('bcuser/v2/login/userExit', {
        reqString: window.localStorage.getItem ('mall_web_token'),
      })
      .then (
        res => {},
        res => {
          console.log (res);
        }
      );
    _this.props.TokenStore.clearToken ();
    window.localStorage.removeItem ('mall_web_token');
    window.location.href = '/';
  }

  render () {
    return (
      <header className="main-header">
        <div className="navbar">
          <span className="control-menu" />
          <div className="ul-list" />
          <div className="tool-list">
            <XToggle className={'second-menu-toggle'}>
              <XToggle.Top>
                <XIcon type="user-info" />
                <a className="fa fa-mail tool-item">
                  {this.props.UserStore.user.username}
                </a>
                <XIcon type="angle-right" className="up-icon" />
              </XToggle.Top>
              <XToggle.Box>
                <ul className="count-toggle-box">
                  <li
                    onClick={() => {
                      XModal.Dialog (ModifyPwd, {data: {modify: true}});
                    }}
                  >
                    修改密码
                  </li>
                  <li onClick={::this.signOutFn}>退出</li>
                </ul>
              </XToggle.Box>
            </XToggle>
          </div>
        </div>
      </header>
    );
  }
}
