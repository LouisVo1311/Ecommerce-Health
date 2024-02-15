import { Badge, Popover } from "antd";
import React, { Fragment } from "react";
import { ShoppingOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { resetUser } from "../../redux/slides/userSlide";
import { useState } from "react";
import Loading from "../LoadingComponent/Loading";
import { useEffect } from "react";
import classNames from "classnames/bind";
import { Container, Image } from "react-bootstrap";
import logoBrand from "../../assets/images/brand.jfif";

// Service
import * as ProductService from "../../services/ProductService";
import { searchProduct } from "../../redux/slides/productSlide";

import ButttonInputSearch from "../ButtonInputSearch/ButttonInputSearch";
import TypeProduct from "../TypeProduct/TypeProduct";
import styles from "./Header.module.scss";

const cx = classNames.bind(styles);

function HeaderComponent({ isHiddenSearch = false, isHiddenCart = false }) {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [typeProducts, setTypeProducts] = useState([]);
    const [userName, setUserName] = useState("");
    const [userAvatar, setUserAvatar] = useState("");
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const order = useSelector((state) => state.order);
    const [loading, setLoading] = useState(false);

    const handleSignUp = () => {
        navigate("/sign-up");
    };

    const handleLogIn = () => {
        navigate("/log-in");
    };

    useEffect(() => {
        const fetchAllTypeProduct = async () => {
            const res = await ProductService.getAllTypeProduct();
            if (res?.status === "OK") {
                setTypeProducts(res?.data);
            }
        };
        fetchAllTypeProduct();
    }, []);

    useEffect(() => {
        setLoading(true);
        setUserName(user?.name);
        setUserAvatar(user?.avatar);
        setLoading(false);
    }, [user?.name, user?.avatar]);

    const handleClickNavigate = (type) => {
        if (type === "profile") {
            navigate("/profile");
        } else if (type === "my-order") {
            navigate("/my-order", {
                state: {
                    id: user?.id,
                    token: user?.access_token,
                },
            });
        } else {
            handleLogout();
        }
        setIsOpenPopup(false);
    };

    const content = (
        <div className={cx("popup")}>
            <span
                className={cx("profile__popup")}
                onClick={() => handleClickNavigate("profile")}>
                Thông tin người dùng
            </span>
            {!user?.isAdmin && (
                <span
                    className={cx("profile__popup")}
                    onClick={() => handleClickNavigate(`my-order`)}>
                    Đơn hàng của tôi
                </span>
            )}
            <span
                className={cx("profile__popup")}
                onClick={() => handleClickNavigate()}>
                Đăng xuất
            </span>
        </div>
    );

    const handleLogout = async () => {
        navigate("/");
        setLoading(true);
        await UserService.logoutUser();
        dispatch(resetUser());
        setLoading(false);
    };

    const onSearch = (e) => {
        setSearch(e.target.value);
        dispatch(searchProduct(e.target.value));
    };

    return (
        <header className={cx("header")}>
            <div className={cx("header-navigation")}>
                <Container>
                    <div className={cx("header-navigation-section")}>
                        <div className={cx("section-navbar")}>
                            <Link
                                to='/'
                                className={cx("header-navigation-logo")}>
                                <Image
                                    src={logoBrand}
                                    alt='PhotoLogo'
                                    className={cx("logo")}
                                />
                            </Link>
                        </div>
                        <div className={cx("section-cart-profile")}>
                            {!isHiddenCart && !user?.isAdmin ? (
                                <Link
                                    to='/cart'
                                    className={cx("header-navigation-cart")}>
                                    <Badge
                                        count={order?.orderItems?.length}
                                        size='small'>
                                        <ShoppingOutlined
                                            className={cx("cart__icon")}
                                        />
                                    </Badge>
                                </Link>
                            ) : (
                                <></>
                            )}
                            <Loading isLoading={loading}>
                                <div
                                    className={cx("header-navigation-profile")}>
                                    {userAvatar && (
                                        <Image
                                            src={userAvatar}
                                            alt='Avatar'
                                            className={cx("profile__image")}
                                        />
                                    )}
                                    {user?.access_token ? (
                                        <>
                                            <Popover
                                                content={content}
                                                trigger='click'
                                                placement='bottomRight'
                                                open={isOpenPopup}>
                                                <div
                                                    className={cx(
                                                        "profile__name"
                                                    )}
                                                    onClick={() =>
                                                        setIsOpenPopup(
                                                            (prev) => !prev
                                                        )
                                                    }>
                                                    {userName?.length &&
                                                        userName}
                                                </div>
                                            </Popover>
                                        </>
                                    ) : (
                                        <div>
                                            <span
                                                onClick={handleLogIn}
                                                className={cx(
                                                    "profile__label"
                                                )}>
                                                Đăng nhập
                                            </span>
                                            <span
                                                className={cx("profile__label")}
                                                style={{ margin: "0 5px" }}>
                                                |
                                            </span>
                                            <span
                                                onClick={handleSignUp}
                                                className={cx(
                                                    "profile__label"
                                                )}>
                                                Đăng ký
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Loading>
                        </div>
                    </div>
                </Container>
            </div>
            {!isHiddenSearch && (
                <div className={cx("header-typeproduct")}>
                    <Container>
                        <div className={cx("header-typeproduct-section")}>
                            <div className={cx("typeproduct__label")}>
                                {typeProducts.map((item) => {
                                    return (
                                        <TypeProduct name={item} key={item} />
                                    );
                                })}
                            </div>
                            <ButttonInputSearch
                                size='medium'
                                bordered={true}
                                placeholder='Tìm kiếm sản phẩm...'
                                onChange={onSearch}
                                backgroundcolorbutton='#fcc000'
                            />
                        </div>
                    </Container>
                </div>
            )}
        </header>
    );
}

export default HeaderComponent;
