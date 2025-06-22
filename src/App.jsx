import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import SignInDriver from './Pages/SignInDriver'
import SignInTraveler from './Pages/SignInTraveler'
import ChooseSignInType from './Pages/ChooseSignInType'
import UiPassenger from './Pages/UiPassenger'
import SignUpDriver from './Pages/SignUPDriver'
import SignUpTraveler from './Pages/SignUpTraveler'

function App() {
 
  return (
    <>
    <BrowserRouter>
      <Routes>
          <Route path = '/' element = {<Home/>}/>
          <Route path = '/SignInDriver' element = {<SignInDriver/>}/>
          <Route path = '/SignInTraveler' element = {<SignInTraveler/>}/>
          <Route path = '/SignUpDriver' element = {<SignUpDriver/>}/>
          <Route path = '/SignUpTraveler' element = {<SignUpTraveler/>}/>
          <Route path = '/ChooseSignInType' element = {<ChooseSignInType/>}/>
          <Route path = '/UiPassenger' element = {<UiPassenger/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
