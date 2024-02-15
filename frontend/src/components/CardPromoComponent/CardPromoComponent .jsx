import React, { Fragment } from "react";
import {
    StyleNameProduct,
    WrapperCardStyle,
    WrapperDiscountText,
    WrapperPriceText,
    WrapperStyleTextSell,
} from "./style";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { convertPrice } from "../../utils";

const CardPromoComponent = (props) => {
    const { image, name, price, discount, id, selled } = props;
    const navigate = useNavigate();
    const handleDetailsProduct = (id) => {
        navigate(`/product-details/${id}`);
    };
    return (
        <Fragment>
            {discount > 0 && (
                <WrapperCardStyle
                    hoverable
                    cover={<img alt='example' src={image} />}
                    onClick={() => handleDetailsProduct(id)}>
                    <StyleNameProduct>{name}</StyleNameProduct>
                    <WrapperStyleTextSell>
                        <ShoppingCartOutlined />
                        <span style={{ marginLeft: "5px" }}>
                            Đã Bán {selled || 0}
                        </span>
                    </WrapperStyleTextSell>
                    <WrapperPriceText>
                        <span style={{ marginRight: "10px" }}>
                            {convertPrice(price)}
                        </span>
                        <WrapperDiscountText>- {discount}%</WrapperDiscountText>
                    </WrapperPriceText>
                </WrapperCardStyle>
            )}
        </Fragment>
    );
};

export default CardPromoComponent;
