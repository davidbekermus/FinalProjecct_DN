import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import SignUp from './Pages/SignUP'
import SignIn from './Pages/SignIn'
import UiPassenger from './Pages/UiPassenger'

function App() {
 
  return (
    <>
    <BrowserRouter>
      <Routes>
          <Route path = '/' element = {<Home/>}/>
          <Route path = '/signIn' element = {<SignIn/>}/>
          <Route path = '/signUp' element = {<SignUp/>}/>
          <Route path = '/UiPassenger' element = {<UiPassenger/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
