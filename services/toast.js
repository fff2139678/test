import {toast} from 'react-toastify';
import React from 'react';
import {XIcon} from 'xcomponents';

export default function (msg, type = 'info') {
  toast[type] (
    <div className={`toast-content-${type}`}><XIcon type="alarm" />{msg}</div>
  );
}
