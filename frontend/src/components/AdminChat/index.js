import React from "react";
import { ChatEngine } from "react-chat-engine";

function AdminChat() {
    return (
        <div
            style={{
                padding: "40px",
                width: "100%",
                backgroundColor: "var(--background-admin)",
            }}>
            <ChatEngine
                projectID='2bb36ddb-344b-498c-b8ee-927fb5be30a0'
                userName='ADMIN'
                userSecret='12345'
            />
        </div>
    );
}

export default AdminChat;
