import clsx from 'clsx';
import Link from 'next/link';
import * as React from 'react';

export default function Logo({
  basePath = '/',
  small = false,
}: {
  basePath?: string;
  small?: boolean;
}) {
  return (
    <div>
      <Link href={basePath} passHref>
        <a className={clsx('text-white', small ? 'text-3xl' : 'text-4xl')}>
          <span className='sr-only'>introduce Guru</span>
          introduce<span className='text-light-green'>.</span>guru
        </a>
      </Link>
    </div>
  );
}
