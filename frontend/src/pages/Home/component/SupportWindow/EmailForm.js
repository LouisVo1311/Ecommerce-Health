import React, { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { style } from "../SupportEngine/style";
import Avatar from "../SupportEngine/Avatar";
import axios from "axios";
import { useSelector } from "react-redux";

function EmailForm(props) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.user);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        setLoading(true)
        setUserName(user?.name);
        setLoading(false)
    }, [user?.name]);

    function getCreateUser(callback) {
        axios
            .put(
                "https://api.chatengine.io/users/",
                {
                    username: email,
                    secret: email,
                    email: email,
                },
                {
                    headers: {
                        "Private-Key": "9cb91c2a-9f29-4a41-99d4-138b742beda8",
                    },
                }
            )
            .then((r) => callback(r.data));
    }

    function getCreateChat(callback) {
        axios
            .put(
                "https://api.chatengine.io/chats/",
                {
                    usernames: ["ADMIN", email],
                    is_direct_chat: true,
                },
                {
                    headers: {
                        "Private-Key": "9cb91c2a-9f29-4a41-99d4-138b742beda8",
                    },
                }
            )
            .then((r) => callback(r.data));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        console.log("sending email", email);

        getCreateUser((user) => {
            props.setUser(user);
            getCreateChat((chat) => props.setChat(chat));
        });
    }

    return (
        <div
            style={{
                ...style.emailFormWindow,
                ...{
                    opacity: props.visible ? "1" : "0",
                    height: props.visible ? "100%" : "0%",
                },
            }}>
            <div style={{ height: "0%" }}>
                <div style={style.stripe} />
            </div>

            <div
                className='transition-5'
                style={{
                    ...style.loadingDiv,
                    ...{
                        zIndex: loading ? "10" : "-1",
                        opacity: loading ? "0.33" : "0",
                    },
                }}
            />

            <LoadingOutlined
                className='transition-5'
                style={{
                    ...style.loadingIcon,
                    ...{
                        zIndex: loading ? "10" : "-1",
                        opacity: loading ? "1" : "0",
                        fontSize: "8.2rem",
                        top: "calc(50% - 41px)",
                        left: "calc(50% - 41px)",
                    },
                }}
            />

            <div
                style={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    textAlign: "center",
                }}>
                <Avatar
                    style={{
                        position: "relative",
                        left: "calc(50% - 44px)",
                        top: "10px",
                    }}
                />

                <div style={style.topText}> {"Xin Chào "}
                {userName?.length && userName}</div>

                <form
                    onSubmit={(e) => handleSubmit(e)}
                    style={{ position: "relative", width: "100%", top: "19%" }}>
                    <input
                        style={style.emailInput}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Nhập email...'
                    />
                </form>

                <div style={style.bottomText}>Đăng nhập email của bạn để được tham khảo ý kiến tư vấn</div>
            </div>
        </div>
    );
}

export default EmailForm;
