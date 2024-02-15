import { Button, Menu, Popover } from "antd";
import React, { Fragment, useState, useMemo, useEffect } from "react";
import classNames from "classnames/bind";
import { getItem } from "../../utils";
import {
    UserOutlined,
    AppstoreOutlined,
    ShoppingCartOutlined,
    MenuOutlined,
    CustomerServiceOutlined,
    RedditOutlined,
    LineChartOutlined,
    DashboardOutlined
} from "@ant-design/icons";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminCreateProduct from "../../components/AdminCreateProduct/AdminCreateProduct";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import AdminSupplier from "../../components/AdminSupplier/AdminSupplier";
import AdminOrder from "../../components/AdminOrder/AdminOrder";
import AdminChat from "../../components/AdminChat";
import AdminStatistic from "../../components/AdminStatistic/AdminStatistic";

import * as OrderService from "../../services/OrderService";
import * as ProductService from "../../services/ProductService";
import * as UserService from "../../services/UserService";

import { useSelector, useDispatch } from "react-redux";
import { useQueries } from "@tanstack/react-query";
import Loading from "../../components/LoadingComponent/Loading";
import CustomizedContent from "./CustomizedContent";
import styles from "./AdminPage.module.scss";
import { Container, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { resetUser } from "../../redux/slides/userSlide";

const cx = classNames.bind(styles);

function AdminPage() {
    const [userName, setUserName] = useState("");
    const [userAvatar, setUserAvatar] = useState("");
    const [collapsed, setCollapsed] = useState(false);
    const [theme, setTheme] = useState("dark");
    const user = useSelector((state) => state?.user);
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    // Set Theme
    const changeTheme = (value) => {
        setTheme(value ? "dark" : "light");
    };

    // Logo Sidebar
    const logoAdmin = [
        getItem("ADMIN", null, <RedditOutlined style={{ fontSize: "4rem" }} />),
    ];

    // Avatar Sidebar
    const content = (
        <div className={cx("popup")}>
            {user?.isAdmin && (
                <Fragment>
                    <span
                        className={cx("profile__popup")}
                        onClick={() => handleClickNavigate()}>
                        Đăng xuất
                    </span>
                </Fragment>
            )}
        </div>
    );
    useEffect(() => {
        setLoading(true);
        setUserName(user?.name);
        setUserAvatar(user?.avatar);
        setLoading(false);
    }, [user?.name, user?.avatar]);
    const handleClickNavigate = (type) => {
        if (type === "profile") {
            navigate("/profile");
        } else {
            handleLogout();
        }
        setIsOpenPopup(false);
    };
    const handleLogout = async () => {
        setLoading(true);
        await UserService.logoutUser();
        dispatch(resetUser());
        setLoading(false);
        navigate("/log-in/admin");
    };
    const accountAdmin = [
        getItem(
            null,
            null,
            <div>
                <div className={cx("profile")}>
                    {userAvatar && (
                        <Image
                            src={userAvatar}
                            alt='Avatar'
                            className={cx("profile__image")}
                        />
                    )}
                    <Popover
                        placement='right'
                        content={content}
                        trigger='click'
                        open={isOpenPopup}>
                        <div
                            className={cx("profile__name")}
                            onClick={() => setIsOpenPopup((prev) => !prev)}>
                            {userName?.length && userName}
                        </div>
                    </Popover>
                </div>
            </div>
        ),
    ];

    // Items Sidebar
    const items = [
        getItem("TÀI KHOẢN", "users", <UserOutlined />),
        getItem("SẢN PHẨM", null, <AppstoreOutlined />, [
            getItem("Thêm sản phẩm", "create products", null),
            getItem("Danh mục sản phẩm", "products", null),
        ]),
        getItem("NHÀ CUNG CẤP", null, <AppstoreOutlined />, [
            getItem("Danh mục nhà cung cấp", "suppliers", null),
        ]),
        getItem("ĐƠN ĐẶT HÀNG", "orders", <ShoppingCartOutlined />),
        getItem("DỊCH VỤ", null, <CustomerServiceOutlined />, [
            getItem("Kênh tư vấn", "services chat", null),
        ]),
        getItem("THỐNG KÊ", "statistic", <LineChartOutlined />),
    ];

    const [keySelected, setKeySelected] = useState("");

    const getAllUsers = async () => {
        const res = await UserService.getAllUser(user?.access_token);
        console.log("users", res);
        return { data: res?.data, key: "users" };
    };

    const getAllProducts = async () => {
        const res = await ProductService.getAllProduct();
        console.log("products", res);
        return { data: res?.data, key: "products" };
    };

    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder(user?.access_token);
        console.log("orders", res);
        return { data: res?.data, key: "orders" };
    };

    // 1000
    const queries = useQueries({
        queries: [
            {
                queryKey: ["users"],
                queryFn: getAllUsers,
                staleTime: 60,
            },
            {
                queryKey: ["products"],
                queryFn: getAllProducts,
                staleTime: 60,
            },
            {
                queryKey: ["orders"],
                queryFn: getAllOrder,
                staleTime: 60,
            },
        ],
    });

    const memoCount = useMemo(() => {
        const result = {};
        try {
            if (queries) {
                queries.forEach((query) => {
                    result[query?.data?.key] = query?.data?.data?.length;
                });
            }
            return result;
        } catch (error) {
            return result;
        }
    }, [queries]);

    const COLORS = {
        orders: ["#dc3545", "#dc3545"],
        products: ["#28a745", "#28a745"],
        users: ["#17a2b8", "#17a2b8"],
    };

    const renderPage = (key) => {
        switch (key) {
            case "users":
                return <AdminUser />;
            case "create products":
                return <AdminCreateProduct />;
            case "products":
                return <AdminProduct />;
            case "suppliers":
                return <AdminSupplier />;
            case "orders":
                return <AdminOrder />;
            case "services chat":
                return <AdminChat />;
            case "statistic":
                return <AdminStatistic />;
            default:
                return <></>;
        }
    };

    const handleOnCLick = ({ key }) => {
        setKeySelected(key);
    };
    console.log("memoCount", memoCount);

    return (
        <div
            style={{
                overflow: "hidden",
                scrollbarWidth: "none",
                width: "100%",
            }}>
            {/* Content */}
            <Loading
                isLoading={
                    memoCount &&
                    Object.keys(memoCount) &&
                    Object.keys(memoCount).length !== 3
                }>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        overflow: "hidden",
                        minHeight: "200vh",
                    }}>
                    {/* Sidebar */}
                    <section className={cx("sidebar")}>
                        <Menu
                            inlineCollapsed={collapsed}
                            items={logoAdmin}
                            className={cx("logo-admin")}
                            style={{ borderBottom: "1px solid #dbdbdb" }}
                            theme={theme}
                            onClick={toggleCollapsed}
                        />
                        <Menu
                            style={{ borderBottom: "1px solid #dbdbdb" }}
                            inlineCollapsed={collapsed}
                            items={accountAdmin}
                            theme={theme}
                            onClick={toggleCollapsed}
                        />
                        <Menu
                            mode='inline'
                            theme={theme}
                            style={{
                                boxShadow: "1px 1px 2px #ccc",
                                minHeight: "100%",
                            }}
                            items={items}
                            inlineCollapsed={collapsed}
                            onClick={handleOnCLick}
                        />
                    </section>

                    {!keySelected && (
                        <div className={cx("container-admin")}>
                            <header className={cx("header-admin")}>
                                <Container>
                                    <Button
                                        style={{ border: "none" }}
                                        onClick={toggleCollapsed}>
                                        {collapsed ? (
                                            <MenuOutlined
                                                className={cx(
                                                    "header-menu__icon"
                                                )}
                                            />
                                        ) : (
                                            <MenuOutlined
                                                className={cx(
                                                    "header-menu__icon"
                                                )}
                                            />
                                        )}
                                    </Button>
                                </Container>
                            </header>
                            <body className={cx("body-admin")}>
                                <h1 style={{ fontWeight: "600", marginBottom: "20px" }}>Xin chào {user?.name} 👋</h1>
                                <h3 style={{ marginBottom: "40px" }}>Bạn có thể xem danh mục các sản phẩm, nhà cung cấp và quản lý đơn đặt hàng ở đây!</h3>
                                <div style={{ display: "flex", alignItems: "center"}}>
                                    <DashboardOutlined style={{ fontSize: "4rem"}}/>
                                    <h1 style={{ fontWeight: "600", marginLeft: "10px" }}>Dashboard</h1>
                                </div>
                                <CustomizedContent
                                    data={memoCount}
                                    colors={COLORS}
                                    setKeySelected={setKeySelected}
                                />
                            </body>
                        </div>
                    )}

                    {/* Content-Admin */}
                    {renderPage(keySelected)}
                </div>
            </Loading>
        </div>
    );
}

export default AdminPage;
