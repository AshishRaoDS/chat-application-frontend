"use client";
import Header from "@/components/Header";
import { useState } from "react";
import styles from "../../styles/Login.module.css";

const Login = () => {
    const [userDetails, setUserDetails] = useState({
        email: '',
        password: ''
    });

    function inputChangeHandler(e: any) {
        setUserDetails((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
    }
    function loginHandler(e: any) {
        e.preventDefault();
        console.log("user detials", userDetails);
    }
    return (
        <div>
            {/* <Header /> */}
            <main className={styles.mainSection}>
                <div className={styles.loginCard}>
                    <h3 className={styles.loginTitle}>Login to your account and chat away!</h3>
                    <form className={styles.loginForm} onSubmit={loginHandler}>
                        <label htmlFor="email">Email</label>
                        <input type="email" required name="email" id="email" onChange={inputChangeHandler} placeholder="Enter your email" />
                        <label htmlFor="password">Password</label>
                        <input type="password" required name="password" id="password" placeholder="********" onChange={inputChangeHandler} />
                        <button id="login" type="submit">Login</button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Login;