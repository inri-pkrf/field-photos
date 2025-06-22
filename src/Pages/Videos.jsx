import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  for (const key in selectedTags) {
    const selected = selectedTags[key];
    if (selected.length === 0) continue;

    if (key === "date") {
      if (!selected.includes(videoDate)) return false;
    } else {
      const videoTagArray = videoTags[key] || [];
      const allMatch = selected.every(tag => videoTagArray.includes(tag));
      if (!allMatch) return false;
    }
  }
  return true;
}

export default function Videos() {
  const navigate = useNavigate();

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
        <p>בחר סרטון לצפייה</p>
      </header>

      <section className="filter-section">
        <h2>סינון לפי תגיות</h2>

        {Object.values(selectedTags).some(arr => arr.length > 0) && (
          <button
            className="clear-filters-btn"
            onClick={() => setSelectedTags({ emergency: [], location: [], date: [] })}
          >
            נקה את כל התגיות
          </button>
        )}

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
          <div className="Videos-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
            {filteredVideos.map(video => (
              <div
                key={video.id}
                className="video-card"
                onClick={() => navigate(`/VideoPlayer?id=${video.id}`)}
                style={{ cursor: 'pointer', border: "1px solid #ccc", borderRadius: 8, padding: 10 }}
              >
                {/* <img
                  src={process.env.PUBLIC_URL + video.thumbnail}
                  alt={video.title}
                  className="video-thumbnail"
                  style={{ width: "100%", borderRadius: 6 }}
                /> */}
                <h4>{video.title}</h4>
                <p>תאריך: {video.date || "לא ידוע"}</p>
                <p>
                  תגיות:&nbsp;
                  {Object.entries(video.tags).map(([key, arr]) =>
                    arr.length > 0 ? (
                      <span key={key}>
                        {key}: {arr.join(", ")};&nbsp;
                      </span>
                    ) : null
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
