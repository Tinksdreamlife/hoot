import { useContext, useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router';
import { getUser } from '../../services/authService';
import HomePage from '../HomePage/HomePage';
import PostListPage from '../PostListPage/PostListPage';
import SignUpPage from '../SignUpPage/SignUpPage';
import LogInPage from '../LogInPage/LogInPage';
import NavBar from '../../components/NavBar/NavBar';
import './App.css';
import HootList from '../../components/HootList/HootList';
import * as hootService from '../../services/hootService';
import HootDetails from '../../components/HootDetails/HootDetails';
import HootForm from '../../components/HootForm/HootForm';


export default function App() {
  const navigate = useNavigate();
  const [user, setUser ] = useState(getUser);
  const [hoots, setHoots] = useState([]);
  useEffect(() => {
    const fetchAllHoots = async () => {
      const hootsData = await hootService.index();

      // console log to verify
      console.log('hootsData:', hootsData);

      setHoots(hootsData);
    };
    if (user) fetchAllHoots();
  }, [user]);

  const handleAddHoot = async (hootFormData) => {
    const newHoot = await hootService.create(hootFormData);
    setHoots([newHoot, ...hoots]);
    navigate('/hoots');
  };

  return (
    <main className="App">
      <NavBar user={user} setUser={setUser} />
      <section id="main-section">
        {user ? (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts" element={<PostListPage />} />
            <Route path="/hoots" element={<HootList hoots={hoots} />} />
            <Route path="/hoots/new" element={<h1>New Hoot</h1>} />
            <Route path="/hoots/:hootId" element={<HootDetails/>} />
            <Route path='/hoots/new' element={<HootForm />} />
            <Route path='/hoots/new' element={<HootForm handleAddHoot={handleAddHoot} />} />
            <Route path="*" element={null} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage setUser={setUser} />} />
            <Route path="/login" element={<LogInPage setUser={setUser} />} />
            <Route path="*" element={null} />
          </Routes>
        )}
      </section>
    </main>
  );
}

