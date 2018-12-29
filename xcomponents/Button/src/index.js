import './index.scss';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class extends React.Component {
  static defaultProps = {
    type: 'default',
    size: 'md',
  };

  static propTypes = {
    type: PropTypes.oneOf (['primary', 'default', 'warning']),
    size: PropTypes.oneOf (['md', 'xs', 'sm', 'lg', 'sg']),
  };

  render () {
    var btnClass = classnames ({
      'xcomponent-btn': true,
      'xcomponent-btn-primary': this.props.type === 'primary',
      'xcomponent-btn-warning': this.props.type === 'warning',
      'xcomponent-btn-lg': this.props.size === 'lg',
      'xcomponent-btn-sm': this.props.size === 'sm',
      'xcomponent-btn-xs': this.props.size === 'xs',
      'xcomponent-btn-sg': this.props.size === 'sg',
      'xcomponent-btn-inverse': this.props.inverse,
    });

    return (
      <button {...this.props} className={btnClass}>
        {this.props.children}
      </button>
    );
  }
}
