import React, { useState, useMemo } from "react";
import '../styles/Videos.css';
import TagFilter from "../components/TagFilter";
import videoData from "../Data/Videos/videoData";

// פונקציה לאיסוף כל התגיות הייחודיות לפי סוג
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

// פונקציה לבדיקת התאמה בין תגיות נבחרות לתגיות הסרטון
function matchTags(videoTags, selectedTags, videoDate) {
      console.log("Selected date:", selectedTags.date[0]);

  for (const key in selectedTags) {
    const selected = selectedTags[key];
    if (selected.length === 0) continue;

    if (key === "date") {
      // בודק התאמה מדויקת של תאריך אחד בלבד
      if (videoDate !== selected[0]) return false;
      
    } else {
      const videoTagArray = videoTags[key] || [];
      const allMatch = selected.every(tag => videoTagArray.includes(tag));
      if (!allMatch) return false;
    }
  }
  return true;
}


export default function Videos({ onSelectVideo }) {
  const availableTags = useMemo(() => getAvailableTags(videoData), []);
  const [selectedTags, setSelectedTags] = useState({
    emergency: [],
    location: [],
    date: [],
  });

  const filteredVideos = useMemo(() => {
    return videoData.filter(video => matchTags(video.tags, selectedTags, video.date));
  }, [selectedTags]);

  // שינוי תגית בקטגוריה מסוימת
  const handleTagToggle = (category, tag) => {
    setSelectedTags(prev => {
      if (category === "date") {
        // בחר תגית אחת בלבד בתאריך
        return {
          ...prev,
          date: tag ? [tag] : []
        };
      }
      const current = prev[category] || [];
      const isSelected = current.includes(tag);
      const updated = isSelected
        ? current.filter(t => t !== tag)
        : [...current, tag];
      return {
        ...prev,
        [category]: updated
      };
    });
  };

  // כשמשתמש לוחץ על סרטון - שולח את האובייקט ומאחסן ב-sessionStorage
  const handleVideoSelect = (video) => {
    if (onSelectVideo) onSelectVideo(video);
    sessionStorage.setItem("selectedVideo", JSON.stringify(video));
    console.log("video selected")
  };

  // תרגום שם קטגוריה לעברית
  const getHebrewTitle = (key) => {
    switch (key) {
      case 'emergency': return 'אתגרים בחירום';
      case 'location': return 'מיקום בארץ';
      case 'date': return 'תאריך';
      default: return key;
    }
  };

  return (
    <div className="Videos-container" >
      <header className="Videos-header">
        <h1>מאגר סרטונים</h1>
      </header>
  {Object.values(selectedTags).some(arr => arr.length > 0) && (
          <button
            className="clear-filters-btn"
            onClick={() => setSelectedTags({ emergency: [], location: [], date: [] })}
          >
            נקה את כל התגיות
          </button>
        )}
      <section className="filter-section">
        <h2>סינון לפי תגיות</h2>

      

        {/* יצירת קומפוננטת סינון עבור כל קטגוריה */}
        {["emergency", "location", "date"].map(category => (
          <TagFilter
            key={category}
            title={getHebrewTitle(category)}
            category={category}
            tags={availableTags[category]}
            activeFilters={selectedTags[category]}
            onToggle={handleTagToggle}
          />
        ))}
      </section>

      <section className="results-section">
        <h3>תוצאות ({filteredVideos.length})</h3>

        {filteredVideos.length === 0 ? (
          <div className="no-results">
            <p>לא נמצאו סרטונים עם התגיות שנבחרו.</p>
            <button
              className="clear-filters-btn"
              onClick={() => setSelectedTags({ emergency: [], location: [], date: [] })}
            >
              נקה מסננים
            </button>
          </div>
        ) : (
          <div className="Videos-grid" >
            {filteredVideos.map(video => (
              <div
                 key={video.id}
                  className="video-card"
                  onClick={() => {
                    console.log("clicked"); // בדיקה אם בכלל לוחצים
                    handleVideoSelect(video);
                  }}  // לחיצה על הסרטון
                style={{ cursor: 'pointer', border: "1px solid #ccc", borderRadius: 8, padding: 10 }}
              >
                <h4>{video.title}</h4>
                <p>תאריך: {video.date || "לא ידוע"}</p>
                <p>תגיות:</p>
                <div className="tags-glow-container">
                  {Object.values(video.tags)
                    .flat()
                    .filter(tag => tag)
                    .map((tag, index) => (
                      <span key={index} className="tag-glow">
                        {tag}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
