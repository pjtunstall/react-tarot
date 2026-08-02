import { Modal } from "./Modal.jsx";

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
          Click/tap a card to flip it, or flip the middle card with space. Arrow
          keys, swipe, or click once elsewhere to turn the carousel. Click/tap
          twice elsewhere to flip all.
        </p>
      </Modal>
    </div>
  );
}
