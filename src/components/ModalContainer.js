import { Modal } from "./Modal.js";

export function ModalContainer({ isModalOpen, setIsModalOpen, setIsBlurred }) {
  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onClose={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsModalOpen(false);
          setIsBlurred(false);
        }}
      >
        <p>
          Click on cards to flip them. Click once elsewhere to rotate the
          carousel, twice elsewhere to flip all. You can also rotate with arrow
          keys and use space to flip the middle one.
        </p>
      </Modal>
    </div>
  );
}
