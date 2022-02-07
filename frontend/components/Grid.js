const Grid = ({ values, handleClick }) => {
  return (
    <>
      <Row row={0} values={values[0]} handleClick={handleClick} />
      <Row row={1} values={values[1]} handleClick={handleClick} />
      <Row row={2} values={values[2]} handleClick={handleClick} />
    </>
  );
};

const Row = ({ row, values, handleClick }) => {
  return (
    <div className="flex flex-row justify-center">
      <Cell row={row} col={0} value={values[0]} handleClick={handleClick} />
      <Cell row={row} col={1} value={values[1]} handleClick={handleClick} />
      <Cell row={row} col={2} value={values[2]} handleClick={handleClick} />
    </div>
  );
};

const Cell = ({ row, col, value, handleClick }) => {
  return (
    <div
      className="bg-green-300 border-green-600 border-2 h-12 w-12 flex items-center justify-center"
      onClick={() => handleClick(row, col)}
    >
      {value}
    </div>
  );
};

export default Grid;
