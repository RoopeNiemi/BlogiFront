import React from 'react'
import {shallow} from 'enzyme'
import SimpleBlog from './SimpleBlog'

describe.only('<SimpleBlog />', ()=>{
    it('renders content',()=>{
        const simpleblog={
            title:'Blogs and their uses',
            author: 'Ron Testman',
            likes:0
        }
        const SimpleBlogComponent=shallow(<SimpleBlog blog={simpleblog}/>)
        const blogInfoDiv=SimpleBlogComponent.find('.blogInfo')
        expect(blogInfoDiv.text()).toContain(simpleblog.title)
        expect(blogInfoDiv.text()).toContain(simpleblog.author)
        const blogLikesDiv=SimpleBlogComponent.find('.blogLikes')
        expect(blogLikesDiv.text()).toContain(simpleblog.likes)
    })

    it('clicking the like button twice calls the event handler twice',()=>{
    const simpleblog={
        title:'Like-button in Facebook',
        author: 'someone',
        likes:0
    }
    const mockHandler=jest.fn()
    const SimpleBlogComponent=shallow(<SimpleBlog blog={simpleblog} onClick={mockHandler}/>)

    const button=SimpleBlogComponent.find('button')
    button.simulate('click')
    button.simulate('click')

    expect(mockHandler.mock.calls.length).toBe(2)

    })
})