import React, { useState } from "react";
import Home from "./Pages/Home";
import Videos from "./Pages/Videos";
import VideoPlayer from "./Pages/VideoPlayer";

// import Gallery from "./componentsJS/Gallery"; // לדוגמה
import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";

function App() {
  const [category, setCategory] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  return (
    <HashRouter>
      <div className="app-container">
        <div className="screen right-screen scrollable">
          <Routes>
            <Route path="/" element={<Home />} />
             <Route
              path="/Videos"
              element={<Videos onSelectVideo={setSelectedVideoId} />}
            />            {/* <Route path="/gallery" element={<Gallery />} /> */}
            {/* כאן תוסיפי עוד דפים אם תרצי */}
          </Routes>
        </div>
        <div className="screen center-screen">
 {selectedVideoId ? (
            <VideoPlayer videoId={selectedVideoId} />
          ) : (
            <p>בחרי סרטון לצפייה</p>
          )}        </div>
        <div className="screen left-screen">
          {/* קומפוננטות של המסך השמאלי */}
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
