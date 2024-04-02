import React from 'react'
import fail from '../photos_questions/wrong.gif'
function Fail() {
  return (
    <div>
      <img src={fail} alt='Failed' style={{ height: '200px', margin: 'auto' }}/>
    </div>
  )
}

export default Fail
