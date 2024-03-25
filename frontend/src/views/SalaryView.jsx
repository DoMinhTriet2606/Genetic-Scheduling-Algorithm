import React from "react";
import Navigator from "../components/layouts/Navigator";
import SideNav from "../components/layouts/SideNav";

const SalaryView = () => {
    return (
        <div>
            <div className="page__container">
                <section className="section salary__container">
                    <Navigator />
                    <h1>Salary</h1>
                    <SideNav />
                </section>
            </div>
        </div>
    );
};

export default SalaryView;
