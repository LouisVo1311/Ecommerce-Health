import React from "react";
import { Image } from "antd";
import {
    FacebookOutlined,
    GooglePlusOutlined,
    TwitterOutlined,
    MediumWorkmarkOutlined,
} from "@ant-design/icons";
// import classNames from "classnames/bind";

// Service;
// import styles from "./Footer.module.scss";

// const cx = classNames.bind(styles);

function FooterComponent() {
    return (
        <footer className='footer'>
            <div className='my-5'>
                <div className='text-center text-lg-start text-white'>
                    <div className='p-4 pb-0'>
                        <section className=''>
                            <div className='row'>
                                <div className='col-md-3 col-lg-3 col-xl-3 mx-auto mt-3'>
                                    <h2
                                        className='text-uppercase mb-4 font-weight-bold'
                                        style={{
                                            color: "var(--btn-yellow-color)",
                                            fontWeight: "600",
                                        }}>
                                        SIÊU THỊ SỐNG KHOẺ
                                    </h2>
                                    <p>
                                        Thông tin trên website này chỉ mang tính
                                        chất nội bộ tham khảo; không được xem là
                                        tư vấn y khoa và không nhằm mục đích
                                        thay thế cho tư vấn, chẩn đoán hoặc điều
                                        trị từ nhân viên y tế. Khi có vấn đề về
                                        sức khỏe hoặc cần hỗ trợ cấp cứu người
                                        đọc cần liên hệ bác sĩ và cơ sở y tế gần
                                        nhất
                                    </p>
                                </div>

                                <div className='col-md-3 col-lg-2 col-xl-2 mx-auto mt-3'>
                                    <h4 className='text-uppercase mb-4 font-weight-bold'>
                                        THÔNG TIN CHUNG
                                    </h4>
                                    <p>
                                        <a className='text-white'>Giới Thiệu</a>
                                    </p>
                                    <p>
                                        <a className='text-white'>Sản Phẩm</a>
                                    </p>
                                    <p>
                                        <a className='text-white'>Tư Vấn</a>
                                    </p>
                                    <p>
                                        <a className='text-white'>Liên Hệ</a>
                                    </p>
                                </div>

                                <hr className='w-100 clearfix d-md-none' />

                                <div className='col-md-2 col-lg-2 col-xl-2 mx-auto mt-3'>
                                    <h4 className='text-uppercase mb-4 font-weight-bold'>
                                        THƯƠNG MẠI ĐIỆN TỬ
                                    </h4>
                                    <p>
                                        <a className='text-white'>
                                            <Image
                                                src='https://www.freeiconspng.com/uploads/paypal-icon-8.png'
                                                preview={false}
                                            />
                                        </a>
                                    </p>
                                </div>

                                <hr className='w-100 clearfix d-md-none' />

                                <div className='col-md-4 col-lg-3 col-xl-3 mx-auto mt-3'>
                                    <h4 className='text-uppercase mb-4 font-weight-bold'>
                                        LIÊN HỆ
                                    </h4>
                                    <p>
                                        <i className='fas fa-home mr-3'></i>
                                        Tầng 8 Toà nhà Thuỷ Lợi 4, 205A Nguyễn
                                        Xí, Phường 26, Bình Thạnh, Hồ Chí Minh
                                    </p>
                                    <p>
                                        <i className='fas fa-envelope mr-3'></i>{" "}
                                        sieuthisongkhoe@gmail.com
                                    </p>
                                    <p>
                                        <i className='fas fa-print mr-3'></i>{" "}
                                        +84 093 8656 258
                                    </p>
                                </div>
                            </div>
                        </section>

                        <hr className='my-3' />

                        <section className='p-3 pt-0'>
                            <div className='row d-flex align-items-center'>
                                <div className='col-md-7 col-lg-8 text-center text-md-start'>
                                    <div
                                        className='p-3'
                                        style={{
                                            color: "var(--btn-yellow-color)",
                                            fontWeight: "600",
                                        }}>
                                        © 2023 Copyright:
                                        <a
                                            href='/'
                                            style={{
                                                color: "var(--btn-yellow-color)",
                                                fontWeight: "600",
                                                marginLeft: "5px",
                                            }}>
                                            SieuThiSongKhoe.com
                                        </a>
                                    </div>
                                </div>

                                <div className='col-md-5 col-lg-4 ml-lg-0 text-center text-md-end'>
                                    <a href='/' role='button'>
                                        <FacebookOutlined
                                            style={{
                                                width: "40px",
                                                height: "auto",
                                                fontSize: "2.5rem",
                                                color: "var(--btn-yellow-color)",
                                            }}
                                        />
                                    </a>

                                    <a href='/' role='button'>
                                        <GooglePlusOutlined
                                            style={{
                                                width: "40px",
                                                height: "auto",
                                                fontSize: "2.5rem",
                                                color: "var(--btn-yellow-color)",
                                            }}
                                        />
                                    </a>

                                    <a role='button'>
                                        <TwitterOutlined
                                            style={{
                                                width: "40px",
                                                height: "auto",
                                                fontSize: "2.5rem",
                                                color: "var(--btn-yellow-color)",
                                            }}
                                        />
                                    </a>

                                    <a role='button'>
                                        <MediumWorkmarkOutlined
                                            style={{
                                                width: "40px",
                                                height: "auto",
                                                fontSize: "2.5rem",
                                                color: "var(--btn-yellow-color)",
                                            }}
                                        />
                                    </a>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default FooterComponent;
