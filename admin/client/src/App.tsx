import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import AdminHome from './pages/AdminHome';
import AdminLogin from './pages/AdminLogin';
import TopBar from './molecules/TopBar';

function App() {
  return (
    <Router>
      {/*TopBar to be displayed on every page*/}
      <TopBar />
      <Routes>
        <Route path='/adminHome' element={<AdminHome />} />
        <Route path='/adminLogin' element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App
