const Button = ({ children, ...props }) => (
  <button className="m-3 bg-yellow-400 rounded px-2 py-1" {...props}>
    {children}
  </button>
);

export default Button;
