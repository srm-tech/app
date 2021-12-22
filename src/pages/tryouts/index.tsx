import Modal from '@/components/modals/modal';

const modal = (
  <>
    <Modal
      openOnStart={true}
      caption='Do ya feel lucky?'
      acceptButtonCaption="I'm feeling lucky"
      cancelButtonCaption='Thanks for now, officer'
    >
      Well, do ya, punk?!
    </Modal>
  </>
);

export default function tryout() {
  return (
    <>
      {modal}
      <button onClick={() => openModal()}>Open modal</button>
    </>
  );
}
