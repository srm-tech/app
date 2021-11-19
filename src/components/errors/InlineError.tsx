type Props = {
  children?: React.ReactNode;
  message?: string;
};

export default function InlineError({ children = '', message = '' }: Props) {
  return message ? (
    <span className='text-red-500 text-sm'>{message}</span>
  ) : null;
}
