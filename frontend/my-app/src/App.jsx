import SignIn from './SignIn'
import './App.css'
import Homepage from './homepage.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  // const [currentPage, setCurrentPage] = useState('signin') // 'signin', 'signup', 'teamlist'

  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn /> } />
        <Route path="/main" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

