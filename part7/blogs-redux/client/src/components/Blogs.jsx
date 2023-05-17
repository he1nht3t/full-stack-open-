import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createBlog } from '../reducers/blogsReducer'

import ReusableModal from './ReusableModal'
import BlogForm from './BlogForm'

//UI
import { Item, Button, Icon, Container } from 'semantic-ui-react'

const Blogs = () => {
  const blogs = useSelector(({ blogs }) => [...blogs].sort((a, b) => b.likes - a.likes))
  const loginUser = useSelector((state) => state.loginUser)
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async () => {
    dispatch(createBlog({ title, author, url }))
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const navigate = useNavigate()

  const handleOnClick = (id) => {
    navigate(`/blogs/${id}`)
  }

  return (
    <Container>
      {loginUser && (
        <ReusableModal buttonLabel="Create New Blog" handleSubmit={handleSubmit}>
          <BlogForm title={title} setTitle={setTitle} author={author} setAuthor={setAuthor} url={url} setUrl={setUrl} />
        </ReusableModal>
      )}
      <Item.Group divided>
        {blogs.map((blog) => (
          <Item className="blog" key={blog.id}>
            <Item.Content>
              <Item.Header as="h2">{blog.title}</Item.Header>
              <Item.Meta>
                <span className="cinema">by {blog.author}</span>
              </Item.Meta>
              <Item.Extra>
                <Button primary floated="right" onClick={() => handleOnClick(blog.id)}>
                  Read More
                  <Icon name="right chevron" />
                </Button>
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Container>
  )
}

export default Blogs
