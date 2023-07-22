type H1Props = {
  first: string;
  second: string;
};

function H1({ first, second }: H1Props) {
  return (
    <h1>
      <span style={{ 'fontSize': '0.9em' }}>
        {first}
      </span>
      <br />
      <span style={{ 'fontSize': '0.7em' }}>
        {second}
      </span>
    </h1>
  )
}
export default H1
