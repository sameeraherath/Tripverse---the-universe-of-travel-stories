import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import PostDetails from "./pages/PostDetails";
import LoginPage from "./pages/Auth/LoginPage";
import SignUpPage from "./pages/Auth/SignUpPage";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Bookmarks from "./pages/Bookmarks";
import Messages from "./pages/Messages";
import LandingPage from "./pages/LandingPage";
import ForYou from "./pages/ForYou";
import AdminDashboard from "./pages/AdminDashboard";
import Discover from "./pages/Discover";
import FloatingActionButton from "./components/FloatingActionButton";
import ProtectedRoute from "./components/ProtectedRoute";
import { SocketProvider } from "./contexts/SocketContext";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./toastStyles.css";

const App = () => {
  return (
    <Router>
      <SocketProvider>
        <AppContent />
      </SocketProvider>
    </Router>
  );
};

const AppContent = () => {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/signup", "/", "/admin"];

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/for-you" element={<ForYou />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/post/:id" element={<PostDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
      {!hideNavbarPaths.includes(location.pathname) && <FloatingActionButton />}
    </div>
  );
};

export default App;
