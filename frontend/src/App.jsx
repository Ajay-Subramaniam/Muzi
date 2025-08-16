import './App.css'
import LandingPage from './pages/LandingPage'
import Space from './pages/Space'
import Home from './pages/Home'
import RoleChange from './pages/RoleChange'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from './components/PrivateRoute'
import SnackbarProvider from './components/SnackbarProvider';
import UserInfoProvider from './components/UserInfoProvider';
import LoaderProvider from './components/LoaderContext'
import NotFoundPage from './pages/NotFound'

function App() {
  return (
    <LoaderProvider>
      <SnackbarProvider>
        <UserInfoProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<PrivateRoute />} >
                <Route path="/" element={<Home />} />
                <Route path="/space/:space" element={<Space />} />
                <Route path="/roleChange" element={<RoleChange />} />
              </Route>
              <Route path="/login" element={<LandingPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </UserInfoProvider>
      </SnackbarProvider>
    </LoaderProvider>
  )
}

export default App
