import { Checkbox } from "antd";
import styled from "styled-components";

export const WrapperStyleHeader = styled.div`
    background: rgb(255, 255, 255);
    padding: 9px 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    span {
        color: rgb(36, 36, 36);
        font-weight: 400;
        font-size: 13px;
    }
`;
export const WrapperStyleHeaderDilivery = styled.div`
    background: rgb(255, 255, 255);
    padding: 9px 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    span {
        color: rgb(36, 36, 36);
        font-weight: 400;
        font-size: 13px;
    }
    margin-bottom: 4px;
`;

export const WrapperLeft = styled.div`
    width: 100%;
    margin-top: 20px;
`;

export const WrapperListOrder = styled.div``;

export const WrapperItemOrder = styled.div`
    display: flex;
    align-items: center;
    padding: 9px 16px;
    background: #fff;
    margin-top: 12px;
`;

export const WrapperPriceDiscount = styled.span`
    color: #999;
    font-size: 12px;
    text-decoration: line-through;
    margin-left: 4px;
`;
export const WrapperCountOrder = styled.div`
    display: flex;
    align-items: center;
    width: 100px;
    margin: 0 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

export const WrapperRight = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    align-items: center;
    margin-top: 10px;
    border: 1px solid #dbdbdb;
    border-radius: 8px;
    padding: 20px;
`;

export const WrapperInfo = styled.div`
    padding-bottom: 20px;
    border-bottom: 1px solid #f5f5f5;
    background: #fff;
    width: 100%;
`;

export const WrapperTotal = styled.div`
    width: 100%;
    display: flex;
    align-content: center;
    justify-content: space-between;
    padding-bottom: 20px;
`;

export const CustomCheckbox = styled(Checkbox)`
    .ant-checkbox-checked .ant-checkbox-inner {
        background-color: #9255fd;
        border-color: #9255fd;
    }
    .ant-checkbox:hover .ant-checkbox-inner {
        border-color: #9255fd;
    }
`;
