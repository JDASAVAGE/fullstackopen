/* eslint-disable no-undef */
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blogform from './BlogForm'
test("adding a new blog works",async () => {
  let handleCreation=jest.fn()
  render(<Blogform handleCreation={handleCreation}></Blogform>)
  const user= userEvent.setup()
  var input=screen.getByPlaceholderText("write title here")
  await userEvent.type(input,"testing a blog submission")
  var input2=screen.getByPlaceholderText("write author here")
  await userEvent.type(input2,"jest and user event")
  var input3=screen.getByPlaceholderText("write url here")
  await userEvent.type(input3,"www.stevejobs.com")
  const submitButton=screen.getByText("create")
  await userEvent.click(submitButton)
  expect(handleCreation.mock.calls).toHaveLength(1)
  expect(handleCreation).toHaveBeenCalledWith({
    title: "testing a blog submission",
    author: "jest and user event",
    url: "www.stevejobs.com"
  })

})