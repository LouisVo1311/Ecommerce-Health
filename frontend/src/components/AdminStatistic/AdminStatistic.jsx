import React, { Fragment, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import * as OrderService from "../../services/OrderService";
import * as ProductService from "../../services/ProductService";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { convertPrice } from "../../utils";
import { DatePicker, Button } from "antd";
import { DateRevenueChart, MonthRevenueChart } from "./RevenueChart";
import { HistoryOutlined } from "@ant-design/icons";

const AdminStatistic = () => {
    const user = useSelector((state) => state?.user);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalProfitBeforeTax, setTotalProfitBeforeTax] = useState(0);
    const [totalProfitTax, setTotalProfitTax] = useState(0);
    const [totalProfitAfterTax, setTotalProfitAfterTax] = useState(0);
    const [selectedDate, setSelectedDate] = useState(null);
    const [totalRealRevenue, setTotalRealRevenue] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [dailyRevenues, setDailyRevenues] = useState([]);
    const [monthlyChartData, setMonthlyChartData] = useState([]);
    const [totalConfirmedOrders, setTotalConfirmedOrders] = useState(0);

    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder(user?.access_token);
        return res;
    };

    const getAllProducts = async () => {
        const res = await ProductService.getAllProduct(user?.access_token);
        return res;
    };

    const queryOrder = useQuery({
        queryKey: ["orders"],
        queryFn: getAllOrder,
    });

    const queryProduct = useQuery({
        queryKey: ["products"],
        queryFn: getAllProducts,
    });

    const { isLoading: isLoadingOrders, data: orders } = queryOrder;
    const { isLoading: isLoadingProducts, data: products } = queryProduct;

    // Doanh thu tạm thời
    useEffect(() => {
        const calculateTotalConfirmedOrders = () => {
            if (orders?.data) {
                const confirmedOrders = orders.data.filter(
                    (order) => order.isDelivered === "Đã Xác Nhận"
                );
                setTotalConfirmedOrders(confirmedOrders.length);
            }
        };
        calculateTotalConfirmedOrders();
    }, [orders]);
    useEffect(() => {
        const calculateTotalRevenue = () => {
            if (orders?.data) {
                const tempTotal = orders.data.reduce((acc, order) => {
                    if (order.isDelivered === "Đã Xác Nhận" && !order.isPaid) {
                        return acc + order.totalPrice;
                    }
                    return acc;
                }, 0);
                setTotalRevenue(tempTotal);
            }
        };

        calculateTotalRevenue();
    }, [orders]);

    // Doanh thu thực tế 1 ngày
    const calculateRevenueByDate = () => {
        if (orders?.data && selectedDate) {
            const selectedDateString = new Date(
                selectedDate
            ).toLocaleDateString("en-US");
            const filteredOrders = orders.data.filter((order) => {
                const orderDate = new Date(order.createdAt).toLocaleDateString(
                    "en-US"
                );
                return (
                    orderDate === selectedDateString &&
                    (order.isDelivered === "Đã Giao Hàng" || order.isPaid)
                );
            });

            const revenue = filteredOrders.reduce(
                (acc, order) => acc + order.totalPrice,
                0
            );
            setTotalRealRevenue(revenue);
        }
    };

    // Lợi nhuận
    useEffect(() => {
        const calculateTotalProfit = () => {
            if (products?.data) {
                const realProfit = products.data.reduce((acc, product) => {
                    const productProfit =
                        (product.price - product.priceImport) * product.selled;
                    console.log("productProfit", productProfit);
                    return acc + productProfit;
                }, 0);
                setTotalProfitBeforeTax(realProfit);

                const taxProfit = realProfit * 0.08;
                setTotalProfitTax(taxProfit);

                const realtaxProfit = realProfit - taxProfit;
                setTotalProfitAfterTax(realtaxProfit);
            }
        };

        calculateTotalProfit();
    }, [products]);

    // Biểu đồ cột thống kê doanh thu ngày tháng năm
    useEffect(() => {
        if (orders?.data) {
            const dailyRevenuesMap = {};
            const monthlyRevenuesMap = {};

            orders.data.forEach((order) => {
                const orderDate = new Date(order.createdAt).toLocaleDateString(
                    "en-US"
                );
                if (dailyRevenuesMap[orderDate]) {
                    dailyRevenuesMap[orderDate] += order.totalPrice;
                } else {
                    dailyRevenuesMap[orderDate] = order.totalPrice;
                }

                const monthYear = new Date(order.createdAt).toLocaleDateString(
                    "en-US",
                    {
                        month: "long",
                        year: "numeric",
                    }
                );
                if (monthlyRevenuesMap[monthYear]) {
                    monthlyRevenuesMap[monthYear] += order.totalPrice;
                } else {
                    monthlyRevenuesMap[monthYear] = order.totalPrice;
                }
            });

            const dailyRevenuesArray = Object.entries(dailyRevenuesMap).map(
                ([date, revenue]) => ({
                    date,
                    revenue,
                })
            );

            dailyRevenuesArray.sort(
                (a, b) => new Date(a.date) - new Date(b.date)
            );

            setDailyRevenues(dailyRevenuesArray);
            setChartData(dailyRevenuesArray);

            const monthlyRevenuesArray = Object.entries(monthlyRevenuesMap).map(
                ([monthYear, revenue]) => ({
                    monthYear,
                    revenue,
                })
            );

            monthlyRevenuesArray.sort(
                (a, b) => new Date(a.monthYear) - new Date(b.monthYear)
            );

            setMonthlyChartData(monthlyRevenuesArray);
        }
    }, [orders?.data]);

    return (
        <div
            style={{
                padding: "40px",
                width: "100%",
                backgroundColor: "var(--background-admin)",
            }}>
            <Container>
                <h1 style={{ fontWeight: "600", marginBottom: "20px" }}>
                    THỐNG KÊ
                </h1>
                <Row>
                    <Col lg={4}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                width: "270px",
                                height: "150px",
                                backgroundColor: "var(--profit)",
                                borderRadius: "4px",
                                padding: "20px",
                                boxShadow:
                                    "0 0 1px rgba(0,0,0,.125), 0 1px 3px rgba(0,0,0,.2)",
                                marginBottom: "20px",
                            }}>
                            <h2
                                style={{
                                    color: "var(--text-color-black)",
                                    fontWeight: "600",
                                }}>
                                Tổng lợi nhuận
                            </h2>
                            <span
                                style={{
                                    fontWeight: "600",
                                    color: "red",
                                    textAlign: "end",
                                    fontSize: "2.5rem",
                                    marginTop: "30px",
                                }}>
                                {convertPrice(totalProfitBeforeTax)}
                            </span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                width: "270px",
                                height: "150px",
                                backgroundColor: "var(--profit)",
                                borderRadius: "4px",
                                padding: "20px",
                                boxShadow:
                                    "0 0 1px rgba(0,0,0,.125), 0 1px 3px rgba(0,0,0,.2)",
                            }}>
                            <h2
                                style={{
                                    color: "var(--text-color-black)",
                                    fontWeight: "600",
                                }}>
                                Tổng lợi nhuận sau thuế
                            </h2>
                            <span
                                style={{
                                    fontWeight: "600",
                                    color: "red",
                                    textAlign: "end",
                                    fontSize: "2.5rem",
                                    marginTop: "30px",
                                }}>
                                {convertPrice(totalProfitAfterTax)}
                            </span>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                marginBottom: "20px",
                            }}>
                            <span
                                style={{
                                    fontWeight: "600",
                                }}>
                                {selectedDate ? (
                                    <Fragment></Fragment>
                                ) : (
                                    "Chọn ngày để xem doanh thu"
                                )}
                            </span>
                            <div
                                style={{
                                    display: "flex",
                                }}>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                />
                                <Button
                                    type='primary'
                                    onClick={calculateRevenueByDate}>
                                    Tra cứu
                                </Button>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                            }}>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "300px",
                                    height: "150px",
                                    backgroundColor: "var(--btn-edit)",
                                    borderRadius: "8px",
                                    padding: "20px",
                                    border: "1px solid #aaa",
                                }}>
                                <h2
                                    style={{
                                        color: "var(--text-color-white)",
                                    }}>
                                    {selectedDate
                                        ? `Doanh thu ngày ${selectedDate.format(
                                              "DD-MM-YYYY"
                                          )}`
                                        : "Doanh thu ngày ..."}
                                </h2>
                                <span
                                    style={{
                                        fontWeight: "600",
                                        color: "var(--text-color-white)",
                                        textAlign: "end",
                                        fontSize: "2.5rem",
                                        marginTop: "30px",
                                    }}>
                                    {convertPrice(totalRealRevenue)}
                                </span>
                            </div>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div>
                            <h2
                                style={{
                                    color: "var(--text-color-black)",
                                    fontWeight: "600",
                                }}>
                                Doanh Thu Tạm Thời
                            </h2>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "300px",
                                    height: "150px",
                                    backgroundColor: "var(--btn-delete)",
                                    borderRadius: "8px",
                                    padding: "20px",
                                    border: "1px solid #aaa",
                                    marginTop: "50px",
                                }}>
                                <div  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyItems: "center" }}>
                                    <span style={{ fontSize: "3.5rem", fontWeigth: "600", color: "var(--text-color-white)" }}>{totalConfirmedOrders}</span>
                                    <p
                                        style={{
                                            color: "var(--text-color-white)",
                                        }}>
                                        Đơn Hàng Đã Xác Nhận
                                    </p>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyItems: "center" }}>
                                    <HistoryOutlined style={{ fontSize: "5rem", color: "var(--text-color-white)", float: "right"}} />
                                    <span
                                        style={{
                                            fontWeight: "600",
                                            color: "var(--text-color-white)",
                                            textAlign: "end",
                                            fontSize: "2.5rem",
                                            marginTop: "10px",
                                        }}>
                                        {convertPrice(totalRevenue)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    {dailyRevenues.length > 0 && (
                        <div style={{ marginTop: "40px" }}>
                            <DateRevenueChart data={chartData} />
                        </div>
                    )}
                </Row>
                <Row>
                    {monthlyChartData.length > 0 && (
                        <div style={{ marginTop: "40px" }}>
                            <MonthRevenueChart data={monthlyChartData} />
                        </div>
                    )}
                </Row>
            </Container>
        </div>
    );
};

export default AdminStatistic;
