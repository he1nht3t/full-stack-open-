import React from 'react'
import PropTypes from 'prop-types'

//UI
import { Modal, Form } from 'semantic-ui-react'

const LoginForm = ({ username, password, setUsername, setPassword }) => {
  LoginForm.propTypes = {
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    setUsername: PropTypes.func.isRequired,
    setPassword: PropTypes.func.isRequired,
  }
  return (
    <>
      <Modal.Header>Login to application</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Username</label>
            <input
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </Form.Field>
        </Form>
      </Modal.Content>
    </>
  )
}

export default LoginForm
