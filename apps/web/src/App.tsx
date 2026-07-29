import DashboardPage from "./pages/DashboardPage";
import CompDetailPage from "./pages/CompDetailPage";

export default function App() {
  const compMatch = window.location.pathname.match(/^\/comps\/([^/]+)$/);
  return compMatch ? <CompDetailPage slug={decodeURIComponent(compMatch[1])} /> : <DashboardPage />;
}
