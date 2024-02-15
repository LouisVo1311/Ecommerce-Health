import { Col, Image, InputNumber } from "antd";
import styled from "styled-components";

export const WrapperStyleImageSmall = styled(Image)`
    height: 64px;
    width: 64px;
`;

export const WrapperStyleColImage = styled(Col)`
    flex-basis: unset;
    display: flex;
`;

export const WrapperStyleNameProduct = styled.h1`
    font-size: 2.2rem;
    font-weight: 600;
    margin-bottom: 20px;
    line-height: 3.2rem;
    word-break: break-word;
    width: 100%;
`;

export const WrapperStyleTextSell = styled.span`
    font-size: 1.6rem;
    font-weight: 600;
    color: rgb(120, 120, 120);
`;

export const WrapperPriceTextProduct = styled.h1`
    color: var(--popular-color);
    font-size: 32px;
    line-height: 40px;
    font-weight: 600;
    margin: 20px 0;
`;

export const WrapperAddressProduct = styled.div`
    margin-bottom: 40px;
    span.address {
        color: var(--popular-color);
        text-decoration: underline;
        font-size: 1.6rem;
        line-height: 24px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-left: 5px;
    }
`;

export const WrapperQualityProduct = styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
    width: 120px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

export const WrapperInputNumber = styled(InputNumber)`
    &.ant-input-number.ant-input-number-sm {
        width: 35px;
        border-top: none;
        border-bottom: none;
        .ant-input-number-handler-wrap {
            display: none !important;
        }
    }
`;
