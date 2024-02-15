import React from "react";
import classNames from "classnames/bind";

import styles from "./DefaultLayout.module.scss";
import HeaderComponent from "../../HeaderComponent";
import FooterComponent from "../../FooterComponent";

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className={cx("web-app")}>
            {/* Header */}
            <HeaderComponent />

            {/* Container */}
            <div className={cx("web-wrapper")}>{children}</div>

            {/* Header */}
            <FooterComponent />
        </div>
    );
}
export default DefaultLayout;
