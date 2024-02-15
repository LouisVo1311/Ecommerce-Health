import React from "react";
import { useNavigate } from "react-router-dom";

const TypeProduct = ({ name }) => {
    const navigate = useNavigate();
    const handleNavigatetype = (type) => {
        navigate(
            `/product/${type
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                ?.replace(/ /g, "_")}`,
            { state: type }
        );
    };
    return (
        <div
            style={{ padding: "10px 30px 10px 0", cursor: "pointer"}}
            onClick={() => handleNavigatetype(name)}>
            <span style={{ fontSize: "1.6rem" }}>{name}</span>
        </div>
    );
};

export default TypeProduct;
