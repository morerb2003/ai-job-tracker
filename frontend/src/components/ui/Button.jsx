const Button = ({ children, className = "", type = "button", ...props }) => {
  return (
    <button
      type={type}
      className={`inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
