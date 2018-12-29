import React from 'react'
import {shallow} from 'enzyme'
import Button from 'xcomponents/Button/src'

const setup = ({...props}) => {
  const wrapper = shallow(<Button {...props} />)
  return {
    props,
    wrapper,
  }
}

describe('Button', () => {
  const type = ['primary', 'default', 'warning']
  const size = ['md', 'xs', 'sm', 'lg', 'sg']
  const app = setup({
    type: type[Math.floor(Math.random() * type.length)],
    size: size[Math.floor(Math.random() * size.length)],
  })
  it('Button props check', () => {
    expect(type).toContain(app.wrapper.props().type)
    expect(size).toContain(app.wrapper.props().size)
    expect(app.wrapper.props().children).toBeUndefined
  })
  it('Button component type check', () => {
    expect(app.wrapper.type()).toEqual('button')
  })
})
