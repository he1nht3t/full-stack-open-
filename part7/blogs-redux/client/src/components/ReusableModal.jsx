import { useState } from 'react'
import PropTypes from 'prop-types'

//UI
import { Button, Modal } from 'semantic-ui-react'

const ReusableModal = ({ children, buttonLabel, handleSubmit }) => {
  const [modalOpen, setModalOpen] = useState(false)

  const handleClick = () => {
    handleSubmit()
    setModalOpen(false)
  }

  ReusableModal.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  }

  ReusableModal.displayName = 'ReusableModal'

  return (
    <Modal
      onClose={() => setModalOpen(false)}
      onOpen={() => setModalOpen(true)}
      open={modalOpen}
      trigger={<Button>{buttonLabel}</Button>}
    >
      {children}
      <Modal.Actions>
        <Button color="black" onClick={() => setModalOpen(false)}>
          Cancel
        </Button>
        <Button content={buttonLabel} labelPosition="right" icon="checkmark" onClick={() => handleClick()} positive />
      </Modal.Actions>
    </Modal>
  )
}

export default ReusableModal
