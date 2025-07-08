import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { he } from "date-fns/locale";  // ייבוא locale עברי

import "../styles/TagFilter.css";

registerLocale("he", he);  // רישום ה־locale לעברית

export default function TagFilter({ title, category, tags, activeFilters, onToggle }) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (!date) {
      onToggle(category, null);
      return;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year}`;
    onToggle(category, formattedDate);
    setOpen(false);
  };

  const toggleOpen = () => setOpen((prev) => !prev);

  return (
    <div className={`tag-filter ${open ? "open" : ""}`}>
      <div className="tag-filter-content-wrapper" style={{display: "flex", alignItems: "center"}}>
          <span className="filter-title">{title}</span> 
      </div>
       
      {/* תגיות לבחירה */}
      <div className="tag-items-container">
        {tags.map((tag) => (
          <label
            key={tag}
            className={`tag-item ${activeFilters.includes(tag) ? "active" : ""}`}
          >
            <input
              type="checkbox"
              checked={activeFilters.includes(tag)}
              onChange={() => onToggle(category, tag)}
              style={{ display: "none" }}
            />
            {tag}
          </label>
        ))}
      </div>
    </div>

  );
}
