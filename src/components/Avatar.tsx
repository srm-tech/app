import { classNames } from '@/lib/helper';
import { FC } from 'react';

const Avatar: FC<{
  className?: string;
  text: string;
  size?: 'small' | 'large' | 'medium';
}> = ({ className = '', text, children, size = 'large' }) => {
  return (
    <div
      className={classNames(
        'rounded-full bg-green-500 flex items-center justify-center',
        size === 'large' ? 'w-24 h-24' : '',
        size === 'small' ? 'w-10 h-10' : '',
        size === 'medium' ? 'w-16 h-16' : '',
        className
      )}
    >
      <p
        className={classNames(
          'uppercase text-white',
          size === 'large' ? 'text-5xl' : '',
          size === 'small' ? 'text-lg' : '',
          size === 'medium' ? 'text-2xl' : ''
        )}
      >
        {text}
      </p>
    </div>
  );
};

export default Avatar;
