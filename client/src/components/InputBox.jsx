import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

function InputBox({ data, handler, label, type, id, name, maxlength, minlength, disabled }) {
    const [show, setShow] = useState(false);
    const [inputType, setInputType] = useState(type);
    const [focus, setFocus] = useState(false);
    const [position, setPosition] = useState(false);

    function showPwd() {
        setShow(true);
        setInputType("text");
    }

    function hidePwd() {
        setShow(false);
        setInputType("password");
    }

    function focusHandler() {
        setFocus(true);
        setPosition(true);
    }

    function blurHandler(e) {
        setFocus(false)
        !e.target.value && setPosition(false);
    }

    let labelClass = "inputLabel";
    if (focus) {
        labelClass += " on";
    }
    if (position) {
        labelClass += " top";
    }

    return (
        <div className="inputBox">
            <input
                onChange={handler}
                onFocus={focusHandler}
                onBlur={blurHandler}
                value={data}
                type={inputType}
                id={id}
                name={name}
                maxLength={maxlength}
                minLength={minlength}
                spellCheck="false"
                className={type === "password" ? "inputField pwd" : "inputField"}
                required={true}
                disabled={disabled}
            />
            <label htmlFor={id} className={labelClass}>{label}</label>
            {
                type === "password" &&
                <div>
                    {show ? <FaEye onClick={hidePwd} className="hidePwd" /> : <FaEyeSlash onClick={showPwd} className="showPwd" />}
                </div>
            }
        </div>
    );
}

export default InputBox;