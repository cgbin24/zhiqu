import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { LearnPath } from '@/pages/LearnPath';
import { LevelPlay } from '@/pages/LevelPlay';
import { Playground } from '@/pages/Playground';
import { Achievements } from '@/pages/Achievements';
import { Profile } from '@/pages/Profile';
import { TermsHome } from '@/pages/TermsHome';
import { TermCategoryPage, TermDetailPage } from '@/pages/TermCategoryPage';
import { TermQuiz } from '@/pages/TermQuiz';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/learn" element={<Navigate to="/learn/go" replace />} />
          <Route path="/learn/:lang" element={<LearnPath />} />
          <Route path="/level/:id" element={<LevelPlay />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/terms" element={<TermsHome />} />
          <Route path="/terms/quiz" element={<TermQuiz />} />
          <Route path="/terms/:cat" element={<TermCategoryPage />} />
          <Route path="/terms/:cat/:tid" element={<TermDetailPage />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
