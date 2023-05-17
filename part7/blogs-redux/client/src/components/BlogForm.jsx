//UI
import { Modal, Form } from 'semantic-ui-react'

const BlogForm = ({ title, setTitle, author, setAuthor, url, setUrl }) => {
  return (
    <>
      <Modal.Header>Create New Blog</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Title</label>
            <input
              id="title"
              type="text"
              value={title}
              name="Title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Author</label>
            <input
              id="author"
              type="text"
              value={author}
              name="Author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Url</label>
            <input id="url" type="text" value={url} name="Url" onChange={({ target }) => setUrl(target.value)} />
          </Form.Field>
        </Form>
      </Modal.Content>
    </>
  )
}

export default BlogForm
