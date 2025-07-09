import React, { useState, useEffect } from "react";
import Home from "./Pages/Home";
import Videos from "./Pages/Videos";
import VideoPlayer from "./Pages/VideoPlayer";
import TextDiscription from "./Pages/TextDiscription";
import NavMain from "./Pages/NavMain";
import "./App.css";
import { HashRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";

function AppWrapper() {
  const navigate=useNavigate();
  const location = useLocation();
  const [selectedVideo, setSelectedVideo] = useState(() => {
    const saved = sessionStorage.getItem("selectedVideo");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (selectedVideo) {
      sessionStorage.setItem("selectedVideo", JSON.stringify(selectedVideo));
    }
  }, [selectedVideo]);

  const isHome = location.pathname === "/";

  return (
    <div className="app-container">
      {/* ימין */}
      <div className="screen right-screen">
      {isHome ? (
          <p> </p>
        ) : (
          <TextDiscription media={selectedVideo} />
        )}
      </div>

      {/* מרכז */}
      <div className="screen center-screen">
        {isHome ? (
          <p>בחרי עמוד מהתפריט כדי להתחיל</p>
        ) : selectedVideo ? (
          <VideoPlayer videoUrl={selectedVideo.url} />
        ) : (
          <p>בחרי סרטון לצפייה</p>
        )}
      </div>

      {/* שמאל */}
      {/* <div className={`screen left-screen ${isHome ? "" : "scrollable"}`} > */}
      <div className="screen left-screen" >
      <NavMain/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/Videos"
          element={<Videos onSelectVideo={setSelectedVideo} />}
        />
      </Routes>
       
      </div>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <AppWrapper />
    </HashRouter>
  );
}

export default App;
