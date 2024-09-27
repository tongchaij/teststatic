import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home';
import CreatePics from './pages/CreatePics';

const App = () => {
  return (
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/pic/create' element={<CreatePics />} />
      </Routes>
  )
}

export default App