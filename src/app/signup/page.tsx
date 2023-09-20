"use client";
import Header from "@/components/Header";
import { useState } from "react";
import styles from "../../styles/Login.module.css";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzZGZhZHNmQGdtYWlsLmNvbSIsImlhdCI6MTY5NTIxOTcwOX0.ZeKc327AU-QKA0iM3kZ8VX16JU5_xd09tCfEajs8PYk"

const Login = () => {
    const [userDetails, setUserDetails] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    function inputChangeHandler(e: any) {
        setUserDetails((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
    }

    async function loginHandler(e: any) {
        e.preventDefault();

        if(userDetails.confirmPassword === userDetails.password) {
           const signedInToken = await fetch('http://localhost:3000/v1/auth/signup', {
                method: 'POST',
                body: JSON.stringify({
                    email: userDetails.email,
                    password: userDetails.password
                }),
                headers: {
                    'Content-Type': 'application/json'
                  }
            })

            console.log('user signed in', signedInToken)
        }
        console.log("user detials", userDetails);
    }


    // async function decodeToken(e) {
    //     e.preventDefault();
    //     const decodedValue = await fetch(`http://localhost:3000/v1/auth/decode/?token=${token}`, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })

    //     console.log('decoded value', decodedValue)
    // }
    return (
        <div>
            {/* <Header /> */}
            <main className={styles.mainSection}>
                <div className={styles.loginCard}>
                    <h3 className={styles.loginTitle}>Create your account</h3>
                    <form className={styles.loginForm} onSubmit={loginHandler}>
                        <label htmlFor="email">Email</label>
                        <input type="email" required name="email" id="email" onChange={inputChangeHandler} placeholder="Enter your email" />
                        <label htmlFor="password">Password</label>
                        <input type="password" required name="password" id="password" placeholder="********" onChange={inputChangeHandler} />
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" required name="confirmPassword" id="confirmPassword" placeholder="********" onChange={inputChangeHandler} />
                        <button className="bg-red-500" type="submit">Signup</button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Login;