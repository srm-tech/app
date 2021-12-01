type LoaderProps = {
  loading: boolean;
};

export default function Loader(props: LoaderProps) {
  return (
    <div className='-loading -active'>
      {props.loading ? <div className='-loading-inner'>Loading</div> : <div />}
    </div>
  );
}
