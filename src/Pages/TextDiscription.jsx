import React from "react";
import "../styles/TextDiscription.css";

export default function TextDiscription({ media }) {
  if (!media) return <p style={{ fontSize: "2.5rem" }}>לא נבחר מדיה</p>;

  const { title, date, description, type, url } = media;

  return (
    <div className="selected-media-details">
      <div className="media-info">
        <h2>{title}</h2>
        <p className="media-date">{date}</p>
        <p className="media-description">{description}</p>
      </div>
    </div>
  );
}
