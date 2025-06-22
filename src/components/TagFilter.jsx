import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/TagFilter.css";

export default function TagFilter({ title, category, tags, activeFilters, onToggle }) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // שליחת הערך לפונקציה החיצונית
    onToggle(category, date?.toISOString().split('T')[0]);
  };

  return (
    <div className="tag-filter">
      <button className="tag-filter-toggle" onClick={() => setOpen(!open)}>
        {title} {open ? "▲" : "▼"}
      </button>

      {open && category !== "date" && (
        <ul className="tag-list">
          {tags.map(tag => (
            <li key={tag}>
              <label className="tag-item">
                <input
                  type="checkbox"
                  checked={activeFilters.includes(tag)}
                  onChange={() => onToggle(category, tag)}
                />
                {tag}
              </label>
            </li>
          ))}
        </ul>
      )}

      {open && category === "date" && (
        <div className="date-picker-container">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            inline
          />
        </div>
      )}
    </div>
  );
}
