import React, { useMemo } from "react";
import {
    Lable,
    WrapperInfo,
    WrapperContainer,
    WrapperValue,
    WrapperItemOrder,
    WrapperItemOrderInfo,
} from "./style";
import Loading from "../../components/LoadingComponent/Loading";
import { useLocation } from "react-router-dom";
import { orderContant } from "../../contant";
import { convertPrice } from "../../utils";
import { Container } from "react-bootstrap";

const OrderSuccess = () => {
    const location = useLocation();
    const { state } = location;

    return (
        <Loading isLoading={false}>
            <Container>
                <div
                    style={{
                        height: "100%",
                        width: "1270px",
                        margin: "0 auto",
                    }}>
                    <h1
                        style={{
                            textAlign: "center",
                            color: "var(--popular-color)",
                        }}>
                        ĐẶT HÀNG THÀNH CÔNG
                    </h1>
                    <h3
                        style={{
                            textAlign: "start",
                            color: "var(--popular-color)",
                        }}>
                        THÔNG TIN ĐƠN HÀNG
                    </h3>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <WrapperContainer>
                            <WrapperInfo>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}>
                                    <Lable>Phương thức giao hàng:</Lable>
                                    <WrapperValue>
                                        <span
                                            style={{
                                                color: "#ea8500",
                                                fontWeight: "bold",
                                                marginRight: "5px",
                                            }}>
                                            {
                                                orderContant.delivery[
                                                    state?.delivery
                                                ]
                                            }
                                        </span>
                                        Giao hàng tiết kiệm
                                    </WrapperValue>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}>
                                    <Lable>Phương thức thanh toán</Lable>

                                    <WrapperValue>
                                        {orderContant.payment[state?.payment]}
                                    </WrapperValue>
                                </div>
                            </WrapperInfo>
                            <h3
                                style={{
                                    textAlign: "start",
                                    color: "var(--popular-color)",
                                    marginTop: "20px",
                                }}>
                                CHI TIẾT ĐƠN HÀNG
                            </h3>
                            <WrapperItemOrderInfo>
                                {state.orders?.map((order) => {
                                    return (
                                        <WrapperItemOrder key={order?.name}>
                                            <div
                                                style={{
                                                    width: "500px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 4,
                                                }}>
                                                <img
                                                    src={order?.image}
                                                    style={{
                                                        width: "77px",
                                                        height: "79px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                                <div
                                                    style={{
                                                        width: 260,
                                                        overflow: "hidden",
                                                        marginLeft: "10px",
                                                    }}>
                                                    {order?.name}
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    flex: 1,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "10px",
                                                }}>
                                                <span
                                                    style={{
                                                        fontSize: "1.4rem",
                                                        color: "#242424",
                                                    }}>
                                                    Đơn giá:{" "}
                                                    {convertPrice(order?.price)}
                                                </span>

                                                <span
                                                    style={{
                                                        fontSize: "1.4rem",
                                                        color: "#242424",
                                                    }}>
                                                    Số lượng: {order?.amount}
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: "1.6rem",
                                                        color: "var(--popular-color)",
                                                        fontWeight: "600",
                                                    }}>
                                                    Tổng tiền:{" "}
                                                    {convertPrice(
                                                        state?.totalPriceMemo
                                                    )}
                                                </span>
                                            </div>
                                        </WrapperItemOrder>
                                    );
                                })}
                            </WrapperItemOrderInfo>
                        </WrapperContainer>
                    </div>
                </div>
            </Container>
        </Loading>
    );
};

export default OrderSuccess;
