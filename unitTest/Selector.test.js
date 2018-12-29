import React from 'react'
import {shallow, mount} from 'enzyme'
import Selector from 'xcomponents/Selector/src'
import XToggle from 'xcomponents/Toggle/src'

const setup = ({...props}) => {
  const wrapper = shallow(<Selector {...props} />)
  const mountWrapper = mount(<Selector {...props} />)
  return {
    props,
    wrapper,
    mountWrapper,
  }
}

describe('Selector lifeCycle', () => {
  let component
  beforeEach(() => {
    component = mount(<Selector />)
  })
  it('componentDidMount', () => {
    Selector.prototype.componentDidMount = jest.fn()
    expect(Selector.prototype.componentDidMount.calledOnce).toBeTruthy
  })

  it('componentDidUpdate', () => {
    component.setProps({
      cardType: 'Person',
    })
    Selector.prototype.componentDidUpdate = jest.fn()
    expect(Selector.prototype.componentDidUpdate.calledOnce).toBeTruthy
  })
})

describe('Selector events', () => {
  it('simulates click events', () => {
    const {mountWrapper, props} = setup({
      // Jest 提供的mock 函数
      onChange: jest.fn(e => {}),
    })
    // 通过 Enzyme 提供的 simulate api 模拟 DOM 事件
    mountWrapper.find('.drop-list').simulate('click')
    // 判断 props.onChange 是否被调用
    expect(props.onChange).toBeCalled()
  })
})

describe('Selector', () => {
  Selector.prototype.methodName = jest.fn()
  const {wrapper, props} = setup({
    // Jest 提供的mock 函数
    onChange: jest.fn(e => {}),
  })
  // case1
  // 通过查找是否存在 Input,测试组件正常渲染
  it('Selector Component should render', () => {
    //.find(selector) 是 Enzyme shallow Rendering 提供的语法, 用于查找节点
    // 详细用法见 Enzyme 文档 http://airbnb.io/enzyme/docs/api/shallow.html
    expect(wrapper.find(XToggle).exists())
    expect(wrapper.type()).toEqual(XToggle)
  })
})
