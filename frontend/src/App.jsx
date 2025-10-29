import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import IssueDetails from './pages/IssueDetails';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Spaces from './pages/Spaces';
import ForYou from './pages/ForYou';
import Settings from './pages/Settings';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          <Route path='/' element={<PrivateRoute />}>
            <Route path='/' element={<Layout />}>
              <Route path='/' element={<ForYou />} />
              <Route path='/projects' element={<Projects />} />
              <Route path='/project/:id' element={<ProjectDetails />} />
              <Route path='/issue/:issueId' element={<IssueDetails />} />
              <Route path='/spaces' element={<Spaces />} />
              <Route path='/settings' element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
