import React from 'react'
import heroimg from "../photos_questions/hero-image.webp"
import { Link } from 'react-router-dom';
import '../CSS/Home.css'
const Home = () => {
  return (


    <>
      <>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/Loopple/loopple-public-assets@main/motion-tailwind/motion-tailwind.css"
        />
        <>
          <div className="container flex flex-col mx-auto bg-white w-screen pt-5">
            <div className="grid w-full grid-cols-1 my-auto mt-7 mb-8 md:grid-cols-2 xl:gap-14 md:gap-5">
              <div className="flex flex-col justify-center col-span-1 text-center lg:text-start">
                <div className="flex items-center justify-center mb-4 lg:justify-normal">
                  <img
                    className="h-5"
                    src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-1.png"
                    alt="logo"
                  />
                  <h4 className="ml-2 text-sm font-bold tracking-widest text-primary uppercase">
                    Explore the world of Nautical Navigators
                  </h4>
                </div>
                <h1 className="mb-8 text-4xl font-extrabold leading-tight lg:text-6xl text-dark-grey-900">
                  Welcome to Maritime Cyber Range
                </h1>
                <p className="mb-6 text-base font-normal leading-4  lg:w-3/4 text-grey-900 text-left texttoleft">
                  Welcome aboard to <b>'Nautical Navigators'</b>, where the sea meets the mind in an adventurous journey of knowledge! Set sail on a quest to test your wits and wisdom about all things maritime. From the legendary voyages of historical explorers to the intricate workings of modern naval technology,our quiz app plunges you into the depths of naval history, culture, and innovation.Whether you're a seasoned seafarer or a landlubber curious to explore the vast blue horizon,prepare to embark on a thrilling voyage of discovery. Hoist the sails, weigh anchor,and let the quizzing adventure begin!
                </p>
                <div className="flex flex-col items-center gap-4 lg:flex-row mb-6 md:mb-0">
                  <Link to="/login" className="getstart min-w-48 py-4 text-sm font-bold text-white px-7 focus:ring-4 focus:ring-purple-blue-100 transition duration-300 rounded-xl decoration-white">
                    Get started now
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <img
                  className="w-11/12 m-auto rounded-md"
                  src={heroimg}
                  alt="header image"
                />
              </div>
            </div>
          </div>

        </>
      </>

    </>


  )
}

export default Home
