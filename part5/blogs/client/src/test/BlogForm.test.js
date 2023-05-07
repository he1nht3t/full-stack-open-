import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from '../components/BlogForm'

test('new blog form calls event handler with correct details', async () => {
  const user = userEvent.setup()
  const mockHandler = jest.fn()

  const { container } = render(<BlogForm addNewBlog={mockHandler} />)

  const title = container.querySelector('#title')
  const author = container.querySelector('#author')
  const url = container.querySelector('#url')

  await user.type(title, 'New Blog Title')
  await user.type(author, 'New Blog Author')
  await user.type(url, 'New Blog URL')

  const button = screen.getByText('Create')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0].title).toBe('New Blog Title')
  expect(mockHandler.mock.calls[0][0].author).toBe('New Blog Author')
  expect(mockHandler.mock.calls[0][0].url).toBe('New Blog URL')
})
