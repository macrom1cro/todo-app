interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}
// interface State {}

export default function Button({ children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
