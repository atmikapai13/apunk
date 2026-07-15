import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProjectsGrid from './pages/projects-grid'
import ProjectsCarousel from './pages/projects-carousel'
import Writing from './pages/Writing'
import Contact from './pages/Contact'
import Cursor from './components/Cursor'
import Layout from './components/Layout'

function App() {
  return (
    <BrowserRouter>
      <Cursor />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects-grid" element={<ProjectsGrid />} />
          <Route path="/projects-carousel" element={<ProjectsCarousel />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/writing/:slug" element={<Writing />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
