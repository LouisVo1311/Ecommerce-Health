import { Form } from "antd";
import React, { useEffect, useState } from "react";
import {
    CustomCheckbox,
    WrapperCountOrder,
    WrapperInfo,
    WrapperItemOrder,
    WrapperLeft,
    WrapperListOrder,
    WrapperRight,
    WrapperStyleHeader,
    WrapperStyleHeaderDilivery,
    WrapperTotal,
} from "./style";
import {
    DeleteOutlined,
    MinusOutlined,
    PlusOutlined,
    ShoppingFilled,
} from "@ant-design/icons";

import { WrapperInputNumber } from "../../components/ProductDetailsComponent/style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import {
    decreaseAmount,
    increaseAmount,
    removeAllOrderProduct,
    removeOrderProduct,
    selectedOrder,
} from "../../redux/slides/orderSlide";
import { convertPrice } from "../../utils";
import { useMemo } from "react";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slides/userSlide";
import { Link, useNavigate } from "react-router-dom";
import StepComponent from "../../components/StepConponent/StepComponent";
import { Col, Container, Row } from "react-bootstrap";

const CartPage = () => {
    const order = useSelector((state) => state.order);
    const user = useSelector((state) => state.user);
    const [listChecked, setListChecked] = useState([]);
    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const handleNavigationHome = () => {
        navigate("/");
    };

    const [stateUserDetails, setStateUserDetails] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
    });

    const onChange = (e) => {
        if (listChecked.includes(e.target.value)) {
            const newListChecked = listChecked.filter(
                (item) => item !== e.target.value
            );
            setListChecked(newListChecked);
        } else {
            setListChecked([...listChecked, e.target.value]);
        }
    };

    const handleChangeCount = (type, idProduct, limited) => {
        if (type === "increase") {
            if (!limited) {
                dispatch(increaseAmount({ idProduct }));
            }
        } else {
            if (!limited) {
                dispatch(decreaseAmount({ idProduct }));
            }
        }
    };

    const handleDeleteOrder = (idProduct) => {
        dispatch(removeOrderProduct({ idProduct }));
    };

    const handleOnchangeCheckAll = (e) => {
        if (e.target.checked) {
            const newListChecked = [];
            order?.orderItems?.forEach((item) => {
                newListChecked.push(item?.product);
            });
            setListChecked(newListChecked);
        } else {
            setListChecked([]);
        }
    };

    useEffect(() => {
        dispatch(selectedOrder({ listChecked }));
    }, [listChecked]);

    useEffect(() => {
        form.setFieldsValue(stateUserDetails);
    }, [form, stateUserDetails]);

    useEffect(() => {
        if (isOpenModalUpdateInfo) {
            setStateUserDetails({
                city: user?.city,
                name: user?.name,
                address: user?.address,
                phone: user?.phone,
            });
        }
    }, [isOpenModalUpdateInfo]);

    const handleChangeAddress = () => {
        setIsOpenModalUpdateInfo(true);
    };

    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSlected?.reduce((total, cur) => {
            return total + cur.price * cur.amount;
        }, 0);
        return result;
    }, [order]);

    const priceDiscountMemo = useMemo(() => {
        const result = order?.orderItemsSlected?.reduce((total, cur) => {
            const totalDiscount = cur.discount ? cur.discount : 0;
            return total + (priceMemo * (totalDiscount * cur.amount)) / 100;
        }, 0);
        if (Number(result)) {
            return result;
        }
        return 0;
    }, [order]);

    const diliveryPriceMemo = useMemo(() => {
        if (priceMemo >= 200000) {
            return 10000;
        } else if (
            order?.orderItemsSlected?.length === 0
        ) {
            return 0;
        } else {
            return 20000;
        }
    }, [priceMemo]);

    const totalPriceMemo = useMemo(() => {
        return (
            Number(priceMemo) -
            Number(priceDiscountMemo) +
            Number(diliveryPriceMemo)
        );
    }, [priceMemo, priceDiscountMemo, diliveryPriceMemo]);
    
    const handleAddCard = () => {
        if (!order?.orderItemsSlected?.length) {
            message.error("Vui lòng chọn sản phẩm!");
        } else if (!user?.phone || !user.address || !user.name || !user.city) {
            setIsOpenModalUpdateInfo(true);
        } else {
            navigate("/payment");
        }
    };

    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rests } = data;
        const res = UserService.updateUser(id, { ...rests }, token);
        return res;
    });

    const { isLoading, data } = mutationUpdate;

    const handleCancleUpdate = () => {
        setStateUserDetails({
            name: "",
            email: "",
            phone: "",
            isAdmin: false,
        });
        form.resetFields();
        setIsOpenModalUpdateInfo(false);
    };
    const handleUpdateInforUser = () => {
        const { name, address, city, phone } = stateUserDetails;
        if (name && address && city && phone) {
            mutationUpdate.mutate(
                {
                    id: user?.id,
                    token: user?.access_token,
                    ...stateUserDetails,
                },
                {
                    onSuccess: () => {
                        dispatch(updateUser({ name, address, city, phone }));
                        setIsOpenModalUpdateInfo(false);
                    },
                }
            );
        }
    };

    const handleOnchangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value,
        });
    };
    const itemsDelivery = [
        {
            title: "20.000 VND",
            description: "Dưới 200.000 VND",
        },
        {
            title: "10.000 VND",
            description: "Từ 200.000 VND đến dưới 500.000 VND",
        },
        // {
        //     title: "Free ship",
        //     description: "Trên 500.000 VND",
        // },
    ];

    return (
        <div style={{ margin: "20px" }}>
            <Container>
                <div>
                    <div style={{ display: "flex" }}>
                        <Link to='/'>
                            <h4 style={{ color: "var(--popular-color)" }}>
                                Trang chủ
                            </h4>
                        </Link>
                        <h4 style={{ margin: "0 5px" }}>/</h4>
                        <h4
                            style={{
                                fontWeight: "600",
                            }}>
                            GIỎ HÀNG
                        </h4>
                    </div>

                    {order?.orderItems?.length ? (
                        <div>
                            <Row>
                                <Col lg={8}>
                                    <WrapperLeft>
                                        <WrapperStyleHeaderDilivery>
                                            <StepComponent
                                                items={itemsDelivery}
                                                current={
                                                    diliveryPriceMemo === 10000
                                                        ? 2
                                                        : diliveryPriceMemo ===
                                                          20000
                                                        ? 1
                                                        : order
                                                              .orderItemsSlected
                                                              .length === 0
                                                        ? 0
                                                        : 3
                                                }
                                            />
                                        </WrapperStyleHeaderDilivery>
                                        <WrapperStyleHeader>
                                            <span
                                                style={{
                                                    display: "inline-block",
                                                }}>
                                                <CustomCheckbox
                                                    onChange={
                                                        handleOnchangeCheckAll
                                                    }
                                                    checked={
                                                        listChecked?.length ===
                                                        order?.orderItems
                                                            ?.length
                                                    }></CustomCheckbox>
                                                <span
                                                    style={{
                                                        fontSize: "1.6rem",
                                                        marginLeft: "10px",
                                                    }}>
                                                    Tất cả ({" "}
                                                    {order?.orderItems?.length}{" "}
                                                    sản phẩm )
                                                </span>
                                            </span>
                                            <div
                                                style={{
                                                    flex: 1,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "space-evenly",
                                                }}>
                                                <span
                                                    style={{
                                                        marginLeft: "80px",
                                                        fontSize: "1.6rem",
                                                    }}>
                                                    Đơn giá
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: "1.6rem",
                                                    }}>
                                                    Số lượng
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: "1.6rem",
                                                    }}>
                                                    Thành tiền
                                                </span>
                                            </div>
                                        </WrapperStyleHeader>
                                        <WrapperListOrder>
                                            {order?.orderItems?.map((order) => {
                                                return (
                                                    <WrapperItemOrder
                                                        key={order?.product}>
                                                        <div
                                                            style={{
                                                                width: "280px",
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: 4,
                                                            }}>
                                                            <CustomCheckbox
                                                                onChange={
                                                                    onChange
                                                                }
                                                                value={
                                                                    order?.product
                                                                }
                                                                checked={listChecked.includes(
                                                                    order?.product
                                                                )}></CustomCheckbox>
                                                            <img
                                                                src={
                                                                    order?.image
                                                                }
                                                                style={{
                                                                    width: "60px",
                                                                    height: "60px",
                                                                    objectFit:
                                                                        "cover",
                                                                }}
                                                            />
                                                            <div
                                                                style={{
                                                                    width: 160,
                                                                    overflow:
                                                                        "hidden",
                                                                    textOverflow:
                                                                        "ellipsis",
                                                                    whiteSpace:
                                                                        "nowrap",
                                                                }}>
                                                                {order?.name}
                                                            </div>
                                                        </div>
                                                        <div
                                                            style={{
                                                                flex: 1,
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "space-evenly",
                                                            }}>
                                                            <span>
                                                                <span
                                                                    style={{
                                                                        fontSize:
                                                                            "1.4rem",
                                                                        color: "#242424",
                                                                    }}>
                                                                    {convertPrice(
                                                                        order?.price
                                                                    )}
                                                                </span>
                                                            </span>
                                                            <WrapperCountOrder>
                                                                <button
                                                                    style={{
                                                                        border: "none",
                                                                        background:
                                                                            "transparent",
                                                                        cursor: "pointer",
                                                                    }}
                                                                    onClick={() =>
                                                                        handleChangeCount(
                                                                            "decrease",
                                                                            order?.product,
                                                                            order?.amount ===
                                                                                1
                                                                        )
                                                                    }>
                                                                    <MinusOutlined
                                                                        style={{
                                                                            color: "#000",
                                                                            fontSize:
                                                                                "1.6rem",
                                                                            padding:
                                                                                "5px",
                                                                        }}
                                                                    />
                                                                </button>
                                                                <WrapperInputNumber
                                                                    defaultValue={
                                                                        order?.amount
                                                                    }
                                                                    value={
                                                                        order?.amount
                                                                    }
                                                                    size='small'
                                                                    min={1}
                                                                    max={
                                                                        order?.countInstock
                                                                    }
                                                                />
                                                                <button
                                                                    style={{
                                                                        border: "none",
                                                                        background:
                                                                            "transparent",
                                                                        cursor: "pointer",
                                                                    }}
                                                                    onClick={() =>
                                                                        handleChangeCount(
                                                                            "increase",
                                                                            order?.product,
                                                                            order?.amount ===
                                                                                order.countInstock,
                                                                            order?.amount ===
                                                                                1
                                                                        )
                                                                    }>
                                                                    <PlusOutlined
                                                                        style={{
                                                                            color: "#000",
                                                                            fontSize:
                                                                                "1.6rem",
                                                                            padding:
                                                                                "5px",
                                                                        }}
                                                                    />
                                                                </button>
                                                            </WrapperCountOrder>
                                                            <span
                                                                style={{
                                                                    color: "rgb(255, 66, 78)",
                                                                    fontSize:
                                                                        "1.6rem",
                                                                    fontWeight: 500,
                                                                }}>
                                                                {convertPrice(
                                                                    order?.price *
                                                                        order?.amount
                                                                )}
                                                            </span>
                                                            <DeleteOutlined
                                                                style={{
                                                                    fontSize:
                                                                        "1.6rem",
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() =>
                                                                    handleDeleteOrder(
                                                                        order?.product
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </WrapperItemOrder>
                                                );
                                            })}
                                        </WrapperListOrder>
                                    </WrapperLeft>
                                </Col>
                                <Col lg={4}>
                                    {/* Information Cart */}
                                    <WrapperRight>
                                        <WrapperInfo>
                                            <div>
                                                <span>Địa chỉ: </span>
                                                <span>
                                                    {`${user?.address} ${user?.city}`}{" "}
                                                </span>
                                                <span
                                                    onClick={
                                                        handleChangeAddress
                                                    }
                                                    style={{
                                                        color: "var(--popular-color)",
                                                        cursor: "pointer",
                                                    }}>
                                                    Thay đổi
                                                </span>
                                            </div>
                                        </WrapperInfo>
                                        <WrapperInfo>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "space-between",
                                                }}>
                                                <span>Tạm tính</span>
                                                <span
                                                    style={{
                                                        color: "#000",
                                                        fontSize: "1.6rem",
                                                        fontWeight: "600",
                                                    }}>
                                                    {convertPrice(priceMemo)}
                                                </span>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "space-between",
                                                }}>
                                                <span>Giảm giá</span>
                                                <span
                                                    style={{
                                                        color: "#000",
                                                        fontSize: "1.6rem",
                                                        fontWeight: "600",
                                                    }}>
                                                    {convertPrice(
                                                        priceDiscountMemo
                                                    )}
                                                </span>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "space-between",
                                                }}>
                                                <span>Phí giao hàng</span>
                                                <span
                                                    style={{
                                                        color: "#000",
                                                        fontSize: "1.6rem",
                                                        fontWeight: "600",
                                                    }}>
                                                    {convertPrice(
                                                        diliveryPriceMemo
                                                    )}
                                                </span>
                                            </div>
                                        </WrapperInfo>
                                        <WrapperTotal>
                                            <span>Tổng tiền</span>
                                            <span
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                }}>
                                                <span
                                                    style={{
                                                        color: "rgb(254, 56, 52)",
                                                        fontSize: "24px",
                                                        fontWeight: "600",
                                                        textAlign: "end",
                                                    }}>
                                                    {convertPrice(
                                                        totalPriceMemo
                                                    )}
                                                </span>
                                            </span>
                                        </WrapperTotal>
                                        <ButtonComponent
                                            onClick={() => handleAddCard()}
                                            size={40}
                                            styleButton={{
                                                background: "rgb(255, 57, 69)",
                                                height: "48px",
                                                width: "320px",
                                                border: "none",
                                                borderRadius: "4px",
                                            }}
                                            textbutton={"Tiếp tục thanh toán"}
                                            styleTextButton={{
                                                color: "#fff",
                                                fontSize: "15px",
                                                fontWeight: "700",
                                            }}></ButtonComponent>
                                    </WrapperRight>
                                </Col>
                            </Row>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                            }}>
                            <h1
                                style={{
                                    textAlign: "center",
                                    fontWeight: "600",
                                }}>
                                Không có sản phẩm trong giỏ hàng của bạn
                            </h1>
                            <Row>
                                <Col lg={8}>
                                    <h2
                                        style={{
                                            marginTop: "20px",
                                            color: "#a3a3a3",
                                        }}>
                                        <ShoppingFilled
                                            style={{ marginRight: "5px" }}
                                        />
                                        Giỏ hàng của bạn đang trống!
                                    </h2>
                                </Col>
                                <Col lg={4}>
                                    <WrapperRight>
                                        <div
                                            style={{
                                                width: "100%",
                                                justifyContent: "center",
                                            }}>
                                            <WrapperInfo>
                                                <div>
                                                    <span
                                                        style={{
                                                            fontSize: "1.4rem",
                                                        }}>
                                                        Thêm sản phẩm để sử dụng
                                                        các ưu đãi cá nhân
                                                    </span>
                                                    <ButtonComponent
                                                        onClick={
                                                            handleNavigationHome
                                                        }
                                                        size={40}
                                                        styleButton={{
                                                            height: "48px",
                                                            width: "320px",
                                                            border: "1px solid var(--text-color-black)",
                                                            borderRadius: "4px",
                                                        }}
                                                        textbutton={
                                                            "Tiếp tục mua sắm"
                                                        }
                                                        styleTextButton={{
                                                            color: "var(--text-color-black)",
                                                            fontSize: "1.6rem",
                                                            fontWeight: "600",
                                                        }}></ButtonComponent>
                                                </div>
                                            </WrapperInfo>
                                            <WrapperInfo>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "space-between",
                                                    }}>
                                                    <span>Tạm tính</span>
                                                    <span
                                                        style={{
                                                            color: "#000",
                                                            fontSize: "1.6rem",
                                                            fontWeight: "600",
                                                        }}>
                                                        {convertPrice(
                                                            priceMemo
                                                        )}
                                                    </span>
                                                </div>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "space-between",
                                                    }}>
                                                    <span>Giảm giá</span>
                                                    <span
                                                        style={{
                                                            color: "#000",
                                                            fontSize: "1.6rem",
                                                            fontWeight: "600",
                                                        }}>
                                                        {convertPrice(
                                                            priceDiscountMemo
                                                        )}
                                                    </span>
                                                </div>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "space-between",
                                                    }}>
                                                    <span>Phí giao hàng</span>
                                                    <span
                                                        style={{
                                                            color: "#000",
                                                            fontSize: "1.6rem",
                                                            fontWeight: "600",
                                                        }}>
                                                        {convertPrice(
                                                            diliveryPriceMemo
                                                        )}
                                                    </span>
                                                </div>
                                            </WrapperInfo>
                                            <WrapperTotal>
                                                <span>Tổng tiền</span>
                                                <span
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        textAlign: "end",
                                                    }}>
                                                    <span
                                                        style={{
                                                            color: "rgb(254, 56, 52)",
                                                            fontSize: "24px",
                                                            fontWeight: "600",
                                                        }}>
                                                        {convertPrice(
                                                            totalPriceMemo
                                                        )}
                                                    </span>
                                                    <span
                                                        style={{
                                                            color: "#000",
                                                            fontSize: "1.4rem",
                                                        }}>
                                                        (Đã bao gồm VAT nếu có)
                                                    </span>
                                                </span>
                                            </WrapperTotal>
                                        </div>
                                        <ButtonComponent
                                            size={40}
                                            styleButton={{
                                                background: "#aaa",
                                                height: "48px",
                                                width: "320px",
                                                border: "none",
                                                borderRadius: "4px",
                                            }}
                                            textbutton={"Tiếp tục thanh toán"}
                                            styleTextButton={{
                                                color: "var(--text-color-black)",
                                                fontSize: "1.6rem",
                                                fontWeight: "700",
                                            }}></ButtonComponent>
                                    </WrapperRight>
                                </Col>
                            </Row>
                        </div>
                    )}
                </div>

                {/* Information Customer */}
                <ModalComponent
                    title='Cập nhật thông tin giao hàng'
                    open={isOpenModalUpdateInfo}
                    onCancel={handleCancleUpdate}
                    onOk={handleUpdateInforUser}>
                    <Loading isLoading={isLoading}>
                        <Form
                            name='basic'
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            // onFinish={onUpdateUser}
                            autoComplete='on'
                            form={form}>
                            <Form.Item
                                label='Name'
                                name='name'
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your name!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateUserDetails["name"]}
                                    onChange={handleOnchangeDetails}
                                    name='name'
                                />
                            </Form.Item>
                            <Form.Item
                                label='City'
                                name='city'
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your city!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateUserDetails["city"]}
                                    onChange={handleOnchangeDetails}
                                    name='city'
                                />
                            </Form.Item>
                            <Form.Item
                                label='Phone'
                                name='phone'
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your  phone!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateUserDetails.phone}
                                    onChange={handleOnchangeDetails}
                                    name='phone'
                                />
                            </Form.Item>

                            <Form.Item
                                label='Adress'
                                name='address'
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your  address!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateUserDetails.address}
                                    onChange={handleOnchangeDetails}
                                    name='address'
                                />
                            </Form.Item>
                        </Form>
                    </Loading>
                </ModalComponent>
            </Container>
        </div>
    );
};

export default CartPage;
