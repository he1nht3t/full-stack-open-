import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'

//UI
import { Header, List } from 'semantic-ui-react'

const User = () => {
  const users = useSelector((state) => state.users)
  const navigate = useNavigate()
  const id = useParams().id

  const user = users.find((user) => user.id === id)

  const handleBlogClick = (id) => {
    navigate(`/blogs/${id}`)
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Header as="h2">{user.name}</Header>
      <Header as="h3">Added blogs</Header>
      <List bulleted>
        {user.blogs.map((blog) => (
          <List.Item as="a" key={blog.id} onClick={() => handleBlogClick(blog.id)}>
            {blog.title}
          </List.Item>
        ))}
      </List>
    </>
  )
}

export default User
