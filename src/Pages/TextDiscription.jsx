import React from "react";
import "../styles/TextDiscription.css";

export default function TextDiscription({ media }) {
  if (!media) return <p style={{ fontSize: "2.5rem" }}>לא נבחר מדיה</p>;
  console.log({ media })


  return (
    <div className="selected-media-details">
      <div className="media-info">
        <h2>{media.showTitle}</h2>
        <p className="media-date">{media.date}</p>
        <p className="media-description">{media.description}</p>
      </div>
    </div>
  );
}
