import SignUp from './pages/SignUp';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Navbar from './pages/Navbar';
import Quiz from './pages/Quiz';
import AdminPanel from './pages/adminpanel';
import ErrorPage from './pages/ErrorPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setInitialFetchDone, signInFailure, signInStart, signInSuccess, toggleLoggedIn } from './store/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
  const dispatch = useDispatch()
  const { LoggedIn } = useSelector((state) => state.user);
  console.log(LoggedIn);
  const fetchCurrentUser = async () => {
    try {
      dispatch(signInStart());
      const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/users/currentuser`, {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        const userData = await response.json();
        dispatch(signInSuccess(userData.data));
        dispatch(toggleLoggedIn());
      } else {
        dispatch(signInFailure());
      }
    } catch (error) {
      // Handle errors here
      dispatch(signInFailure());
    } finally {
      dispatch(setInitialFetchDone());
    }
  };
  useEffect(() => {
    if (LoggedIn === false) {
      fetchCurrentUser();
    }
  }, [LoggedIn, dispatch]);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path='/quiz' element={<Quiz />}></Route>
          </Route>
          <Route path='/signup' element={<SignUp />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/' element={<Home />}></Route>
          <Route element={<ProtectedRoute isAdminRoute={true}/>}>
          <Route path='/admin' element={<AdminPanel />}></Route>
          </Route>
          <Route path='*' element={<ErrorPage />}></Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Slide
      />
    </>
  )
}

export default App
