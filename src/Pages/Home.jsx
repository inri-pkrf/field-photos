import React from "react";
import { Link } from "react-router-dom";
import '../styles/Home.css';
import { useNavigate } from "react-router-dom";

export default function Home() {
const navigate = useNavigate();
  return (
    <div  className="home-container">
      <header className="home-header">
        <img className='logo'  src={`${process.env.PUBLIC_URL}/assets/media/whiteLogo.svg`}/>

        <h1>ברוכים וברוכות הבאים והבאות<br/>לעזר תמונות מהשטח</h1>
        <p>   בעזר זה תוכלו לצפות בתמונות 
        וסרטונים מהשטח בעקבות מבצע 
        עם כלביא 
        </p>
      </header>

      <section className="home-features">
        <div className="feature-card"  onClick={()=> navigate("/photos")}>
          <h2>תמונות</h2>
            <img className='img-icon'  src={`${process.env.PUBLIC_URL}/assets/media/photo.png`}/>

        </div>
        <div className="feature-card" onClick={()=> navigate("/videos")}>
          <h2>סרטונים</h2>
        <img className='img-icon'  src={`${process.env.PUBLIC_URL}/assets/media/clapperboard.png`}/>

        </div>
      </section>


      <footer className="home-footer">
        <p>© 2025 MathLearning. All rights reserved.</p>
      </footer>
    </div>
  );
}
