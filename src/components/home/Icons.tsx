interface IconProps {
  width?: string | number;
  height?: string | number;
  iconColor?: string;
}

export type IconName =
  | 'howItWorks'
  | 'earth'
  | 'weightScale'
  | 'lightning'
  | 'message';

const icons = ({ height = 48, width = 48 }: IconProps) => ({
  howItWorks: () => (
    <svg
      width={width}
      height={height}
      viewBox='0 0 48 48'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect width='48' height='48' rx='6' fill='#343434' />
      <path
        d='M25 22V15L16 26H23L23 33L32 22L25 22Z'
        stroke='white'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  earth: () => (
    <svg
      width={width}
      height={height}
      viewBox='0 0 48 48'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect width='48' height='48' rx='6' fill='#343434' />
      <path
        d='M33 24C33 28.9706 28.9706 33 24 33M33 24C33 19.0294 28.9706 15 24 15M33 24H15M24 33C19.0294 33 15 28.9706 15 24M24 33C25.6569 33 27 28.9706 27 24C27 19.0294 25.6569 15 24 15M24 33C22.3431 33 21 28.9706 21 24C21 19.0294 22.3431 15 24 15M15 24C15 19.0294 19.0294 15 24 15'
        stroke='white'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  weightScale: () => (
    <svg
      width={width}
      height={height}
      viewBox='0 0 48 48'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect width='48' height='48' rx='6' fill='#343434' />
      <path
        d='M15 18L18 19M18 19L15 28C16.7725 29.3334 19.2287 29.3334 21.0012 28M18 19L21.0001 28M18 19L24 17M30 19L33 18M30 19L27 28C28.7725 29.3334 31.2287 29.3334 33.0012 28M30 19L33.0001 28M30 19L24 17M24 15V17M24 33V17M24 33H21M24 33H27'
        stroke='white'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  lightning: () => (
    <svg
      width={width}
      height={height}
      viewBox='0 0 48 48'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect width='48' height='48' rx='6' fill='#343434' />
      <path
        d='M25 22V15L16 26H23L23 33L32 22L25 22Z'
        stroke='white'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  message: () => (
    <svg
      width={width}
      height={height}
      viewBox='0 0 48 48'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect width='48' height='48' rx='6' fill='#343434' />
      <path
        d='M19 20H29M19 24H23M24 32L20 28H17C15.8954 28 15 27.1046 15 26V18C15 16.8954 15.8954 16 17 16H31C32.1046 16 33 16.8954 33 18V26C33 27.1046 32.1046 28 31 28H28L24 32Z'
        stroke='white'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
});

export const Icon = ({
  iconColor,
  name,
  height,
  width,
}: IconProps & { name: IconName }) => {
  const IconComponent = icons({ iconColor, height, width })[name];
  return <IconComponent />;
};
