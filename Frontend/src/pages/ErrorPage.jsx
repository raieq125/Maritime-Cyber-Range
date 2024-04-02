import React from 'react'
import { Link } from 'react-router-dom';
const ErrorPage = () => {
    return (
        <div className='h-max m-auto w-4/5 flex flex-col items-center justify-center py-28'>
            <h1 className='text-slate-800 text-9xl'>404</h1>
            <p className='text-md text-neutral-700'>Requested page not found</p>
            <Link to="/" className='text-slate-900'>Back Home</Link>
        </div>
    )
}

export default ErrorPage
