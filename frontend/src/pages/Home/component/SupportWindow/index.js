import React, { useState } from "react";
import { style } from "../SupportEngine/style.js";
import EmailForm from "./EmailForm.js";
import ChatEngine from "./ChatEngine.js";

function SupportWindow(props) {
    const [user, setUser] = useState(null);
    const [chat, setChat] = useState(null);

    return (
        <div
            className='transition-5'
            style={{
                ...style.supportWindow,
                ...{ opacity: props.visible ? "1" : "0" },
            }}>
            <EmailForm
                setUser={(user) => setUser(user)}
                setChat={(chat) => setChat(chat)}
                visible={user === null || chat === null}
            />

            <ChatEngine
                visible={user !== null && chat !== null}
                chat={chat}
                user={user}
            />
        </div>
    );
}

export default SupportWindow;
