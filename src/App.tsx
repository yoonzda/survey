import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SurveyPage from './pages/SurveyPage';
import ResultPage from './pages/ResultPage';
import RoutinePreviewPage from './pages/RoutinePreviewPage';
import RoutineDashboard from './pages/RoutineDashboard';
import FriendsPage from './pages/FriendsPage';
import StorePage from './pages/StorePage';
import Toast from './components/Toast';

function App() {
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/preview" element={<RoutinePreviewPage />} />
          <Route path="/dashboard" element={<RoutineDashboard />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/store" element={<StorePage />} />
        </Routes>
      </BrowserRouter>
      <Toast />
    </div>
  );
}

export default App;
