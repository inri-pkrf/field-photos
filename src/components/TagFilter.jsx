// components/TagFilter.jsx
import React, { useState } from "react";
import '../styles/TagFilter.css';

export default function TagFilter({ title, category, tags, activeFilters, onToggle }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="tag-filter">
      <button className="tag-filter-toggle" onClick={() => setOpen(!open)}>
        {title} {open ? "▲" : "▼"}
      </button>

      {open && (
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
    </div>
  );
}
