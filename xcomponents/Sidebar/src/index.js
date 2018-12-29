import './index.scss';
import React from 'react';
import MenuItem from './menu_item';
import MenuTree from './menu_tree';
import MenuOnly from './menu_only';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';

@withRouter
@inject ('UserStore')
@observer
export default class extends React.Component {
  constructor (props) {
    super ();
    this.state = {
      locationKey: props.location.key,
      nowId: null,
      menuList: props.UserStore.firMenuArr,
    };
  }

  static getDerivedStateFromProps (newProps, state) {
    if (state.locationKey !== newProps.location.key) {
      return {
        menuList: newProps.UserStore.firMenuArr,
      };
    }
    return null;
  }

  render () {
    return (
      <aside key={'aside'} className="xcomponent-sidebar">
        <ul className="siderbar-menu">
          {this.state.menuList &&
            this.state.menuList.map (item => {
              return item.children.length === 0
                ? <MenuOnly data={item} key={item.id} />
                : <MenuTree data={item} key={item.id} />;
            })}
        </ul>
      </aside>
    );
  }
}
