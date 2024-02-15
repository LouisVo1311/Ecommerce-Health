import React, { useEffect, useState } from "react";
import { ChatEngineWrapper, Socket, ChatFeed } from "react-chat-engine";
import { style } from "../SupportEngine/style";

function ChatEngine(props) {
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        if (props.visible) {
            setTimeout(() => {
                setShowChat(true);
            }, 500);
        }
    });
    return (
        <div
            className='transition-5'
            style={{
                height: props.visible ? "100%" : "0%",
                zIndex: props.visible ? "100" : "0",
                backgroundColor: "white",
            }}>
            {props.visible && (
                <ChatEngineWrapper >
                    <Socket
                        projectID='2bb36ddb-344b-498c-b8ee-927fb5be30a0'
                        userName={props.user.email}
                        userSecret={props.user.email}
                    />
                    <ChatFeed activeChat={props.chat.id} />
                </ChatEngineWrapper>
            )}
        </div>
    );
}

export default ChatEngine;
