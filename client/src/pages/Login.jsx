import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdError } from "react-icons/md";
import { BeatLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";
import { useAuthContext } from "../hooks/useAuthContext";
import InputBox from "../components/InputBox";

function Login() {
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState({});
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    function emailHandler(e) {
        setEmail(e.target.value);
    }

    function pwdHandler(e) {
        setPwd(e.target.value);
    }

    function rememberMeHandler(e) {
        setRememberMe(e.target.checked);
    }

    async function submitHandler(e) {
        e.preventDefault();
        setIsSubmitting(true);
        setError({});
        try {
            const response = await fetch("http://localhost:4000/api/user/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, pwd, rememberMe})
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
            loginFailedNotify();
        }
        setIsSubmitting(false);
    }

    function loginFailedNotify() {
        toast.error("Login failed. Please try again");
    }

    return (
        <div className="login">
            <Toaster />
            <form onSubmit={submitHandler} method="post" className="loginForm" autoComplete="off">
                <h1>Login</h1>
                <section className="inputSection">
                    <section className="inputContainer">
                        <InputBox data={email} handler={emailHandler} label="Email" type="email" id="email" name="email" disabled={isSubmitting} />
                        {error.error && error.error.email && <div className="error"><MdError /> {error.error.email}</div>}
                    </section>
                    <section className="inputContainer">
                        <InputBox data={pwd} handler={pwdHandler} label="Password" type="password" id="pwd" name="pwd" disabled={isSubmitting} />
                        {error.error && error.error.pwd && <div className="error"><MdError /> {error.error.pwd}</div>}
                        {error.failed && <div className="error"><MdError /> {error.failed}</div>}
                    </section>
                </section>
                <section className="inputContainer">
                    <div className="rememberMe">
                        <input
                            onChange={rememberMeHandler}
                            checked={rememberMe}
                            type="checkbox"
                            id="rememberMe"
                            name="rememberMe"
                            className="checkbox"
                            aria-hidden="true"
                            disabled={isSubmitting}
                        />
                        <label htmlFor="rememberMe" className="inputLabelRememberMe">Remember me</label>
                    </div>
                </section>
                <section className="inputContainer">
                    <button className="loginBtn" disabled={isSubmitting}>{isSubmitting ? <BeatLoader size={7} color={"#ffffff"} /> : "Login"}</button>
                </section>
                <section className="formFooter">
                    <span>Don't have an account? <Link to="/register" className="link">Register</Link></span>
                </section>
            </form>
        </div>
    );
}

export default Login;