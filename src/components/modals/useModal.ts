import { ReactElement, useState } from 'react';

export interface Modal {
  caption?: string;
  content?: string | ReactElement;
  acceptCaption?: string;
  cancelCaption?: string;
  onAccept?: any;
  onCancel?: any;
  isLoading?: boolean;
  show?: boolean;
  size?: 'sm' | 'lg' | 'md';
}

const useModal = (): [Modal, (options: Modal) => void] => {
  const [modal, setModal] = useState<Modal>({
    caption: 'Are you sure?',
    content: '',
    acceptCaption: 'Ok',
    cancelCaption: 'Cancel',
    onAccept: null,
    onCancel: null,
    show: false,
    isLoading: false,
    size: 'lg',
  });

  function setState(options: Partial<Modal>) {
    setModal({ ...modal, ...options });
  }

  return [modal, setState];
};

export default useModal;
