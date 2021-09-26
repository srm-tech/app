import clsx from 'clsx';
import { FC } from 'react';

const Avatar: FC<{
  className?: string;
  text: string;
  size?: 'small' | 'large';
}> = ({ className = '', text, children, size = 'large' }) => {
  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center ',
        size === 'large' ? 'w-24 h-24' : 'w-10 h-10',
        className
      )}
    >
      <p
        className={clsx(
          'text-black',
          size === 'large' ? 'text-5xl' : 'text-lg'
        )}
      >
        {text}
      </p>
    </div>
  );
};

export default Avatar;
