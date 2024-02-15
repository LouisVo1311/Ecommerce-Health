import React, { useEffect, useState } from "react";

import { style } from "./style";
import { useSelector } from "react-redux";

function Avatar(props) {
    const user = useSelector((state) => state.user);
    const [hovered, setHovered] = useState(false);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        setUserName(user?.name);
    }, [user?.name]);

    return (
        <div style={props.style}>
            <div
                className='transition-3'
                style={{
                    ...style.avatarHello,
                    ...{ opacity: hovered ? "1" : "0" },
                }}>
                {"Xin Chào "}
                {userName?.length && userName}
            </div>

            <div
                className='transition-3'
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => props.onClick && props.onClick()}
                style={{
                    ...style.chatWithMeButton,
                    ...{
                        border: hovered
                            ? "1px solid #f9f0ff"
                            : "4px solid var(--btn-blue-color)",
                    },
                }}
            />
        </div>
    );
}

export default Avatar;
