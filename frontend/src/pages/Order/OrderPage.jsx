import React, { Fragment, useEffect } from "react";
import Loading from "../../components/LoadingComponent/Loading";
import { useQuery } from "@tanstack/react-query";
import * as OrderService from "../../services/OrderService";
import { useSelector } from "react-redux";
import { convertPrice } from "../../utils";
import {
    WrapperItemOrder,
    WrapperListOrder,
    WrapperHeaderItem,
    WrapperFooterItem,
    WrapperStatus,
} from "./style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../../components/Message/Message";
import { Container } from "react-bootstrap";

const OrderPage = () => {
    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate();

    const fetchMyOrder = async () => {
        const res = await OrderService.getOrderByUserId(
            state?.id,
            state?.token
        );
        return res.data;
    };
    const user = useSelector((state) => state.user);

    const queryOrder = useQuery(
        { queryKey: ["orders"], queryFn: fetchMyOrder },
        {
            enabled: state?.id && state?.token,
        }
    );
    const { isLoading, data } = queryOrder;

    const handleDetailsOrder = (id) => {
        navigate(`/details-order/${id}`, {
            state: {
                token: state?.token,
            },
        });
    };

    const mutation = useMutationHooks((data) => {
        const { id, token, orderItems, userId } = data;
        const res = OrderService.cancelOrder(id, token, orderItems, userId);
        return res;
    });

    const handleCanceOrder = (order) => {
        mutation.mutate(
            {
                id: order._id,
                token: state?.token,
                orderItems: order?.orderItems,
                userId: user.id,
            },
            {
                onSuccess: () => {
                    queryOrder.refetch();
                },
            }
        );
    };
    const {
        isLoading: isLoadingCancel,
        isSuccess: isSuccessCancel,
        isError: isErrorCancle,
        data: dataCancel,
    } = mutation;

    useEffect(() => {
        if (isSuccessCancel && dataCancel?.status === "OK") {
            message.success();
        } else if (isSuccessCancel && dataCancel?.status === "ERR") {
            message.error(dataCancel?.message);
        } else if (isErrorCancle) {
            message.error();
        }
    }, [isErrorCancle, isSuccessCancel]);

    const renderProduct = (data) => {
        return data?.map((order) => {
            return (
                <WrapperHeaderItem key={order?._id}>
                    <img
                        src={order?.image}
                        style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                            border: "1px solid rgb(238, 238, 238)",
                            padding: "2px",
                        }}
                    />
                    <div
                        style={{
                            width: 260,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            marginLeft: "10px",
                        }}>
                        {order?.name}
                    </div>
                    <span
                        style={{
                            fontSize: "13px",
                            color: "#242424",
                            marginLeft: "auto",
                        }}>
                        Tạm Tính: {convertPrice(order?.price)}
                    </span>
                </WrapperHeaderItem>
            );
        });
    };

    const getStatusColor = (isDelivered) => {
        switch (isDelivered) {
            case "Chưa Xác Nhận":
                return "var(--text-color-black)";
            case "Đã Xác Nhận":
                return "var(--popular-color)";
            case "Đang Giao Hàng":
                return "orange";
            case "Đã Giao Hàng":
                return "green"; 
            default:
                return "var(--text-color-black)";
        }
    };

    const getStatusText = (isDelivered) => {
        switch (isDelivered) {
            case "Chưa Xác Nhận":
                return "Chưa Xác Nhận";
            case "Đã Xác Nhận":
                return "Đã Xác Nhận";
            case "Đang Giao Hàng":
                return "Đang Giao Hàng";
            case "Đã Giao Hàng":
                return "Đã Giao Hàng";
            default:
                return "Chưa Xác Nhận";
        }
    };

    return (
        <Loading isLoading={isLoading || isLoadingCancel}>
            <Container>
                <div
                    style={{
                        height: "100%",
                        margin: "0 auto",
                    }}>
                    <h2>LỊCH SỬ ĐẶT HÀNG</h2>

                    <WrapperListOrder>
                        {data?.map((order) => {
                            return (
                                <WrapperItemOrder key={order?._id}>
                                    <WrapperStatus>
                                        <span
                                            style={{
                                                fontSize: "14px",
                                                fontWeight: "bold",
                                            }}>
                                            Trạng Thái Đơn Hàng
                                        </span>
                                        <div style={{ marginTop: "20px" }}>
                                            <span
                                                style={{
                                                    color: "var(--text-color-black)",
                                                }}>
                                                Tình Trạng Đơn Hàng:{" "}
                                            </span>
                                            <span
                                                style={{
                                                    color: getStatusColor(
                                                        order.isDelivered
                                                    ),
                                                    fontWeight: "600",
                                                    marginLeft: "5px",
                                                }}>
                                                {getStatusText(
                                                    order.isDelivered
                                                )}
                                            </span>
                                        </div>
                                        <div>
                                            <span
                                                style={{
                                                    color: "var(--text-color-black)",
                                                }}>
                                                Thanh Toán:
                                            </span>
                                            <span
                                                style={{
                                                    color: "var(--popular-color)",
                                                    fontWeight: "600",
                                                }}>{`${
                                                order.isPaid
                                                    ? "Đã Thanh Toán"
                                                    : "Chưa Thanh Toán"
                                            }`}</span>
                                        </div>
                                    </WrapperStatus>
                                    {renderProduct(order?.orderItems)}
                                    <WrapperFooterItem>
                                        <div>
                                            <span
                                                style={{
                                                    color: "rgb(255, 66, 78)",
                                                    fontWeight: 700,
                                                }}>
                                                Tổng tiền:
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: "1.6rem",
                                                    color: "rgb(56, 56, 61)",
                                                    fontWeight: 700,
                                                }}>
                                                {convertPrice(
                                                    order?.totalPrice
                                                )}
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "10px",
                                            }}>
                                            {getStatusText(order?.isDelivered) === "Chưa Xác Nhận" ? (
                                                <Fragment>
                                                    <ButtonComponent
                                                        onClick={() =>
                                                            handleCanceOrder(
                                                                order
                                                            )
                                                        }
                                                        size={40}
                                                        styleButton={{
                                                            height: "36px",
                                                            border: "1px solid #9255FD",
                                                            borderRadius: "4px",
                                                        }}
                                                        textbutton={
                                                            "Hủy Đơn Hàng"
                                                        }
                                                        styleTextButton={{
                                                            color: "#9255FD",
                                                            fontSize: "14px",
                                                        }}
                                                    />
                                                    <ButtonComponent
                                                        onClick={() =>
                                                            handleDetailsOrder(
                                                                order?._id
                                                            )
                                                        }
                                                        size={40}
                                                        styleButton={{
                                                            height: "36px",
                                                            border: "1px solid #9255FD",
                                                            borderRadius: "4px",
                                                        }}
                                                        textbutton={
                                                            "Xem chi tiết"
                                                        }
                                                        styleTextButton={{
                                                            color: "#9255FD",
                                                            fontSize: "14px",
                                                        }}></ButtonComponent>
                                                </Fragment>
                                            ) : (
                                                <ButtonComponent
                                                    onClick={() =>
                                                        handleDetailsOrder(
                                                            order?._id
                                                        )
                                                    }
                                                    size={40}
                                                    styleButton={{
                                                        height: "36px",
                                                        border: "1px solid #9255FD",
                                                        borderRadius: "4px",
                                                    }}
                                                    textbutton={"Xem chi tiết"}
                                                    styleTextButton={{
                                                        color: "#9255FD",
                                                        fontSize: "14px",
                                                    }}></ButtonComponent>
                                            )}
                                        </div>
                                    </WrapperFooterItem>
                                </WrapperItemOrder>
                            );
                        })}
                    </WrapperListOrder>
                </div>
            </Container>
        </Loading>
    );
};

export default OrderPage;
