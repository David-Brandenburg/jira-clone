import React from "react";
import "./Navbar.scss";
import logo_light from "./assets/logo_light";
import logo_dark from "./assets/logo_dark";
import search_icon_light from "./assets/search-w.png";
import search_icon_dark from "./assets/search-b.png";
import toggle_light from "./assets/day.png";
import toggle_dark from "./assets/night.png";


const Navigationbar = ({theme, setTheme}) => {

const toggle_mode = ()=> {
    theme == 'light'? setTheme('dark') : setTheme('light');
}

    return[
<div className="navbar">

    <img src={theme == 'light' ? logo_light : logo_dark} alt="" className="logo">

<ul>
    <li>Your Work</li>
    <li>Projects</li>
    <li>Filters</li>
    <li>Dashboards</li>
    <li>Teams</li>
    <li>Plans</li>
    <li>Apps</li>
</ul>
<div className="search-box">
    <input type="text" placeholder="Search"/>
    <img src={theme == 'light' ? search_icon_light : search_icon_dark} alt=""/>
</div>

<img onClick={()=>{toggle_mode()}} src={theme == 'light' ? search_icon_light : search_icon_dark} alt="" className="toggle-icon"/>
    </img>
  
</div>

    ];
}

export default Navigationbar;