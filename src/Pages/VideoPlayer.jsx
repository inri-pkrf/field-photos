import React, { useEffect, useState } from "react";
import '../styles/VideoPlayer.css';

function convertDriveUrlToEmbed(url) {
  // אם הקישור הוא קישור Google Drive רגיל של הקובץ, להוציא את ה-ID ולהחזיר קישור embed
  const regex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/;
  const match = url.match(regex);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  // אם הקישור כבר embed או אחר, מחזיר אותו כמו שהוא
  return url;
}

export default function VideoPlayer({ videoUrl }) {
  const [url, setUrl] = useState(() => {
    const savedUrl = sessionStorage.getItem("selectedVideoUrl");
    return savedUrl ? convertDriveUrlToEmbed(savedUrl) : null;
  });

  useEffect(() => {
    if (videoUrl) {
      const embedUrl = convertDriveUrlToEmbed(videoUrl);
      setUrl(embedUrl);
      sessionStorage.setItem("selectedVideoUrl", embedUrl);
    }
  }, [videoUrl]);

  if (!url) return <p>בחרי סרטון לצפייה</p>;

  return (
    <div className="video-player">
      <iframe
        src={url}
        allow="autoplay"
        frameBorder="0"
        allowFullScreen
        title="Video Player"
      ></iframe>
    </div>
  );
}
