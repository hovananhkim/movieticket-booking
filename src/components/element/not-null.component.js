export function NotNull(props) {
  const { field } = props;
  return <div className="p-0 not-null">{field} không được trống</div>;
}
