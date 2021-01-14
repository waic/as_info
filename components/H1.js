function H1(props) {
  return (
    <h1>
      <span style={{'fontSize':'0.9em'}}>
        {props.first}
      </span>
      <br />
      <span style={{'fontSize':'0.7em'}}>
        {props.second}
      </span>
    </h1>
  )
}
export default H1
