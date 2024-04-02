import React, { useState } from 'react';
import "../CSS/login.css";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInStart, signInSuccess, toggleAdmin, toggleLoggedIn } from '../store/userSlice';
import { useToast} from '../hooks/Toast'
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { loading } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const showToast = useToast();

    const handleSignup = async (e) => {
        e.preventDefault();
        dispatch(signInStart());
        try {
            if (!email || !password) {
                dispatch(signInFailure());
                showToast('All fields are required', 'error');
                return;
            }
            const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                dispatch(signInFailure());
                showToast(data.error.message, 'error');
                return;
            }
            setEmail('');
            setPassword('');
            showToast('Logged In Successfully. Welcome Back!', 'success');
            dispatch(signInSuccess(data.data.user));
            dispatch(toggleLoggedIn());
            if (data.data.user.role === 'admin') {
                dispatch(toggleAdmin());
                navigate('/admin');
            }else{
            navigate('/');
            }
        } catch (error) {
            showToast(error.message, 'error');
            dispatch(signInFailure());
        }

    }
    return (
        <>

            <div className="formbody">
                <div className="form-container">
                    <p className="title">Login</p>
                    <form className="form">
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email" placeholder="Enter Your Email" value={email} onChange={(e) => {
                                setEmail(e.target.value);
                            }} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="password" placeholder="Enter Your Password" value={password} onChange={(e) => {
                                setPassword(e.target.value);
                            }} required />

                        </div>
                        <button className="sign" onClick={handleSignup} disabled={loading}>{loading ? 'Loading...' : 'Sign Up'}</button>
                    </form>

                    <p className="signup">
                        Don't have an account?
                        <Link rel="noopener noreferrer" to="/signup" className="actionbtn">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>

        </>
    )
}

export default Login
