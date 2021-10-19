import "./button.scss";

interface ButtonProps {
  children: any;
  onClick: () => void;
}

export const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <div className="button" onClick={onClick}>
      <button>{children}</button>
    </div>
  );
};
