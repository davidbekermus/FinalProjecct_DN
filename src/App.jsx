import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import SignUp from './Pages/SignUP'
import SignIn from './Pages/SignIn'

function App() {
 
  return (
    <>
    <BrowserRouter>
      <Routes>
          <Route path = '/' element = {<Home/>}/>
          <Route path = '/signIn' element = {<SignIn/>}/>
          <Route path = '/signUp' element = {<SignUp/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
