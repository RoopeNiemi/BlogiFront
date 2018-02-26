import React from 'react'
import {shallow} from 'enzyme'
import OneBlog from './blogItem'
import TogglableText from './TogglableText'
describe.only('<TogglableText />',()=>{
    let togglableTextComponent
    beforeEach(()=>{
      const user={
          name:'Ron Tester'
      }
        togglableTextComponent=shallow(
            <TogglableText textLabel='Testing by Ron the Author'>
                 <OneBlog title='title'
            author='author'
            url='url'
            likes='0'
            user={user}/>
            </TogglableText>
        )
    })
    it('renders its children',()=>{
      expect(togglableTextComponent.contains('Testing by Ron The Author'))
    })

    it('at start the children are not displayed',()=>{
        const div=togglableTextComponent.find('.toggledText')
        expect(div.getElement().props.style).toEqual({display: 'none'})
    })

    it('after clicking the text children are displayed', () => {
        const text = togglableTextComponent.find('h3')
        text.simulate('click')
        const div = togglableTextComponent.find('.toggledText')
        expect(div.getElement().props.style).toEqual({ display: '' })
      })

})