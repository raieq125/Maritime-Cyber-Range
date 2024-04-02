import React, { useState } from 'react';
import "../CSS/SignUp.css";
import { Link } from 'react-router-dom';
import { useToast} from '../hooks/Toast'
import { useSelector } from 'react-redux';
const SignUp = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const showToast = useToast();
  const {currentUser} = useSelector((state) => state.user);
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!username || !email || !password || !confirmpassword) {
        setLoading(false);
        showToast('All fields are required', 'error');
        return;
      }
      const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmpassword
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setLoading(false);
        showToast(data.error.message, 'error');
        return;
      }
      showToast('User has been registered successfully', 'success');
      setLoading(false);
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      showToast(error.message, 'error');
      setLoading(false);
    }
  }
  return (
    <>
      <div className="formbody">
        <div className="form-container">
          {currentUser?.role === 'admin' ? (<p className="title">Add A User</p>): (<p className="title">Signup</p>)}
          <form className="form">
            <div className="input-group">
              <label htmlFor="Username">Username</label>
              <input type="text" name="username" id="username" placeholder="Enter Your Username" value={username} onChange={(e) => {
                setUsername(e.target.value);
              }} />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" placeholder="Enter Your Email" value={email} onChange={(e) => {
                setEmail(e.target.value);
              }} />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" id="password" placeholder="Enter Your Password" value={password} onChange={(e) => {
                setPassword(e.target.value);
              }} />

            </div>
            <div className="input-group">
              <label htmlFor="confirmpassword">Confirm Password</label>
              <input type="password" name="confirmpassword" id="confirmpassword" placeholder="Enter Your Password Again" value={confirmpassword} onChange={(e) => {
                setConfirmPassword(e.target.value);
              }} />

            </div>
            <button className="sign" onClick={handleSignup} disabled={loading}>{loading ? 'Loading...' : 'Sign Up'}</button>
          </form>

          <p className="signup">
            Already have an account?
            <Link rel="noopener noreferrer" to="/login" className="">
              Sign in
            </Link>
          </p>
        </div>
      </div>

    </>
  )
}

export default SignUp
