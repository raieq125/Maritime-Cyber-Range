import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { BiLogIn } from "react-icons/bi";
import { SiGnuprivacyguard } from "react-icons/si";
import { useSelector, useDispatch } from 'react-redux';
import { signOutUserFailure, signOutUserStart, signOutUserSuccess, toggleAdmin, toggleLoggedIn } from '../store/userSlice';
import { useToast } from '../hooks/Toast'
const Navbar = () => {
    const { LoggedIn, currentUser, IsAdmin } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const showToast = useToast();
    const handleClick = async () => {
        dispatch(signOutUserStart())
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/users/logout`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                dispatch(signOutUserFailure());
                showToast('Problem Signing Out', 'error');
            } else {
                dispatch(signOutUserSuccess());
                dispatch(toggleLoggedIn());
                if (IsAdmin) {
                    dispatch(toggleAdmin())
                }
                navigate('/login')
                showToast('Logged Out Successfully', 'success');
            }
        } catch (error) {
            dispatch(signOutUserFailure());
            showToast('Problem Signing Out', 'error');
        }
    }
    const navigateAdmin = () => {
        if (currentUser.role === 'admin') {
            navigate('/admin')
        }
        return null
    }
    return (
        <>
            <div style={{
                "background": "rgba(255, 255, 255, 0.2)",

                "border- radius": " 16px",
                "box- shadow": " 0 4px 30px rgba(0, 0, 0, 0.1)",
                "backdrop-filter": "blur(5px)",
                "-webkit-backdrop-filter": "blur(5px)",
            }} className="container sticky top-0 left-0 right-0 flex flex-wrap items-center justify-between w-full px-8 m-auto bg-white group py-7 shrink-0 h-20 ">
                <div className='navyclr'>
                    Maritime Cyber <span >Range</span>
                </div>
                <div className="items-center justify-between gap-12 text-black flex">
                    <Link
                        className="text-sm font-normal text-dark-grey-700 hover:text-dark-grey-900"
                        to="/"
                    >
                        Home
                    </Link>
                    {LoggedIn && <Link
                        className="text-sm font-normal text-dark-grey-700 hover:text-dark-grey-900"
                        to="/quiz"
                    >
                        Quiz
                    </Link>}
                </div>
                <div className="items-center gap-8 flex">
                    {!LoggedIn && <Link to="/login" className="flex items-center text-sm font-normal text-gray-800 hover:text-gray-900 transition duration-300">
                        Log In <BiLogIn className='text-lg' />
                    </Link>}
                    {!LoggedIn && <Link to="/signup" className="flex items-center px-4 py-2 text-sm font-bold rounded-xl  transition duration-300 topsign">
                        SignUp  <SiGnuprivacyguard />
                    </Link>}
                    {LoggedIn && currentUser.role === 'admin' && <button onClick={navigateAdmin} className="flex items-center px-4 py-2 text-sm font-bold rounded-xl  transition duration-300 topsign cursor-pointer">
                        Admin
                    </button>}
                    {LoggedIn && <button onClick={handleClick} className="flex items-center px-4 py-2 text-sm font-bold rounded-xl  transition duration-300 topsign cursor-pointer">
                        Logout  <SiGnuprivacyguard />
                    </button>}
                </div>
            </div ></>
    )
}

export default Navbar
