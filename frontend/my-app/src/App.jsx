import { useState } from 'react'
import SignIn from './SignIn'
import SignUp from './SignUp'
import TeamList from './TeamList'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('signin') // 'signin', 'signup', 'teamlist'

  return (
   <SignIn />
  )
}

export default App

