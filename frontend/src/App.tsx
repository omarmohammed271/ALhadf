import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { ThemeProvider } from "@/components/theme-provider"
import NavBar from './components/layout/NavBar'
import Dashboard from './pages/DashboardManagement/Dashboard'
import { OverlayProvider } from './context/AIOverlayContext'
import { useTranslation } from 'react-i18next'
import DataForm from './pages/DashboardManagement/DataForm'
import Home from './pages/Home'
import Login from './pages/Auth/Login'
import { useEffect } from 'react'
import UserManagement from './pages/UserManagement/UserManagement'
import { Toaster } from 'react-hot-toast'
import { useUserStore } from './store/authStore'
import ProtectedRoute from './ProtectedRoute'

function App() {
  const { i18n } = useTranslation();

  const userData = useUserStore(state => state.userData)

  console.log(userData);
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <OverlayProvider>
        <Router>
          <main dir={i18n.dir(i18n.language)} className='bg-background select-none text-foreground max-h-screen h-screen min-h-screen xl:overflow-hidden flex flex-col py-3'>
            <NavBar />
            <Routes>

              {/* Main redirect */}
              <Route path="/" element={<Home />} />

              {/* Auth routes */}
              <Route path="/auth/login" element={
                <>
                  <div className='w-full mx-auto' dir={'ltr'}>
                    <Login />
                  </div>
                </>
              } />
              {/* Main routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/data-input" element={<ProtectedRoute roles={['admin','superadmin']}><DataForm /></ProtectedRoute>} />
              <Route path="/user-management" element={<ProtectedRoute roles={['superadmin']}><UserManagement /></ProtectedRoute>} />
            </Routes>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                success: {
                  duration: 3000,
                },
                error: {
                  duration: 5000,
                },
              }}
            />
          </main>
        </Router>
      </OverlayProvider>
    </ThemeProvider>
  )
}

export default App