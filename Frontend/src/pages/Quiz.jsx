import React, { useRef, useState, useEffect } from 'react';
import '../CSS/Quiz.css';
import { data } from '../data';
import image1 from '../photos_questions/hero-image.webp';
import image2 from '../photos_questions/44.jpg';
import image3 from '../photos_questions/1.jpg';
import image4 from '../photos_questions/images.jpeg';
import image5 from '../photos_questions/project.jpg';
import image6 from '../photos_questions/3.webp';
import Pass from '../components/Pass';
import Fail from '../components/Fail';

const Quiz = () => {
  const [indexedDB, setIndexedDB] = useState(0);
  const [question, setQuestion] = useState({});
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [selected, setSelected] = useState(false);
  const [containerImageIndex, setContainerImageIndex] = useState(0);

  const option1 = useRef(null);
  const option2 = useRef(null);
  const option3 = useRef(null);
  const option4 = useRef(null);

  const optionArray = [option1, option2, option3, option4];
  const imageList = [image1, image2, image3, image4, image5, image6];

  useEffect(() => {
    shuffleQuestions();
    setQuestion(data[indexedDB]);
  }, []);

  useEffect(() => {
    setQuestion(data[indexedDB]);
  }, [indexedDB]);

  useEffect(() => {
    if (result) {
      // Replace with your actual API endpoint
      fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/users/update-score`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ score }),
      })
        .then(response => response.json())
        .then(data => {
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [result, score]);

  const shuffleQuestions = () => {
    for (let i = data.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [data[i], data[j]] = [data[j], data[i]];
    }
  };

  const checkAns = (e, ans) => {
    if (!lock) {
      if (question.ans === ans) {
        e.target.classList.add('correct');
        setLock(true);
        setScore((prev) => prev + 10);
      } else {
        e.target.classList.add('wrong');
        setLock(true);
        optionArray[question.ans - 1].current.classList.add('correct');
      }
      e.target.classList.add('selected');
      setSelected(true);
    }
  };

  const next = () => {
    if (lock) {
      if (indexedDB === data.length - 1) {
        setResult(true);
        return;
      }
      setIndexedDB((prevIndexedDB) => prevIndexedDB + 1);
      setLock(false);
      setSelected(false);
      optionArray.forEach((option) => {
        option.current.classList.remove('wrong');
        option.current.classList.remove('correct');
      });
      setContainerImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
    }
  };

  const reset = () => {
    setIndexedDB(0);
    setScore(0);
    setResult(false);
    setSelected(false);
    setLock(false);
    shuffleQuestions();
    setContainerImageIndex(0);
  };

  return (
    <div className='quizblock'>
      <div className="container1" style={{ position: 'relative' }}>
        <div style={{ backgroundImage: `url(${imageList[containerImageIndex]})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: '0.4', pointerEvents: 'none' }}></div>
        <div>
          <h1>Quiz</h1>
          <hr />
          {result ? (
            <>
              <h2>
                You scored {score} out of {data.length * 10}
              </h2>

              <div onClick={reset} className="btn">
                Reset
              </div>
              {score > 40 && <Pass />}
              {score <= 40 && <Fail />}
            </>
          ) : (
            <>
              <div className="font">
                <li className='list-none '>
                  <br /><h2>
                    {indexedDB + 1}.{question.question}
                  </h2>
                </li>
                <br />
                <br />
                <ul className='li'>
                  <li ref={option1} onClick={(e) => checkAns(e, 1)}>
                    {question.option1}
                  </li>
                  <li ref={option2} onClick={(e) => checkAns(e, 2)}>
                    {question.option2}
                  </li>
                  <li ref={option3} onClick={(e) => checkAns(e, 3)}>
                    {question.option3}
                  </li>
                  <li ref={option4} onClick={(e) => checkAns(e, 4)}>
                    {question.option4}
                  </li>
                </ul>
              </div>
              <div onClick={selected ? next : null} className={selected ? "btn" : "btn disabled"}>
                Next
              </div>
              <div className="index">
                {indexedDB + 1} of {data.length} question
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
