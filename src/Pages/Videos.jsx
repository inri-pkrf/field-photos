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
function matchTagsAny(videoTags, selectedTags, videoDate) {
  // אם אין סינון בכלל — מחזיר true
  const hasAnySelected = Object.values(selectedTags).some(arr => arr.length > 0);
  if (!hasAnySelected) return true;

  // נבדוק אם הסרטון תואם לפחות תגית אחת מכל התגיות שנבחרו
  // גם בתאריכים: אם בחרנו תאריך, תואם לפחות אחד מהם

  // בודקים קטגוריה קטגוריה
  for (const key in selectedTags) {
    const selected = selectedTags[key];
    if (selected.length === 0) continue;

    if (key === "date") {
      const videoDateObj = parseDate(videoDate);
      const matchesDate = selected.some(dateStr => {
        const selDateObj = parseDate(dateStr);
        return videoDateObj && selDateObj && videoDateObj.getTime() === selDateObj.getTime();
      });
      if (matchesDate) return true;
    } else {
      const videoTagArray = videoTags[key] || [];
      const matchesTag = selected.some(tag => videoTagArray.includes(tag));
      if (matchesTag) return true;
    }
  }
  return false;
}

export default function Videos({ onSelectVideo, onDeselectVideo }) {
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  const handleVideoSelect = (video) => {
    if (video.id === selectedVideoId) {
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
    return videoData.filter(video => matchTagsAny(video.tags, selectedTags, video.date));
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

    setOpenCategory(null);
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
      case 'location': return 'מיקום';
      case 'date': return 'תאריך';
      default: return key;
    }
  };

  return (
    <div className="Videos-container">
      <header className="Videos-header">
        <h1>מאגר סרטונים</h1>
      </header>

      <div className="filter-section">

  

  <button className="clear-filters-btn" onClick={handleClearAll}>
    נקה הכול
  </button>



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
      </div>

      <div className="results-section">
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

              return (
                <div
                  key={video.id}
                  className={`video-card ${selectedVideoId === video.id ? "selected" : ""}`}
                  onClick={() => handleVideoSelect(video)}
                >
                  {driveId ? (
                     <img
                     src={`https://drive.google.com/thumbnail?id=${driveId}`}
                     alt={video.title}
                     className="video-thumbnail"
                     onClick={() => handleVideoSelect(video)}
                   />
                  ) : (
                    <div className="no-preview">אין תצוגה מקדימה</div>
                  )}

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
      </div>
    </div>
  );
}
