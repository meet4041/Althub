import Events from "./components/Events";
import Feedback from "./components/Feedback";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import SearchProfile from "./components/SearchProfile";
import Message from "./components/Message";
import { Route, Routes } from "react-router-dom";
import ViewProfile from "./components/ViewProfile";
import Notidfication from "./components/Notidfication";
import Main from "./components/Main";
import ForgetPassword from "./components/ForgetPassword";
import { ToastContainer } from "react-toastify";
import NewPassword from "./components/NewPassword";
import ViewSearchProfile from "./components/ViewSearchProfile";
import { io } from "socket.io-client";
import Navbar from "./components/Navbar";
import HelpStudents from "./components/HelpStudents";

function App() {
  const socket = io("ws://localhost:8900");
  return (
    <>
    <ToastContainer/>
    <Navbar socket={socket}/>
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/home" element={<Home socket={socket}/>} />
        <Route exact path="/events" element={<Events />} />
        <Route exact path="/feedback" element={<Feedback />} />
        <Route exact path="/view-profile" element={<ViewProfile />} />
        <Route exact path="/view-search-profile" element={<ViewSearchProfile socket={socket}/>} />
        <Route exact path="/search-profile" element={<SearchProfile />} />
        <Route exact path="/message" element={<Message socket={socket}/>} />
        <Route exact path="/notification" element={<Notidfication />} />
        <Route exact path="/forget-password" element={<ForgetPassword />} />
        <Route exact path="/new-password" element={<NewPassword />} />
        <Route exact path="/help-students" element={<HelpStudents />} />
      </Routes>
    </>
  );
}

export default App;
