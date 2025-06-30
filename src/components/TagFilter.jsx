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
      <div className="tag-filter-content-wrapper" style={{display: "flex", alignItems: "center", gap: "10px"}}>
        <button className="tag-filter-toggle" onClick={toggleOpen}>
          <span className="filter-title">{title}</span> {open ? "▶" : "◀"}
        </button>
    

        {!open && activeFilters.length > 0 && (
          <div className="selected-tags-inline" >
            {activeFilters.map((tag) => (
              <span key={tag} className="selected-tag" >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div className={`tag-filter-content ${category === "date" ? "date" : "tags"}`}>
          {category === "date" ? (
            <div className="date-picker-container">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd-MM-yyyy"
                inline
                locale={he} 
                calendarStartDay={0}
              />
            </div>
          ) : (
            <ul className="tag-list">
              {tags.map((tag) => (
                <li key={tag}>
                  <label
                    className={`tag-item ${activeFilters.includes(tag) ? "active" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={activeFilters.includes(tag)}
                      onChange={() => {
                        onToggle(category, tag);
                        setOpen(false);
                      }}
                    />
                    {tag}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <hr></hr>
    </div>
  );
}
