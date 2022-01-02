import { useState } from 'react';

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);
  const [caption, setCaption] = useState('');
  const [content, setContent] = useState('');
  const [acceptCaption, setAcceptCaption] = useState('');
  const [cancelCaption, setCancelCaption] = useState('');
  const [accept, setAccept] = useState();
  const [cancel, setCancel] = useState();

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
  };
};

export default useModal;
