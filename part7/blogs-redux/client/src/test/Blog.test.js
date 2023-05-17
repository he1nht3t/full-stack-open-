import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'

// Components
import Blog from '../components/Blog'

const blog = {
  title: 'Javascript30',
  author: 'Wes Bos',
  url: 'https://javascript30.com',
  likes: 11,
  user: { username: 'alice', name: 'Alice', id: '641d791a8117a6afc7edc2aa' },
  id: '64549598297ed301696e86bc',
}

test('render blog without URL and Likes', () => {
  const { container } = render(<Blog blog={blog} />)
  const div = container.querySelector('.blog')

  expect(div).toHaveTextContent('Javascript30')
  expect(div).toHaveTextContent('Wes Bos')
  expect(div).not.toHaveTextContent('https://javascript30.com')
  expect(div).not.toHaveTextContent('11')
})

test('render blog with URL and Likes', async () => {
  const user = userEvent.setup()

  const { container } = render(<Blog blog={blog} />)
  const div = container.querySelector('.blog')

  const button = screen.getByText('view')
  await user.click(button)

  expect(div).toHaveTextContent('Javascript30')
  expect(div).toHaveTextContent('Wes Bos')
  expect(div).toHaveTextContent('https://javascript30.com')
  expect(div).toHaveTextContent('11')
})

test('clicking the like button twice calls event handler twice', async () => {
  const user = userEvent.setup()
  const mockHandler = jest.fn()

  render(<Blog blog={blog} updateBlog={mockHandler} />)

  const button = screen.getByText('view')
  await user.click(button)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
