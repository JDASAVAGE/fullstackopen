/* eslint-disable no-undef */
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
describe("Blog component tests",() => {
  let blog = {
    title:"The Shoe Dog",
    author:"Phil Knight",
    url:"https://nike.com/",
    likes:20,
    user:{
      name:"Jerome"
    }
  }
  let mockLikeBlog = jest.fn()
  let mockDeleteBlog = jest.fn()
  test("renders blog title and author, but not URL or likes by default ",() => {
    const component = render(
      <Blog blog={blog} handleLikes={mockLikeBlog} handleDeletions={mockDeleteBlog} />
    )
    expect(component.container).toHaveTextContent(
      'The Shoe Dog Phil Knight')

  })
  test("renders URL and likes upon click",async () => {
    const component= render(
      <Blog blog={blog} handleLikes={mockLikeBlog} handleDeletions={mockDeleteBlog} />
    )
    const user = userEvent.setup()
    const button=component.container.querySelector('.togglingbutton')
    await user.click(button)
    expect(component.container).toHaveTextContent(
      "https://nike.com/")
    expect(component.container).toHaveTextContent(
      "20")
  })
  test("handleLikes event handler called twice when like button clicked twice",async () => {
    const component= render(
      <Blog blog={blog} handleLikes={mockLikeBlog} handleDeletions={mockDeleteBlog} />)
    const user = userEvent.setup()
    const button=component.container.querySelector('.likebutton')
    await user.click(button)
    await user.click(button)
    expect(mockLikeBlog.mock.calls).toHaveLength(2)
  })

})