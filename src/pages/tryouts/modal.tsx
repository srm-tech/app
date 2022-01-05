import React from 'react';

import useModal from '@/lib/useModal';

import Modal from '@/components/modals/ConfirmModal';

export default function App() {
  const { isShowing, toggle, accept, setAccept, cancel, setCancel } =
    useModal();

  function yes() {
    toggle();
    console.log('yes');
  }

  function no() {
    toggle();
    console.log('no');
  }

  return (
    <div className='App'>
      <button className='button-default' onClick={toggle}>
        Show Modal
      </button>
      <Modal
        isShowing={isShowing}
        hide={toggle}
        cancel={no}
        cancelCaption='No'
        accept={yes}
        acceptCaption='Yes'
        caption='Click yes or no'
        content="Isn't it awesome?"
      />
    </div>
  );
}
