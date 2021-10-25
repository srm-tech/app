interface IconProps {
  width?: string | number;
  height?: string | number;
  iconColor?: string;
}

export type IconName =
  | 'howItWorks'
  | 'clock'
  | 'inOutArrow'
  | 'people'
  | 'shine';

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
  clock: () => (
    <svg
      width={width}
      height={height}
      viewBox='0 0 48 48'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24Z'
        fill='currentcolor'
      />
      <path
        d='M24 20V24L27 27M33 24C33 28.9706 28.9706 33 24 33C19.0294 33 15 28.9706 15 24C15 19.0294 19.0294 15 24 15C28.9706 15 33 19.0294 33 24Z'
        stroke='#07504B'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  inOutArrow: () => (
    <svg
      width={width}
      height={height}
      viewBox='0 0 48 48'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24Z'
        fill='currentcolor'
      />
      <path
        d='M20 19L32 19M32 19L28 15M32 19L28 23M28 29L16 29M16 29L20 33M16 29L20 25'
        stroke='#07504B'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  people: () => (
    <svg
      width={width}
      height={height}
      viewBox='0 0 48 48'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24Z'
        fill='currentcolor'
      />
      <path
        d='M24 16.3542C24.7329 15.5238 25.8053 15 27 15C29.2091 15 31 16.7909 31 19C31 21.2091 29.2091 23 27 23C25.8053 23 24.7329 22.4762 24 21.6458M27 33H15V32C15 28.6863 17.6863 26 21 26C24.3137 26 27 28.6863 27 32V33ZM27 33H33V32C33 28.6863 30.3137 26 27 26C25.9071 26 24.8825 26.2922 24 26.8027M25 19C25 21.2091 23.2091 23 21 23C18.7909 23 17 21.2091 17 19C17 16.7909 18.7909 15 21 15C23.2091 15 25 16.7909 25 19Z'
        stroke='#07504B'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  shine: () => (
    <svg
      width={width}
      height={height}
      viewBox='0 0 48 48'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24Z'
        fill='currentcolor'
      />
      <path
        d='M17 15V19M15 17H19M18 29V33M16 31H20M25 15L27.2857 21.8571L33 24L27.2857 26.1429L25 33L22.7143 26.1429L17 24L22.7143 21.8571L25 15Z'
        stroke='#07504B'
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
