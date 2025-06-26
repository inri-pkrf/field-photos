import React, { useState, useMemo } from "react";
import '../styles/Videos.css';
import TagFilter from "../components/TagFilter";
import videoData from "../Data/Videos/videoData";

const extractDriveId = (url) => {
  const patterns = [
    /\/d\/([^/]+)/,            // פורמט רגיל: /d/ID/
    /id=([^&]+)/,              // פורמט עם פרמטר id=ID
    /file\/d\/([^/]+)/         // עוד אפשרות
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// פונקציה שממירה מחרוזת תאריך dd-MM-yyyy לאובייקט Date תקין
function parseDate(str) {
  if (!str) return null;
  const [day, month, year] = str.split("-");
  return new Date(`${year}-${month}-${day}`);
}

// אוסף את כל התגיות האפשריות לפי קטגוריה
function getAvailableTags(data) {
  const emergencySet = new Set();
  const locationSet = new Set();
  const dateSet = new Set();

  data.forEach((video) => {
    (video.tags.emergency || []).forEach(tag => emergencySet.add(tag));
    (video.tags.location || []).forEach(tag => locationSet.add(tag));
    if (video.date) dateSet.add(video.date);
  });

  return {
    emergency: Array.from(emergencySet).sort(),
    location: Array.from(locationSet).sort(),
    date: Array.from(dateSet).sort(),
  };
}

// פונקציה לבדוק אם סרטון מתאים למסננים שנבחרו
function matchTags(videoTags, selectedTags, videoDate) {
  for (const key in selectedTags) {
    const selected = selectedTags[key];
    if (selected.length === 0) continue;

    if (key === "date") {
      // השוואת תאריכים לאחר המרה לאובייקט Date
      const videoDateObj = parseDate(videoDate);
      const selectedDateObj = parseDate(selected[0]);
      if (!videoDateObj || !selectedDateObj) return false;
      if (videoDateObj.getTime() !== selectedDateObj.getTime()) return false;
    } else {
      const videoTagArray = videoTags[key] || [];
      const allMatch = selected.every(tag => videoTagArray.includes(tag));
      if (!allMatch) return false;
    }
  }
  return true;
}

export default function Videos({ onSelectVideo, onDeselectVideo }) {
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  const handleVideoSelect = (video) => {
    if (video.id === selectedVideoId) {
      // אם לוחצים שוב על אותו סרטון שנבחר, נשלח אירוע דה-סלקט (כדי לסגור בקומפוננטות באפליקציה)
      setSelectedVideoId(null);
      if (onDeselectVideo) onDeselectVideo();
      sessionStorage.removeItem("selectedVideo");
      if (onSelectVideo) onSelectVideo(null);
    } else {
      setSelectedVideoId(video.id);
      if (onSelectVideo) onSelectVideo(video);
      sessionStorage.setItem("selectedVideo", JSON.stringify(video));
    }
  };

  const availableTags = useMemo(() => getAvailableTags(videoData), []);
  const [selectedTags, setSelectedTags] = useState({
    emergency: [],
    location: [],
    date: [],
  });

  const [openCategory, setOpenCategory] = useState(null);

  const filteredVideos = useMemo(() => {
    return videoData.filter(video => matchTags(video.tags, selectedTags, video.date));
  }, [selectedTags]);

  const handleTagToggle = (category, tag) => {
    setSelectedTags(prev => {
      if (category === "date") {
        return { ...prev, date: tag ? [tag] : [] };
      }

      const current = prev[category] || [];
      const isSelected = current.includes(tag);
      const updated = isSelected
        ? current.filter(t => t !== tag)
        : [...current, tag];

      return { ...prev, [category]: updated };
    });

    setOpenCategory(null); // סוגר את ה-dropdown אחרי בחירה
  };

  const handleClearAll = () => {
    setSelectedTags({ emergency: [], location: [], date: [] });
    setSelectedVideoId(null);
    sessionStorage.removeItem("selectedVideo");
    if (onSelectVideo) onSelectVideo(null);
  };

  const handleRemoveFilter = (category, tag) => {
    setSelectedTags(prev => {
      const updated = prev[category].filter(t => t !== tag);
      return { ...prev, [category]: updated };
    });
  };

  const getHebrewTitle = (key) => {
    switch (key) {
      case 'emergency': return 'אתגרים בחירום';
      case 'location': return 'מיקום בארץ';
      case 'date': return 'תאריך';
      default: return key;
    }
  };

  return (
    <div className="Videos-container">
      <header className="Videos-header">
        <h1>מאגר סרטונים</h1>
      </header>

      <section className="filter-section">
        <h2>סינון לפי תגיות</h2>

        {/* תגיות פעילות מוצגות תמיד */}
        <div className="active-filters">
          <p>תגיות פעילות:</p>
          {Object.entries(selectedTags).some(([_, arr]) => arr.length > 0) ? (
            Object.entries(selectedTags).map(([category, tags]) =>
              tags.map(tag => (
                <span key={`${category}-${tag}`} className="active-tag">
                  {tag}
                  <button onClick={() => handleRemoveFilter(category, tag)}>×</button>
                </span>
              ))
            )
          ) : (
            <p className="no-active-tags">לא נבחרו תגיות</p>
          )}

          {/* כפתור ניקוי תמיד מוצג */}
          <button className="clear-filters-btn" onClick={handleClearAll}>
            נקה הכול
          </button>
        </div>

        {["emergency", "location", "date"].map(category => (
          <TagFilter
            key={category}
            title={getHebrewTitle(category)}
            category={category}
            tags={availableTags[category]}
            activeFilters={selectedTags[category]}
            onToggle={handleTagToggle}
            isOpen={openCategory === category}
            setOpenCategory={setOpenCategory}
          />
        ))}
      </section>

      <section className="results-section">
        <h3>תוצאות ({filteredVideos.length})</h3>
        {filteredVideos.length === 0 ? (
          <div className="no-results">
            <p>לא נמצאו סרטונים.</p>
            <button className="clear-filters-btn1" onClick={handleClearAll}>נקה מסננים</button>
          </div>
        ) : (
          <div className="Videos-grid">
            {filteredVideos.map(video => {
              const driveId = extractDriveId(video.url);
              const thumbnailUrl = driveId
                ? `https://drive.google.com/thumbnail?id=${driveId}`
                : null;

              return (
                <div
                  key={video.id}
                  className={`video-card ${selectedVideoId === video.id ? "selected" : ""}`}
                  onClick={() => handleVideoSelect(video)}
                >
                  <img
                    src={thumbnailUrl}
                    alt={video.title}
                    className="video-thumbnail"
                  />
                  <h4>{video.showTitle}</h4>
                  <p>תאריך: {video.date || "לא ידוע"}</p>
                  <div className="tags-glow-container">
                    {Object.entries(video.tags).map(([category, tags]) =>
                      tags.filter(tag => tag).map((tag, index) => (
                        <span key={`${category}-${tag}-${index}`} className={`tag-glow-${category}`}>
                          {tag}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
