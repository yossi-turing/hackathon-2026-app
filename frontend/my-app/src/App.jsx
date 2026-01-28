import SignIn from './SignIn'
import './App.css'
import Homepage from './homepage.jsx'
import TeamList from './TeamList'
import Profile from './Profile'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  // const [currentPage, setCurrentPage] = useState('signin') // 'signin', 'signup', 'teamlist'

  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn /> } />
        <Route path="/main" element={<Homepage />} />
        <Route path="/teams" element={<TeamList />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
