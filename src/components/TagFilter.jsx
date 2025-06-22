import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/TagFilter.css";

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
  const month = String(date.getMonth() + 1).padStart(2, '0'); // החודש מתחיל מ-0
  const day = String(date.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;
  onToggle(category, formattedDate);
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
        <label
          className={`tag-item ${activeFilters.includes(tag) ? "active" : ""}`}
        >
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
