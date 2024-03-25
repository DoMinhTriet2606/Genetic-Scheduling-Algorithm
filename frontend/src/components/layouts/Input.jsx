import React from "react";

import "../../assets/css/layouts/input.css";

const Input = ({ field, name, type, value, onChange }) => {
    return (
        <div className="input__container">
            <input
                type={type}
                name={name}
                autoComplete="off"
                value={value}
                onChange={onChange}
                required
            />
            <label className="label-name">
                <span className="content-name">{field}</span>
            </label>
        </div>
    );
};

export default Input;
