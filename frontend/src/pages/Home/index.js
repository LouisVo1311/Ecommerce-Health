// Framework
import React, { Fragment } from "react";
import classNames from "classnames/bind";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { Col, Container, Image, Row } from "react-bootstrap";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

// Service
import * as ProductService from "../../services/ProductService";

// Component
import Loading from "../../components/LoadingComponent/Loading";
import CardComponent from "../../components/CardComponent/CardComponent";
import CardPromoComponent from "../../components/CardPromoComponent/CardPromoComponent ";
import slider1 from "../../assets/images/slickslider1.jpg";
import slider2 from "../../assets/images/slickslider2.jpg";
import slider3 from "../../assets/images/slickslider3.jpg";
import styles from "./HomePage.module.scss";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import SupportEngine from "./component/SupportEngine";

const cx = classNames.bind(styles);

function HomePage() {
    const imgBanner = [slider1, slider2, slider3];
    const searchCardProduct = useSelector((state) => state?.product?.search);
    const searchDebounce = useDebounce(searchCardProduct, 500);
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.user);
    const [limit, setLimit] = useState(6);
    
    const isProductExpired = (exp) => {
        const today = new Date();
        const expirationDate = new Date(exp);
        return expirationDate < today;
    };
    const fetchProductAll = async (context) => {
        const limit = context?.queryKey && context?.queryKey[1];
        const search = context?.queryKey && context?.queryKey[2];
        const res = await ProductService.getAllProduct(search, limit);
        const nonExpiredProducts = res.data.filter(
            (product) => !isProductExpired(product.exp)
        );
        return { ...res, data: nonExpiredProducts };
    };

    const {
        isLoading,
        data: products,
        isPreviousData,
    } = useQuery(["products", limit, searchDebounce], fetchProductAll, {
        retry: 3,
        retryDelay: 1000,
        keepPreviousData: true,
    });

    return (
        <Loading isLoading={isLoading || loading}>
            <div className={cx("content")}>
                {/* Slider */}
                <section className={cx("slider")}>
                    <Container fluid='lg'>
                        <Row>
                            <Col lg={9}>
                                <SliderComponent
                                    arrImages={[slider1, slider2, slider3]}
                                    className={cx("slider__img")}
                                />
                            </Col>
                            <Col lg={3}>
                                {imgBanner.map((image) => {
                                    return (
                                        <Image
                                            className={cx("banner__img")}
                                            key={image}
                                            src={image}
                                        />
                                    );
                                })}
                            </Col>
                        </Row>
                    </Container>
                </section>

                {/* Discount */}
                {user.access_token && (
                    <Fragment>
                        <div className={cx("partials")}>
                            <Image src='https://sieuthisongkhoe.com/wp-content/themes/stsk2020/static/images/ic-dicount.svg' />
                            <h2
                                style={{
                                    margin: "0 10px",
                                    color: "var(--btn-yellow-color)",
                                    fontWeight: "600",
                                }}>
                                SẢN PHẨM KHUYẾN MÃI
                            </h2>
                            <Image src='https://sieuthisongkhoe.com/wp-content/themes/stsk2020/static/images/ic-dicount.svg' />
                        </div>
                        <section className={cx("product-discount")}>
                            <Container>
                                <Row>
                                    {products?.data
                                        .filter(
                                            (product) => product.discount > 0
                                        )
                                        .map((product) => {
                                            return (
                                                <Col lg={3} key={product._id}>
                                                    <CardPromoComponent
                                                        image={product.image}
                                                        name={product.name}
                                                        price={product.price}
                                                        selled={product.selled}
                                                        id={product._id}
                                                        discount={
                                                            product.discount
                                                        }
                                                    />
                                                </Col>
                                            );
                                        })}
                                </Row>
                            </Container>
                        </section>
                    </Fragment>
                )}

                {/* Product Special */}
                <div className={cx("partials")}>
                    <h2
                        style={{
                            margin: "0 10px",
                            color: "var(--textcolor-black)",
                            fontWeight: "600",
                        }}>
                        SẢN PHẨM NỔI BẬT
                    </h2>
                </div>
                <section>
                    <Container>
                        <Row>
                            {products?.data
                                .filter((product) => product.discount === 0)
                                .map((product) => {
                                    return (
                                        <Col lg={3}>
                                            <CardComponent
                                                key={product._id}
                                                image={product.image}
                                                name={product.name}
                                                price={product.price}
                                                selled={product.selled}
                                                id={product._id}
                                            />
                                        </Col>
                                    );
                                })}
                        </Row>
                    </Container>
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "10px",
                        }}>
                        <ButtonComponent
                            textbutton={
                                isPreviousData ? "Load more" : "Xem thêm"
                            }
                            type='outline'
                            styleButton={{
                                border: `1px solid ${
                                    products?.total === products?.data?.length
                                        ? "#f5f5f5"
                                        : "#9255FD"
                                }`,
                                color: `${
                                    products?.total === products?.data?.length
                                        ? "#f5f5f5"
                                        : "#9255FD"
                                }`,
                                width: "240px",
                                height: "38px",
                                borderRadius: "4px",
                            }}
                            disabled={
                                products?.total === products?.data?.length ||
                                products?.totalPage === 1
                            }
                            styleTextButton={{
                                fontWeight: 500,
                                color:
                                    products?.total ===
                                        products?.data?.length && "#fff",
                            }}
                            onClick={() => setLimit((prev) => prev + 6)}
                        />
                    </div>
                </section>

                {/* Banner */}
                <section
                    style={{
                        margin: "40px 0 60px",
                        padding: "40px",
                        backgroundImage:
                            "url(https://static-sieuthisongkhoe.cdn.vccloud.vn/wp-content/themes/stsk2020/static/images/bg-blue.jpg)",
                    }}
                    className='elementor-section elementor-top-section elementor-element elementor-element-34ada7b5 section-cam-ket bg-cam-ket elementor-section-boxed elementor-section-height-default elementor-section-height-default'
                    data-id='34ada7b5'
                    data-element_type='section'
                    data-settings='{"background_background":"classic"}'>
                    <div className='elementor-container elementor-column-gap-default'>
                        <div
                            className='elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-45dab226'
                            data-id='45dab226'
                            data-element_type='column'>
                            <div className='elementor-widget-wrap elementor-element-populated'>
                                <div
                                    className='elementor-element elementor-element-63573509 text-center text-uppercase none elementor-widget elementor-widget-heading'
                                    data-id='63573509'
                                    data-element_type='widget'
                                    data-widget_type='heading.default'>
                                    <div className='elementor-widget-container'>
                                        <h2
                                            className='elementor-heading-title elementor-size-default'
                                            style={{
                                                color: "var(--text-color-white)",
                                                fontWeight: "600",
                                                padding: "20px 0 40px 0",
                                                borderBottom:
                                                    "1px solid var(--text-color-white)",
                                            }}>
                                            Quyền lợi của khách hàng
                                        </h2>{" "}
                                    </div>
                                </div>
                                <div
                                    className='elementor-element elementor-element-5c1f3c7e none elementor-widget-divider--view-line elementor-widget elementor-widget-divider'
                                    data-id='5c1f3c7e'
                                    data-element_type='widget'
                                    data-widget_type='divider.default'>
                                    <div className='elementor-widget-container'>
                                        <div className='elementor-divider'>
                                            <span className='elementor-divider-separator'></span>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className='elementor-element elementor-element-2dfe25de none elementor-widget elementor-widget-featured_items'
                                    data-id='2dfe25de'
                                    data-element_type='widget'
                                    data-widget_type='featured_items.default'>
                                    <div className='elementor-widget-container'>
                                        <div className='feature-items'>
                                            <div className='container'>
                                                <div className='row'>
                                                    <div className='col-lg-6 mb24px'>
                                                        <div
                                                            className='d-flex'
                                                            style={{
                                                                margin: "40px 0",
                                                                alignItems:
                                                                    "center",
                                                            }}>
                                                            <div
                                                                style={{
                                                                    padding:
                                                                        "20px",
                                                                    borderRadius:
                                                                        "50%",
                                                                }}
                                                                className='icon mr-2 icon-1 flex-shrink-0 bg-white d-sm-block d-none f-icon-1'>
                                                                <img
                                                                    decoding='async'
                                                                    src='https://static-sieuthisongkhoe.cdn.vccloud.vn/wp-content/uploads/2020/07/029-homecare-1.png'
                                                                    alt='Giao hàng tận nhà'
                                                                />
                                                            </div>
                                                            <span className='d-sm-none d-flex btn btn-mini flex-shrink-0 mt-1 mr-2'>
                                                                1
                                                            </span>
                                                            <div
                                                                className='d-block'
                                                                style={{
                                                                    marginLeft:
                                                                        "20px",
                                                                }}>
                                                                <h2
                                                                    className='h2-title d-inline d-sm-block'
                                                                    style={{
                                                                        color: "var(--text-color-white)",
                                                                        fontWeight:
                                                                            "600",
                                                                    }}>
                                                                    Giao hàng
                                                                    tận nhà{" "}
                                                                </h2>
                                                                <span className='d-inline d-sm-none'>
                                                                    {" "}
                                                                    -{" "}
                                                                </span>
                                                                <p
                                                                    className='body-text d-inline d-sm-block'
                                                                    style={{
                                                                        color: "var(--text-color-white)",
                                                                    }}>
                                                                    Hỗ trợ giao
                                                                    hàng tận
                                                                    nhà, hướng
                                                                    dẫn sử dụng
                                                                    trực tiếp.{" "}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-6 mb24px'>
                                                        <div
                                                            className='d-flex'
                                                            style={{
                                                                margin: "40px 0",
                                                                alignItems:
                                                                    "center",
                                                            }}>
                                                            <div
                                                                style={{
                                                                    padding:
                                                                        "20px",
                                                                    borderRadius:
                                                                        "50%",
                                                                }}
                                                                className='icon mr-2 icon-1 flex-shrink-0 bg-white d-sm-block d-none f-icon-2'>
                                                                <img
                                                                    decoding='async'
                                                                    src='https://static-sieuthisongkhoe.cdn.vccloud.vn/wp-content/uploads/2020/07/009-gifts-1.png'
                                                                    alt='Tích điểm'
                                                                />
                                                            </div>
                                                            <span className='d-sm-none d-flex btn btn-mini flex-shrink-0 mt-1 mr-2'>
                                                                2
                                                            </span>
                                                            <div
                                                                className='d-block'
                                                                style={{
                                                                    marginLeft:
                                                                        "20px",
                                                                }}>
                                                                <h2
                                                                    className='h2-title d-inline d-sm-block'
                                                                    style={{
                                                                        color: "var(--text-color-white)",
                                                                        fontWeight:
                                                                            "600",
                                                                    }}>
                                                                    Giảm giá,
                                                                    khuyến mãi{" "}
                                                                </h2>
                                                                <span className='d-inline d-sm-none'>
                                                                    {" "}
                                                                    -{" "}
                                                                </span>
                                                                <p
                                                                    className='body-text d-inline d-sm-block'
                                                                    style={{
                                                                        color: "var(--text-color-white)",
                                                                    }}>
                                                                    Nhiều Ưu đãi
                                                                    Giảm giá,
                                                                    khuyến mãi
                                                                    khi mua
                                                                    nhiều sản
                                                                    phẩm{" "}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-6 mb24px'>
                                                        <div
                                                            className='d-flex'
                                                            style={{
                                                                margin: "40px 0",
                                                                alignItems:
                                                                    "center",
                                                            }}>
                                                            <div
                                                                style={{
                                                                    padding:
                                                                        "20px",
                                                                    borderRadius:
                                                                        "50%",
                                                                }}
                                                                className='icon mr-2 icon-1 flex-shrink-0 bg-white d-sm-block d-none f-icon-3'>
                                                                <img
                                                                    decoding='async'
                                                                    src='https://static-sieuthisongkhoe.cdn.vccloud.vn/wp-content/uploads/2020/07/001-24-hours-support-1.png'
                                                                    alt='Tổng đài miễn cước'
                                                                />
                                                            </div>
                                                            <span className='d-sm-none d-flex btn btn-mini flex-shrink-0 mt-1 mr-2'>
                                                                3
                                                            </span>
                                                            <div
                                                                className='d-block'
                                                                style={{
                                                                    marginLeft:
                                                                        "20px",
                                                                }}>
                                                                <h2
                                                                    className='h2-title d-inline d-sm-block'
                                                                    style={{
                                                                        color: "var(--text-color-white)",
                                                                        fontWeight:
                                                                            "600",
                                                                    }}>
                                                                    Tổng đài
                                                                    miễn cước{" "}
                                                                </h2>
                                                                <span className='d-inline d-sm-none'>
                                                                    {" "}
                                                                    -{" "}
                                                                </span>
                                                                <p
                                                                    className='body-text d-inline d-sm-block'
                                                                    style={{
                                                                        color: "var(--text-color-white)",
                                                                    }}>
                                                                    Đồng hành
                                                                    mọi lúc bạn
                                                                    cần qua tổng
                                                                    đài miễn
                                                                    cước. Có
                                                                    chăm sóc
                                                                    viên hỗ trợ
                                                                    riêng qua
                                                                    Zalo.{" "}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-6 mb24px'>
                                                        <div
                                                            className='d-flex'
                                                            style={{
                                                                margin: "40px 0",
                                                                alignItems:
                                                                    "center",
                                                            }}>
                                                            <div
                                                                style={{
                                                                    padding:
                                                                        "20px",
                                                                    borderRadius:
                                                                        "50%",
                                                                }}
                                                                className='icon mr-2 icon-1 flex-shrink-0 bg-white d-sm-block d-none f-icon-4'>
                                                                <img
                                                                    decoding='async'
                                                                    src='https://static-sieuthisongkhoe.cdn.vccloud.vn/wp-content/uploads/2020/07/001-24-hours-support-1.png'
                                                                    alt='Tận tình trong hỗ trợ tư vấn'
                                                                />
                                                            </div>
                                                            <span className='d-sm-none d-flex btn btn-mini flex-shrink-0 mt-1 mr-2'>
                                                                4
                                                            </span>
                                                            <div
                                                                className='d-block'
                                                                style={{
                                                                    marginLeft:
                                                                        "20px",
                                                                }}>
                                                                <h2
                                                                    className='h2-title d-inline d-sm-block'
                                                                    style={{
                                                                        color: "var(--text-color-white)",
                                                                        fontWeight:
                                                                            "600",
                                                                    }}>
                                                                    Tận tình
                                                                    trong hỗ trợ
                                                                    tư vấn{" "}
                                                                </h2>
                                                                <span className='d-inline d-sm-none'>
                                                                    {" "}
                                                                    -{" "}
                                                                </span>
                                                                <p
                                                                    className='body-text d-inline d-sm-block'
                                                                    style={{
                                                                        color: "var(--text-color-white)",
                                                                    }}>
                                                                    Dịch vụ chăm
                                                                    sóc khách
                                                                    hàng tận
                                                                    tình
                                                                    trước-trong-sau
                                                                    khi mua
                                                                    hàng, xuyên
                                                                    suốt 7
                                                                    ngày/tuần,
                                                                    từ 8:00 đến
                                                                    21:00.{" "}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>{" "}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Product Type "Mắt" */}
                {products?.data
                    .filter((product) => product.type === "Mắt")
                    .map((product) => {
                        return (
                            <Fragment>
                                <div
                                    className={cx("partials")}
                                    style={{ marginTop: "60px" }}>
                                    <h2
                                        style={{
                                            margin: "0 10px",
                                            color: "var(--textcolor-black)",
                                            fontWeight: "600",
                                        }}>
                                        CÁC SẢN PHẨM CHĂM SÓC MẮT
                                    </h2>
                                </div>
                                <section>
                                    <Container>
                                        <Row>
                                            <Col lg={3} key={product._id}>
                                                <CardComponent
                                                    image={product.image}
                                                    name={product.name}
                                                    price={product.price}
                                                    selled={product.selled}
                                                    id={product._id}
                                                />
                                            </Col>
                                        </Row>
                                    </Container>
                                </section>
                            </Fragment>
                        );
                    })}

                {/* Product Type "Gan" */}
                {products?.data
                    .filter((product) => product.type === "Gan")
                    .map((product) => {
                        return (
                            <Fragment>
                                <div className={cx("partials")}>
                                    <h2
                                        style={{
                                            margin: "0 10px",
                                            color: "var(--textcolor-black)",
                                            fontWeight: "600",
                                        }}>
                                        CÁC SẢN PHẨM CHĂM SÓC SẮC ĐẸP
                                    </h2>
                                </div>
                                <section>
                                    <Container>
                                        <Row>
                                            <Col lg={3} key={product._id}>
                                                <CardComponent
                                                    image={product.image}
                                                    name={product.name}
                                                    price={product.price}
                                                    selled={product.selled}
                                                    id={product._id}
                                                />
                                            </Col>
                                        </Row>
                                    </Container>
                                </section>
                            </Fragment>
                        );
                    })}

                {/* Product Type "Răng Miệng" */}
                {products?.data
                    .filter((product) => product.type === "Răng Miệng")
                    .map((product) => {
                        return (
                            <Fragment>
                                <div
                                    className={cx("partials")}
                                    style={{ marginTop: "60px" }}>
                                    <h2
                                        style={{
                                            margin: "0 10px",
                                            color: "var(--textcolor-black)",
                                            fontWeight: "600",
                                        }}>
                                        CÁC SẢN PHẨM CHĂM SÓC RĂNG MIỆNG
                                    </h2>
                                </div>
                                <section>
                                    <Container>
                                        <Row>
                                            <Col lg={3} key={product._id}>
                                                <CardComponent
                                                    image={product.image}
                                                    name={product.name}
                                                    price={product.price}
                                                    selled={product.selled}
                                                    id={product._id}
                                                />
                                            </Col>
                                        </Row>
                                    </Container>
                                </section>
                            </Fragment>
                        );
                    })}

                {/* Chat Engine */}
                <SupportEngine />
            </div>
        </Loading>
    );
}

export default HomePage;
