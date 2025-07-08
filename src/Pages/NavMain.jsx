import React from "react";
import { Link } from "react-router-dom";
import '../styles/NavMain.css';
import { useNavigate } from "react-router-dom";

export default function NavMain() {
const navigate = useNavigate();
  return (
    <div  className="nav-container">
     <img className='logo'  src={`${process.env.PUBLIC_URL}/assets/media/whiteLogo.svg`} onClick={()=>navigate("/")}/>

      <section className="nav-features">
        <div className="nav-item"  onClick={()=> navigate("/photos")}>
          <h2>תמונות</h2>

        </div>
        <div  className="nav-item"  onClick={()=> navigate("/videos")}>
          <h2>סרטונים</h2>
        </div>
      </section>
    </div>
  );
}
