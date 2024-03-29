import React from 'react'
import './index.scss'
import XToggle from '../../Toggle/src'
import XIcon from '../../Icon/src'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultValue: this.props.defaultValue,
      optsions: [],
      mapOptions: new Map(),
      isActive: false,
      selectIndex: -1,
    }
  }

  componentDidMount() {
    this.processData(this.props)
  }

  componentWillReceiveProps(newProps) {
    // 外部参数改变,就再重新更新数据，重新渲染
    if (
      this.props.options !== newProps.options ||
      this.props.defaultValue !== newProps.defaultValue
    ) {
      this.processData(newProps)
    }
  }

  processData(props) {
    // 预处理数据
    let originOpts = props.options || []
    let optionsMap = new Map()
    // let selected = props.selected;
    let defaultValue =
      props.defaultValue !== undefined ? props.defaultValue : -1
    let selectIndex = -1

    originOpts.map((item, index) => {
      optionsMap.set(index, item)
      if (defaultValue == item.value) {
        // 暂时用非全等
        selectIndex = index
      }
    })

    this.setState({
      mapOptions: optionsMap,
      selectIndex: selectIndex,
    })
  }

  itemClick(item, index) {
    this.setState(
      {
        selectIndex: index,
      },
      () => this.props.onChange(item)
    )
  }

  render() {
    let mainTransform = {fontSize: 'normal'}
    let selected = this.state.mapOptions.get(this.state.selectIndex)
    return (
      <XToggle className="selector-wrapper">
        <XToggle.Top>
          <div key={'radio_first'} ref={'dropHeader'} className="drop-header">
            <input
              type="text"
              value={selected ? selected.label : ''}
              placeholder={this.props.placeholder || '请选择'}
              readOnly={true}
            />
            <XIcon
              type="angle-right"
              className="up-icon dropdown-select-icon"
            />
          </div>
        </XToggle.Top>
        <XToggle.Box className={`drop-main-selector`}>
          <div
            key={'radio_two'}
            ref={'dropMain'}
            className={`drop-main`}
            style={mainTransform}
          >
            <ul className="drop-list" onClick={this.itemClick.bind(this)}>
              {[...this.state.mapOptions].map((item, index) => {
                let itemCls = index == this.state.selectIndex ? 'selected' : ''
                return (
                  <li
                    key={`radio_${index}`}
                    className={`${itemCls}`}
                    onClick={this.itemClick.bind(this, item[1], index)}
                    index={index}
                    value={item[1].value}
                  >
                    {item[1].label}
                  </li>
                )
              })}
            </ul>
          </div>
        </XToggle.Box>
      </XToggle>
    )
  }
}
