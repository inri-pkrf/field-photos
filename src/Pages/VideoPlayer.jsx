import React from "react";

export default function VideoPlayer({ videoUrl }) {
  if (!videoUrl) return <p>בחרי סרטון לצפייה</p>;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <video
        src={videoUrl}
        controls
        style={{ width: "100%", height: "auto", borderRadius: 8 }}
      />
    </div>
  );
}
