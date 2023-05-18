import { useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { useParams, useNavigate } from 'react-router-dom'

import { deleteBlog, likeBlog, commentBlog } from '../reducers/blogsReducer'

//UI
import { Item, Button, Comment, Form, Header, Divider } from 'semantic-ui-react'

const Blog = () => {
  const [comment, setComment] = useState('')

  const blogs = useSelector(({ blogs }) => blogs)
  const loginUser = useSelector(({ loginUser }) => loginUser)

  const id = useParams().id
  const navigate = useNavigate()

  const blog = blogs.find((blog) => blog.id === id)

  const dispatch = useDispatch()

  const removeBlog = (blogObject) => {
    if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)) {
      dispatch(deleteBlog(blogObject.id))
      navigate('/')
    }
  }

  const handleLike = (blog) => {
    const newBlogObject = {
      ...blog,
      likes: blog.likes + 1,
    }
    dispatch(likeBlog(newBlogObject))
  }

  const handleComment = () => {
    dispatch(commentBlog(blog.id, comment))
    setComment('')
  }

  if (!blog) {
    return null
  }

  return (
    <Item>
      <Item.Content>
        <Item.Header as="h2">{blog.title}</Item.Header>
        <Item.Meta>
          <b>Author: </b>
          {blog.author}
        </Item.Meta>
        <Item.Description>
          <span>
            <b>URL: </b>
            <a href={blog.url}>{blog.url}</a>
          </span>
          <Divider hidden />
          <p>
            {blog.likes} likes
            <Button color="pink" circular inverted size="mini" icon="heart" onClick={() => handleLike(blog)} />
          </p>
          <i>Added by {blog.user.name}</i>
          {blog.user.username === loginUser?.username && (
            <Button color="red" inverted size="mini" icon="trash" onClick={() => removeBlog(blog)} />
          )}
        </Item.Description>
        <Divider hidden />
        <Item.Extra>
          <Header as="h3">Comments</Header>
          <Comment.Group>
            {blog.comments.map((comment, index) => (
              <Comment key={index}>
                <Comment.Content>
                  <Comment.Text>{comment}</Comment.Text>
                </Comment.Content>
              </Comment>
            ))}
          </Comment.Group>
          <Form onSubmit={handleComment}>
            <Form.Field>
              <input type="text" value={comment} onChange={({ target }) => setComment(target.value)} />
            </Form.Field>
            <Button type="submit">Add Comment</Button>
          </Form>
        </Item.Extra>
      </Item.Content>
    </Item>
  )
}

export default Blog
