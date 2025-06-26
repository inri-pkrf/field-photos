import React, { useState, useEffect } from "react";
import Home from "./Pages/Home";
import Videos from "./Pages/Videos";
import VideoPlayer from "./Pages/VideoPlayer";
import TextDiscription from "./Pages/TextDiscription";

import "./App.css";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";

function AppWrapper() {
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
      <div className={`screen right-screen ${isHome ? "" : "scrollable"}`}>
      <img className='logo'  src={`${process.env.PUBLIC_URL}/assets/media/whiteLogo.svg`}/>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/Videos"
            element={<Videos onSelectVideo={setSelectedVideo} />}
          />
        </Routes>
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
      <div className="screen left-screen">
        {isHome ? (
          <p>כאן תופיע תיאור הסרטון כשתבחרי אחד</p>
        ) : (
          <TextDiscription media={selectedVideo} />
        )}
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
