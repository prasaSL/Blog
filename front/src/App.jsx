import { useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Home from './pages/home/home.jsx'
import Header from './components/header/header.jsx'
import Footer from './components/footer/footer.jsx'
import Gallery from './pages/galary/gallery.jsx'
import Post from './pages/post/post.jsx'
import UserLogin from './pages/login/userLogin.jsx'
import SignUp from './pages/signUp/signUp.jsx'
import AdminLogin from './pages/adminLogin/adminLogin.jsx'
import AdminPanel from './pages/adminPanel/adminPanel.jsx'
import NotFound from './pages/notFound/notFound.jsx'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Box } from '@mui/material'

import './App.css'

function App() {
  // Create a theme using your CSS variables
  const theme = createTheme({
    palette: {
      primary: {
        main: '#0F172A', // var(--secondary-color)
      },
      secondary: {
        main: '#E11D48', // var(--accent-color)
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: 'var(--secondary-color)',
            fontSize: 'var(--font-size-lg)',
          },
        },
      },
      
      MuiButton: {
        styleOverrides: {
          root: {
            '&:hover': {
              color: 'var(--accent-color)',
            },
          },
        },
      },
    },
  });

  return (
   <ThemeProvider theme={theme}>
     <BrowserRouter>
        <Box className="app-container">
          <Header />
          <Box component="main" className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/post" element={<Post />} />
              <Route path='/user-login' element={<UserLogin />} />
              <Route path='/sign-up' element={<SignUp />} />
              <Route path='/admin-login' element={<AdminLogin />} />
              <Route path='/admin-panel' element={<AdminPanel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
