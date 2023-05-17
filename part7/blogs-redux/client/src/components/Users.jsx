import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { initializeUsers } from '../reducers/usersReducer'

//UI
import { Table, Header } from 'semantic-ui-react'

const Users = () => {
  const users = useSelector((state) => state.users)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeUsers())
  }, [])

  return (
    <>
      <Header as="h2">Users</Header>
      <Table striped celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>User</Table.HeaderCell>
            <Table.HeaderCell>Blogs created</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </Table.Cell>
              <Table.Cell>{user.blogs.length}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

export default Users
