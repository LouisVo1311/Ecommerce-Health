import React from "react";
import {
    StyleNameProduct,
    WrapperCardStyle,
    WrapperPriceText,
    WrapperStyleTextSell,
} from "./style";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { convertPrice } from "../../utils";

const CardComponent = (props) => {
    const { image, name, price, id, selled } = props;
    const navigate = useNavigate();
    const handleDetailsProduct = (id) => {
        navigate(`/product-details/${id}`);
    };
    return (
        <WrapperCardStyle
            hoverable
            cover={<img alt='example' src={image} />}
            onClick={() => handleDetailsProduct(id)}>
            <StyleNameProduct>{name}</StyleNameProduct>
            <WrapperStyleTextSell>
                <ShoppingCartOutlined />
                <span style={{ marginLeft: "5px" }}>Đã Bán {selled || 0}</span>
            </WrapperStyleTextSell>
            <WrapperPriceText>
                <span>{convertPrice(price)}</span>
            </WrapperPriceText>
        </WrapperCardStyle>
    );
};

export default CardComponent;
