import { Image, Table } from "antd";
import React, { Fragment } from "react";
import {
    WrapperStyleNameProduct,
    WrapperStyleTextSell,
    WrapperPriceTextProduct,
    WrapperAddressProduct,
    WrapperQualityProduct,
    WrapperInputNumber,
} from "./style";
import {
    PlusOutlined,
    MinusOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../LoadingComponent/Loading";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct, resetOrder } from "../../redux/slides/orderSlide";
import { convertPrice } from "../../utils";
import { useEffect } from "react";
import * as message from "../Message/Message";
import { Col, Row } from "react-bootstrap";

const ProductDetailsComponent = ({ idProduct }) => {
    const { Column, ColumnGroup } = Table;
    const [numProduct, setNumProduct] = useState(1);
    const user = useSelector((state) => state.user);
    const order = useSelector((state) => state.order);
    const [errorLimitOrder, setErrorLimitOrder] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const onChange = (value) => {
        setNumProduct(Number(value));
    };

    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1];
        if (id) {
            const res = await ProductService.getDetailsProduct(id);
            return res.data;
        }
    };

    useEffect(() => {
        const orderRedux = order?.orderItems?.find(
            (item) => item.product === productDetails?._id
        );
        if (
            orderRedux?.amount + numProduct <= orderRedux?.countInstock ||
            (!orderRedux && productDetails?.countInStock > 0)
        ) {
            setErrorLimitOrder(false);
        } else if (productDetails?.countInStock === 0) {
            setErrorLimitOrder(true);
        }
    }, [numProduct]);

    useEffect(() => {
        if (order.isSucessOrder) {
            message.success("Đã thêm vào giỏ hàng");
        }
        return () => {
            dispatch(resetOrder());
        };
    }, [order.isSucessOrder]);

    const handleChangeCount = (type, limited) => {
        if (type === "increase") {
            if (!limited) {
                setNumProduct(numProduct + 1);
            }
        } else {
            if (!limited) {
                setNumProduct(numProduct - 1);
            }
        }
    };

    const { isLoading, data: productDetails } = useQuery(
        ["product-details", idProduct],
        fetchGetDetailsProduct,
        { enabled: !!idProduct }
    );

    const handleAddCartProduct = () => {
        if (!user?.id) {
            navigate("/log-in", { state: location?.pathname });
        } else {
            const orderRedux = order?.orderItems?.find(
                (item) => item.product === productDetails?._id
            );
            if (
                orderRedux?.amount + numProduct <= orderRedux?.countInstock ||
                (!orderRedux && productDetails?.countInStock > 0)
            ) {
                dispatch(
                    addOrderProduct({
                        orderItem: {
                            name: productDetails?.name,
                            amount: numProduct,
                            image: productDetails?.image,
                            price: productDetails?.price,
                            product: productDetails?._id,
                            discount: productDetails?.discount,
                            countInstock: productDetails?.countInStock,
                            selled: productDetails?.selled,
                            ingredient: productDetails?.ingredient,
                        },
                    })
                );
            } else {
                setErrorLimitOrder(true);
            }
        }
    };

    const data = [
        {
            key: productDetails?._id,
            firstName: (
                <span
                    style={{
                        fontSize: "1.6rem",
                        fontWeight: "600",
                        color: "#aaa",
                    }}>
                    Nguồn Gốc (Quốc Gia)
                </span>
            ),
            lastName: productDetails?.origin,
        },
        {
            key: productDetails?._id,
            firstName: (
                <span
                    style={{
                        fontSize: "1.6rem",
                        fontWeight: "600",
                        color: "#aaa",
                    }}>
                    Nhà Cung Cấp
                </span>
            ),
            lastName: productDetails?.supplier,
        },
        {
            key: productDetails?._id,
            firstName: (
                <span
                    style={{
                        fontSize: "1.6rem",
                        fontWeight: "600",
                        color: "#aaa",
                    }}>
                    Nhà Phân Phối
                </span>
            ),
            lastName:
                "Công ty TNHH Siêu Thị Sống Khỏe. Địa chỉ: Tầng 8 Toà nhà Thuỷ Lợi 4, 205A Nguyễn Xí, Phường 26, Bình Thạnh, Hồ Chí Minh",
        },
        {
            key: productDetails?._id,
            firstName: (
                <span
                    style={{
                        fontSize: "1.6rem",
                        fontWeight: "600",
                        color: "#aaa",
                    }}>
                    Quy Cách Đóng Gói
                </span>
            ),
            lastName: productDetails?.packaging,
        },
    ];

    return (
        <Loading isLoading={isLoading}>
            <div style={{ marginTop: "20px" }}>
                <section className='product-info'>
                    <Row>
                        <Col lg={5}>
                            <Image
                                src={productDetails?.image}
                                alt='image prodcut'
                                preview={false}
                            />
                        </Col>

                        <Col lg={7}>
                            <div style={{ paddingLeft: "10px" }}>
                                <WrapperStyleNameProduct>
                                    {productDetails?.name}
                                </WrapperStyleNameProduct>
                                <WrapperStyleTextSell>
                                    <ShoppingCartOutlined />
                                    <span style={{ marginLeft: "5px" }}>
                                        Đã Bán {productDetails?.selled || 0}
                                    </span>
                                </WrapperStyleTextSell>
                                <WrapperPriceTextProduct>
                                    {convertPrice(productDetails?.price)}
                                </WrapperPriceTextProduct>
                                {!user?.isAdmin && (
                                    <Fragment>
                                        <WrapperAddressProduct>
                                            <span>
                                                Thêm vào giỏ hàng để được giao
                                                đến địa chỉ
                                            </span>
                                            <span className='address'>
                                                {user?.address}
                                            </span>
                                        </WrapperAddressProduct>
                                        <span>
                                            Thành Phần: <span style={{ color: "var(--btn-blue-color)" }}>{productDetails?.ingredient}</span>
                                        </span>
                                        <WrapperAddressProduct>
                                            <span style={{ marginTop: "20px" }}>
                                                {productDetails?.certification}
                                            </span>
                                        </WrapperAddressProduct>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignContent: "center",
                                                margin: "10px 0 20px",
                                                padding: "10px 0",
                                                borderTop: "1px solid #e5e5e5",
                                                borderBottom:
                                                    "1px solid #e5e5e5",
                                            }}>
                                            <div
                                                style={{
                                                    margin: "0 35px 10px 0",
                                                }}>
                                                Số lượng
                                            </div>
                                            <WrapperQualityProduct>
                                                <button
                                                    style={{
                                                        border: "none",
                                                        background:
                                                            "transparent",
                                                        cursor: "pointer",
                                                        display: "flex",
                                                        margin: "0 auto",
                                                    }}
                                                    onClick={() =>
                                                        handleChangeCount(
                                                            "decrease",
                                                            numProduct === 1
                                                        )
                                                    }>
                                                    <MinusOutlined
                                                        style={{
                                                            color: "#000",
                                                            fontSize: "20px",
                                                        }}
                                                    />
                                                </button>
                                                <WrapperInputNumber
                                                    onChange={onChange}
                                                    defaultValue={1}
                                                    max={
                                                        productDetails?.countInStock
                                                    }
                                                    min={1}
                                                    value={numProduct}
                                                    size='small'
                                                />
                                                <button
                                                    style={{
                                                        border: "none",
                                                        background:
                                                            "transparent",
                                                        cursor: "pointer",
                                                        display: "flex",
                                                        margin: "0 auto",
                                                    }}
                                                    onClick={() =>
                                                        handleChangeCount(
                                                            "increase",
                                                            numProduct ===
                                                                productDetails?.countInStock
                                                        )
                                                    }>
                                                    <PlusOutlined
                                                        style={{
                                                            color: "#000",
                                                            fontSize: "20px",
                                                        }}
                                                    />
                                                </button>
                                            </WrapperQualityProduct>
                                        </div>
                                        {/* Button Add Cart */}
                                        <div
                                            style={{
                                                display: "flex",
                                                aliggItems: "center",
                                                gap: "12px",
                                            }}>
                                            {/* Sold Out */}
                                            {errorLimitOrder ? (
                                                <div>
                                                    <ButtonComponent
                                                        size={40}
                                                        styleButton={{
                                                            background:
                                                                "#ededed",
                                                            height: "48px",
                                                            width: "220px",
                                                            border: "1px solid var(--btn-blue-color)",
                                                            borderRadius: "4px",
                                                            outline:
                                                                "none !important",
                                                        }}
                                                        textbutton={
                                                            "Sản phẩm tạm hết hàng"
                                                        }
                                                        styleTextButton={{
                                                            color: "#aaa",
                                                            fontSize: "15px",
                                                        }}></ButtonComponent>
                                                </div>
                                            ) : (
                                                <ButtonComponent
                                                    size={40}
                                                    styleButton={{
                                                        background:
                                                            "var(--btn-yellow-color)",
                                                        height: "48px",
                                                        width: "220px",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                    }}
                                                    onClick={
                                                        handleAddCartProduct
                                                    }
                                                    textbutton={
                                                        "Thêm vào giỏ hàng"
                                                    }
                                                    styleTextButton={{
                                                        color: "var(--text-color-black)",
                                                        fontSize: "15px",
                                                        fontWeight: "700",
                                                    }}></ButtonComponent>
                                            )}
                                        </div>
                                    </Fragment>
                                )}
                            </div>
                        </Col>
                    </Row>
                </section>

                <section className='post' style={{ marginTop: "80px" }}>
                    <Row>
                        <Col lg={7}>
                            <span style={{ lineHeight: "3rem" }}>
                                {productDetails?.description}
                            </span>
                        </Col>
                        <Col lg={5}>
                            <div>
                                <Table dataSource={data}>
                                    <ColumnGroup
                                        title={
                                            <h3 style={{ fontWeight: "600" }}>
                                                Thông tin sản phẩm
                                            </h3>
                                        }>
                                        <Column
                                            dataIndex='firstName'
                                            key='firstName'
                                        />
                                        <Column
                                            dataIndex='lastName'
                                            key='lastName'
                                        />
                                    </ColumnGroup>
                                </Table>
                            </div>
                        </Col>
                    </Row>
                </section>
            </div>
        </Loading>
    );
};

export default ProductDetailsComponent;
