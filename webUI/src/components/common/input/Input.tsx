import "./input.scss";
import {ChangeEvent} from "react";

export interface InputProps {
    placeholder?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    name?: string;
    value?: any;
    id?: string;
    isRequired?: boolean
}

const Input = ({placeholder, onChange, type, name, value, id, isRequired}: InputProps) => {
    return (
        <div className="main_input_container">
            <input
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                required={isRequired}
            />
        </div>
    );
};

export default Input;
