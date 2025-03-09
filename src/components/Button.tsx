"use client";

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button = ({ label, onClick }: ButtonProps) => {
  return (
    <button className="w-full p-2 bg-blue-500 text-white rounded-md" onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
