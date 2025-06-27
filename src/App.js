import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardSidebar from "./components/dashboard_sidebar";
import CvLink from "./pages/cv_link";
import NotFound from "./pages/not_found";
import { Dashboard } from "./pages/dashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<DashboardSidebar />}>
          <Route index element={<Dashboard />} />
          <Route path='cv-link' element={<CvLink />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
