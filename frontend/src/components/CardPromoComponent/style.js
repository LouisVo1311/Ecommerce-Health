import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
    width: 220px;
    height: auto;
    & img {
        border: 1px solid #dedede;
        height: 100%;
        width: 100%;
    },
    position: relative;
    background-color: ${(props) => (props.disabled ? "#ccc" : "#fff")};
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    border-radius: 6px;
`;

export const StyleNameProduct = styled.div`
    font-weight: 600;
    font-size: 1.4rem;
    line-height: 2.2rem;
    color: var(--text-color-black);
    margin-bottom: 10px;
`;

export const WrapperStyleTextSell = styled.span`
    font-size: 1.4rem;
    font-weight: 600;
    color: rgb(120, 120, 120);
`;

export const WrapperPriceText = styled.div`
    color: var(--popular-color);
    font-size: 1.8rem;
    font-weight: 600;
    margin-top: 10px;
`;

export const WrapperDiscountText = styled.span`
    color: rgb(255, 66, 78);
    font-size: 1.4rem;
    font-weight: 500;
`;