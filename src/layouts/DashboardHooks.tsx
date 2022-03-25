/* This example requires Tailwind CSS v2.0+ */
import { NextRouter, useRouter } from 'next/router';
import { ReactElement,useEffect, useState } from 'react';

import Link from '@/components/links/UnstyledLink';

const transitionDuration = 300;
type UseAdmin = {
  open: boolean;
  setOpen: (open) => void;
  isLoading: boolean;
  setIsLoading: (isLoading) => void;
  onClose: () => void;
  router: NextRouter;
};

export const useAdmin = ({ to = '/' }): UseAdmin => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const onClose = () => {
    setOpen(false);

    // let transition finish
    setTimeout(() => {
      router.push(to);
    }, transitionDuration);
  };
  useEffect(() => {
    setOpen(true);
  }, []);
  return {
    open,
    setOpen,
    onClose,
    isLoading,
    setIsLoading,
    router,
  };
};

export { Link };
