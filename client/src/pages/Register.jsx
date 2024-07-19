import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdError } from "react-icons/md";
import { BeatLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";
import { useAuthContext } from "../hooks/useAuthContext";
import InputBox from "../components/InputBox";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [confPwd, setConfPwd] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState({});
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    function nameHandler(e) {
        setName(e.target.value);
    }

    function emailHandler(e) {
        setEmail(e.target.value);
    }

    function pwdHandler(e) {
        setPwd(e.target.value);
    }

    function confPwdHandler(e) {
        setConfPwd(e.target.value);
    }

    async function submitHandler(e) {
        e.preventDefault();
        setIsSubmitting(true);
        setError({});
        try {
            const response = await fetch("http://localhost:4000/api/user/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name, email, pwd, confPwd})
            });
            if (response.ok) {
                const data = await response.json();
                if (data.error) {
                    setError(data);
                } else if (data.token) {
                    localStorage.setItem("token", JSON.stringify(data.token));
                    dispatch({type: "login", payload: data.token});
                    navigate("/");
                } else {
                    throw new Error("");
                }
            } else {
                throw new Error("");
            }
        } catch (err) {
            registerFailedNotify();
        }
        setIsSubmitting(false);
    }

    function registerFailedNotify() {
        toast.error("Register failed. Please try again");
    }

    return (
        <div className="register">
            <Toaster />
            <form onSubmit={submitHandler} method="post" className="registerForm" autoComplete="off">
                <h1>Register</h1>
                <section className="inputSection">
                    <section className="inputContainer">
                        <InputBox data={name} handler={nameHandler} label="Full Name" type="text" id="name" name="name" maxlength={"30"} disabled={isSubmitting} />
                        {error.error && error.error.name && <div className="error"><MdError /> {error.error.name}</div>}
                    </section>
                    <section className="inputContainer">
                        <InputBox data={email} handler={emailHandler} label="Email" type="email" id="email" name="email" disabled={isSubmitting} />
                        {error.error && error.error.email && <div className="error"><MdError /> {error.error.email}</div>}
                    </section>
                    <section className="inputContainer">
                        <InputBox data={pwd} handler={pwdHandler} label="Password" type="password" id="pwd" name="pwd" minlength={"6"} disabled={isSubmitting} />
                        {error.error && error.error.pwd && <div className="error"><MdError /> {error.error.pwd}</div>}
                    </section>
                    <section className="inputContainer">
                        <InputBox data={confPwd} handler={confPwdHandler} label="Confirm Password" type="password" id="confPwd" name="confPwd" minlength={"6"} disabled={isSubmitting} />
                        {error.error && error.error.confPwd && <div className="error"><MdError /> {error.error.confPwd}</div>}
                    </section>
                </section>
                <section className="inputContainer">
                    <button className="registerBtn" disabled={isSubmitting}>{isSubmitting ? <BeatLoader size={7} color={"#ffffff"} /> : "Register"}</button>
                </section>
                <section className="formFooter">
                    <span>Already have an account? <Link to="/login" className="link">Login</Link></span>
                </section>
            </form>
        </div>
    );
}

export default Register;