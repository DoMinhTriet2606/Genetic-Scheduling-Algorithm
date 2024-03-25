import React from "react";
import { Link, useLocation } from "react-router-dom";

import "../../assets/css/layouts/header.css";
import { useSelector } from "react-redux";
import { authSelector } from "../../features/authentication/authSlice";

const Header = () => {
    const { user } = useSelector(authSelector);
    const location = useLocation();
    if (location.pathname === "/authenticate") return null;
    if (!user) return null;

    const API_KEY = "56106207e77287a62ebd02914132910a";
    const RAIN = "Remember to bring your umbrella! ^^";
    navigator.geolocation.getCurrentPosition(onSuccess, onFailure);

    function onSuccess(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

        fetch(url)
            .then((response) => response.json())
            .then((responseData) => {
                const weather = document.querySelector("#weather");
                weather.querySelector(".city").innerHTML = `City: ${responseData.name}`;
                weather.querySelector(
                    ".status"
                ).innerHTML = `Status: ${responseData.weather[0].main}`;
                weather.querySelector(
                    ".description"
                ).innerHTML = `Description: ${responseData.weather[0].description}`;
                weather.querySelector(
                    ".weather__image"
                ).style.backgroundImage = `url(https://openweathermap.org/img/wn/${responseData.weather[0].icon}@2x.png)`;
                if (responseData.weather[0].main === "Rain")
                    document.querySelector(".reminder").innerHTML = RAIN;
            });
    }
    function onFailure(err) {
        console.log(err);
    }

    return (
        <>
            <div className="header">
                <div className="brand">
                    <Link to="/user/main">
                        <h1>Logo</h1>
                    </Link>
                </div>
                <div id="weather">
                    <div className="weather__info">
                        <h2 className="city">unknown</h2>
                        <h3 className="status">unknown</h3>
                        <p className="description">unknown</p>
                    </div>
                    <div className="weather__image"></div>
                </div>
            </div>
        </>
    );
};

export default Header;
