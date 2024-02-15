import React, { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import SupportWindow from "../SupportWindow";

const SupportEngine = () => {
    const ref = useRef(null)
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        function handleClickOutSide(e) {
            if(ref.current && !ref.current.contains(e.target)) {
                setVisible(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutSide)

        return () => document.removeEventListener("mousedown", handleClickOutSide)
    })
    return (
        <div ref={ref}>
            <SupportWindow visible={visible} />

            <Avatar
                onClick={() => setVisible(true)}
                style={{ position: "fixed", bottom: "24px", right: "24px" }}
            />
        </div>
    );
};

export default SupportEngine;
