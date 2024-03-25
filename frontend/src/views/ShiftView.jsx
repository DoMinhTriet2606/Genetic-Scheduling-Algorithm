import React from "react";
import Navigator from "../components/layouts/Navigator";
import SideNav from "../components/layouts/SideNav";

const ShiftView = () => {
    return (
        <div>
            <div className="page__container">
                <section className="section shift__container">
                    <Navigator />
                    <h1>Shift</h1>
                    <SideNav />
                </section>
            </div>
        </div>
    );
};

export default ShiftView;
