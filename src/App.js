import React, { useState } from "react";
import Home from "./Pages/Home";
import Videos from "./Pages/Videos";
import VideoPlayer from "./Pages/VideoPlayer";

import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";

function App() {
const [selectedVideo, setSelectedVideo] = useState(() => {
  const saved = sessionStorage.getItem("selectedVideo");
  return saved ? JSON.parse(saved) : null;
});


  return (
    <HashRouter>
      <div className="app-container">
        <div className="screen right-screen scrollable">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/Videos"
              element={<Videos onSelectVideo={setSelectedVideo} />}
            />
            {/* כאן תוסיפי עוד דפים אם תרצי */}
          </Routes>
        </div>
        <div className="screen center-screen">
           {selectedVideo ? (
            <VideoPlayer videoUrl={selectedVideo.url} />
          ) : (
            <p>בחרי סרטון לצפייה</p>
          )}
        </div>
        <div className="screen left-screen">
          {/* קומפוננטות של המסך השמאלי */}
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
