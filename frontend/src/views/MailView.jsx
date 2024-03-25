import React from "react";
import Navigator from "../components/layouts/Navigator";
import SideNav from "../components/layouts/SideNav";

const MailView = () => {
    return (
        <div>
            <div className="page__container">
                <section className="section mail__container">
                    <Navigator />
                    <h1>Mail</h1>
                    <SideNav />
                </section>
            </div>
        </div>
    );
};

export default MailView;
