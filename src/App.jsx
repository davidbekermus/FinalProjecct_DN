import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import SignInDriver from './Pages/SignInDriver'
import SignInTraveler from './Pages/SignInTraveler'
import ChooseSignInType from './Pages/ChooseSignInType'
import UiPassenger from './Pages/UiPassenger'
import SignUpDriver from './Pages/SignUPDriver'
import SignUpTraveler from './Pages/SignUpTraveler'
import UiDriver from './Pages/UiDriver'
import BusInfo from './Pages/BusInfo'
import BusStopInfo from './Pages/BusStopInfo'
import UiDriver_FinalInfo from './Pages/Uidriver_FinalInfo'

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
          <Route path = '/UiDriver' element = {<UiDriver/>}/>
          <Route path = '/UiDriver_FinalInfo' element = {<UiDriver_FinalInfo/>}/>
          <Route path = '/BusInfo' element = {<BusInfo/>} />
          <Route path = '/BusStopInfo' element = {<BusStopInfo/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
