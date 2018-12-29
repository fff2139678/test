import React, {Component} from "react";
import classnames from 'classnames';

export default (props) => {
    return (
        <i className={classnames('rayricon', 'rayricon-' + props.type, props.className)} onClick={(e) => {
            props.onClick && props.onClick(e)
        }}></i>
    );
};