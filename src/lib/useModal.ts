import { useState } from 'react';

const initialContent: any = '';
const initialAcceptCaption: any = 'OK';
const initialCancelCaption: any = 'Cancel';
const initialAccept: any = null;
const initialCancel: any = null;

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);
  const [caption, setCaption] = useState('');
  const [content, setContent] = useState(initialContent);
  const [acceptCaption, setAcceptCaption] = useState(initialAcceptCaption);
  const [cancelCaption, setCancelCaption] = useState(initialCancelCaption);
  const [accept, setAccept] = useState(initialAccept);
  const [cancel, setCancel] = useState(initialCancel);
  const [hide, useHide] = useState(!isShowing);

  function toggle() {
    setIsShowing(!isShowing);
  }

  return {
    isShowing,
    toggle,
    caption,
    setCaption,
    content,
    setContent,
    acceptCaption,
    setAcceptCaption,
    cancelCaption,
    setCancelCaption,
    accept,
    setAccept,
    cancel,
    setCancel,
    hide,
  };
};

export default useModal;
