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
        <p style={{ textAlign: "left" }}>
          Click on a card to flip it, or flip the middle card with space. Arrow
          keys&mdash;or click once elsewhere&mdash;to turn the carousel. Click
          twice elsewhere to flip all.
        </p>
      </Modal>
    </div>
  );
}
