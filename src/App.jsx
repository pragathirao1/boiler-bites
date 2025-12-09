import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { FoodProvider } from './contexts/FoodContext'
import LandingPage from './pages/LandingPage'
import VenueSelection from './pages/VenueSelection'
import KitchenDashboard from './pages/KitchenDashboard'
import StudentApp from './pages/StudentApp'

function App() {
  return (
    <FoodProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/kitchen-login" element={<VenueSelection />} />
          <Route path="/kitchen" element={<KitchenDashboard />} />
          <Route path="/student" element={<StudentApp />} />
        </Routes>
      </Router>
    </FoodProvider>
  )
}

export default App

