import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { CoursePage } from './pages/Course';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Subject } from './pages/Subject';
import { PracticeTest } from './pages/PracticeTest';
import { AuthProvider } from './context/AuthContext';


import { History } from './pages/History';
import { Flashcards } from './pages/Flashcards';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="course/:id" element={<CoursePage />} />
            <Route path="subject/:name" element={<Subject />} />
            <Route path="practice/:subject" element={<PracticeTest />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="history" element={<History />} />
            <Route path="flashcards" element={<Flashcards />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
