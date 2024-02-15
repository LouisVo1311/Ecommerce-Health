import { Button, Form, Space } from "antd";
import React, { Fragment, useRef, useState } from "react";
import { WrapperHeader } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import DrawerComponent from "../DrawerComponent";
import Loading from "../LoadingComponent/Loading";
import ModalComponent from "../ModalComponent/ModalComponent";
import { convertPrice, convertDateTime } from "../../utils";
import { useEffect } from "react";
import * as message from "../Message/Message";
import { useMutationHooks } from "../../hooks/useMutationHook";
import brand from "../../assets/images/brand.jfif";

import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import {
    DeleteOutlined,
    SearchOutlined,
    CheckOutlined,
    PrinterFilled,
    EyeOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { orderContant } from "../../contant";
import PieChartComponent from "./PieChart";
import { Container } from "react-bootstrap";

const AdminOrder = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedOrderData, setSelectedOrderData] = useState({});
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [rowSelected, setRowSelected] = useState("");
    const searchInput = useRef(null);
    const user = useSelector((state) => state?.user);

    const inittial = () => ({
        isDelivered: false,
    });

    const [stateOrder, setStateOrder] = useState(inittial());
    const [stateOrderDetails, setStateOrderDetails] = useState(inittial());

    const [form] = Form.useForm();

    const mutation = useMutationHooks((data) => {
        const { isDelivered } = data;
        const res = OrderService.createOrder({
            isDelivered,
        });
        return res;
    });

    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rests } = data;
        const res = OrderService.updateOrder(id, token, { ...rests });
        return res;
    });

    const mutationDeleted = useMutationHooks((data) => {
        const { id, token } = data;
        const res = OrderService.deleteOrder(id, token);
        return res;
    });

    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder(user?.access_token);
        return res;
    };

    const fetchGetDetailsOrder = async (rowSelected) => {
        const res = await OrderService.getDetailsOrder(rowSelected);
        if (res?.data) {
            setStateOrderDetails({
                isDelivered: res?.data?.isDelivered,
            });
        }
        setIsLoadingUpdate(false);
    };

    useEffect(() => {
        if (!isModalOpen) {
            form.setFieldsValue(stateOrderDetails);
        } else {
            form.setFieldsValue(inittial());
        }
    }, [form, stateOrderDetails, isModalOpen]);

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true);
            fetchGetDetailsOrder(rowSelected);
        }
    }, [rowSelected, isOpenDrawer]);

    const handleDetailsOrder = () => {
        setIsOpenDrawer(true);
    };

    const {
        data: dataUpdated,
        isLoading: isLoadingUpdated,
        isSuccess: isSuccessUpdated,
        isError: isErrorUpdated,
    } = mutationUpdate;
    const {
        data: dataDeleted,
        isLoading: isLoadingDeleted,
        isSuccess: isSuccessDelected,
        isError: isErrorDeleted,
    } = mutationDeleted;

    const queryOrder = useQuery({
        queryKey: ["orders"],
        queryFn: getAllOrder,
    });

    const { isLoading: isLoadingOrders, data: orders } = queryOrder;

    const renderAction = (record) => {
        const handleConfirmDelivery = () => {
            let newStatus;

            if (record.isDelivered === "Chưa Xác Nhận") {
                newStatus = "Đã Xác Nhận";
            } else if (record.isDelivered === "Đã Xác Nhận") {
                newStatus = "Đang Giao Hàng";
            } else if (record.isDelivered === "Đang Giao Hàng") {
                newStatus = "Đã Giao Hàng";
            } else {
                newStatus = "Chưa Xác Nhận";
            }

            mutationUpdate.mutate(
                {
                    id: record._id,
                    token: user?.access_token,
                    isDelivered: newStatus,
                },
                {
                    onSettled: () => {
                        queryOrder.refetch();
                    },
                }
            );
        };

        const handleApprovePayment = () => {
            mutationUpdate.mutate(
                {
                    id: record._id,
                    token: user?.access_token,
                    isPaid: true,
                },
                {
                    onSettled: () => {
                        queryOrder.refetch();
                    },
                }
            );
        };

        const handlePrintOrder = () => {
            printOrder(record);
        };

        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex" }}>
                    <div
                        style={{
                            width: "30px",
                            height: "30px",
                            backgroundColor: "var(--btn-blue-color)",
                            fontSize: "1.8rem",
                            cursor: "pointer",
                            marginRight: "10px",
                            display: "flex",
                            borderRadius: "4px",
                        }}>
                        <CheckOutlined
                            onClick={handleConfirmDelivery}
                            style={{
                                color: "var(--text-color-white)",
                                margin: "0 auto",
                            }}
                        />
                    </div>
                    <div
                        style={{
                            width: "30px",
                            height: "30px",
                            backgroundColor: "var(--btn-detail)",
                            fontSize: "1.8rem",
                            cursor: "pointer",
                            marginRight: "10px",
                            display: "flex",
                            borderRadius: "4px",
                        }}>
                        <EyeOutlined
                            type='primary'
                            onClick={() => handleViewDetails(record)}
                            style={{
                                color: "var(--text-color-white)",
                                margin: "0 auto",
                            }}
                        />
                    </div>
                    <div
                        style={{
                            width: "30px",
                            height: "30px",
                            backgroundColor: "var(--btn-delete)",
                            fontSize: "1.8rem",
                            cursor: "pointer",
                            display: "flex",
                            borderRadius: "4px",
                        }}>
                        <DeleteOutlined
                            style={{
                                color: "var(--text-color-white)",
                                margin: "0 auto",
                            }}
                            onClick={() => setIsModalOpenDelete(true)}
                        />
                    </div>
                </div>

                <div style={{ display: "flex", marginTop: "10px" }}>
                    <div
                        style={{
                            width: "100%",
                            height: "30px",
                            backgroundColor: "#28a745",
                            fontSize: "1.8rem",
                            cursor: "pointer",
                            marginRight: "10px",
                            display: "flex",
                            borderRadius: "4px",
                        }}>
                        <span
                            onClick={handleApprovePayment}
                            style={{
                                color: "var(--text-color-white)",
                                margin: "0 auto",
                            }}>
                            Duyệt
                        </span>
                    </div>
                    <div
                        style={{
                            width: "50px",
                            height: "30px",
                            backgroundColor: "#ffc107",
                            fontSize: "1.8rem",
                            cursor: "pointer",
                            marginRight: "10px",
                            display: "flex",
                            borderRadius: "4px",
                        }}>
                        <PrinterFilled
                            onClick={handlePrintOrder}
                            style={{
                                color: "var(--text-color-black)",
                                margin: "0 auto",
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const printOrder = (order) => {
        const printWindow = window.open("", "_blank");

        if (printWindow) {
            printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Hóa Đơn</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: #f4f4f4;
                    }
            
                    .invoice {
                        background-color: #fff;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
            
                    .invoice-header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
            
                    .invoice-details {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 20px;
                    }
            
                    .invoice-items {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
            
                    .invoice-items th, .invoice-items td {
                        border: 1px solid #ddd;
                        padding: 10px;
                        text-align: left;
                    }
            
                    .invoice-total {
                        text-align: right;
                    }
            
                    .footer {
                        margin-top: 20px;
                        text-align: center;
                    }

                    .label-finish {
                        color: #fcc000;
                        font-weight: 600;
                    }
                </style>
            </head>
            <body>
                <div class="invoice">
                    <div class="invoice-header">
                        <h1>HÓA ĐƠN MUA HÀNG</h1>
                    </div>
            
                    <div class="invoice-details">
                        <div>
                            <p><strong>Tên Khách Hàng: </strong>${
                                order?.shippingAddress?.fullName
                            }</p>
                            <p><strong>Địa Chỉ: </strong>${
                                order?.shippingAddress?.address
                            }</p>
                            <p><strong>Số Điện Thoại:</strong> 0${
                                order?.shippingAddress?.phone
                            }</p>
                        </div>
                        <div>
                            <p><strong>Mã Đơn Hàng: </strong>HD${order._id}</p>
                            <p><strong>Ngày Đặt Hàng: </strong>${
                                order.createdAt
                            }</p>
                        </div>
                    </div>
            
                    <table class="invoice-items">
                        <thead>
                            <tr>
                                <th>Tên Sản Phẩm</th>
                                <th>Đơn Giá</th>
                                <th>Số Lượng</th>
                                <th>Tạm Tính</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${order.productNames}</td>
                                <td>${order.productPrice}</td>
                                <td>${order.productAmount}</td>
                                <td>${convertPrice(order.itemsPrice)}</td>
                            </tr>
                        </tbody>
                    </table>
            
                    <div class="invoice-total">
                        <p><strong>Thành Tiền:</strong>${order.totalPrice}</p>
                    </div>
            
                    <div class="footer">
                        <p>Cảm ơn bạn đã mua hàng tại <p class="label-finish">SieuThiSongKhoe.com!</p></p>
                    </div>
                </div>
            </body>
            </html>
            
            `);

            printWindow.document.close();
            printWindow.print();
        } else {
            alert("Không thể mở cửa sổ in.");
        }
    };

    const handleViewDetails = (record) => {
        setSelectedOrderData(record);
        setIsDetailsModalOpen(true);
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };

    const handleReset = (clearFilters) => {
        clearFilters();
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}>
                <InputComponent
                    // ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type='primary'
                        onClick={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size='small'
                        style={{
                            width: 90,
                        }}>
                        Search
                    </Button>
                    <Button
                        onClick={() =>
                            clearFilters && handleReset(clearFilters)
                        }
                        size='small'
                        style={{
                            width: 90,
                        }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? "#1890ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    const columns = [
        {
            title: "Mã Hoá Đơn",
            dataIndex: "_id",
            sorter: (a, b) => a._id.length - b._id.length,
        },
        {
            title: "Tên Khách Hàng",
            dataIndex: "userName",
            sorter: (a, b) => a.userName.length - b.userName.length,
            ...getColumnSearchProps("userName"),
        },
        {
            title: "Thanh Toán",
            dataIndex: "isPaid",
            ...getColumnSearchProps("isPaid"),
            render: (_, record) => {
                let color;

                switch (record.isPaid) {
                    case "Đã Thanh Toán":
                        color = "red";
                        break;
                    default:
                        color = "black";
                }

                return {
                    children: (
                        <span
                            style={{
                                color: color,
                                fontWeight: "600",
                            }}>
                            {record.isPaid}
                        </span>
                    ),
                };
            },
        },
        {
            title: "Tình Trạng Đơn Hàng",
            dataIndex: "isDelivered",
            sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
            ...getColumnSearchProps("isDelivered"),
            render: (_, record) => {
                let backgroundColor;

                switch (record.isDelivered) {
                    case "Chưa Xác Nhận":
                        backgroundColor = "orange";
                        break;
                    case "Đã Xác Nhận":
                        backgroundColor = "var(--btn-blue-color)";
                        break;
                    case "Đang Giao Hàng":
                        backgroundColor = "var(--btn-delete)";
                        break;
                    case "Đã Giao Hàng":
                        backgroundColor = "green";
                        break;
                    default:
                        backgroundColor = "red";
                }

                return {
                    children: (
                        <span
                            style={{
                                padding: "10px",
                                height: "100%",
                                background: backgroundColor,
                                color: "white",
                                fontWeight: "600",
                            }}>
                            {record.isDelivered}
                        </span>
                    ),
                };
            },
        },
        {
            title: "Tổng Tiền",
            dataIndex: "totalPrice",
            sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
            ...getColumnSearchProps("totalPrice"),
        },
        {
            title: "Hành Động",
            dataIndex: "action",
            render: (_, record) => renderAction(record),
        },
    ];

    const dataTable =
        orders?.data?.length &&
        orders?.data?.map((order) => {
            console.log("user", order);

            const productNames = order?.orderItems
                .map((item) => item.name)
                .join(", ");

            const productAmount = order?.orderItems
                .map((item) => item.amount)
                .join(", ");

            const productPrice = order?.orderItems
                .map((item) => item.price)
                .join(", ");

            // Determine the display status based on the current status
            let displayStatus;
            if (order.isDelivered === "Chưa Xác Nhận") {
                displayStatus = "Chưa Xác Nhận";
            } else if (order.isDelivered === "Đã Xác Nhận") {
                displayStatus = "Đã Xác Nhận";
            } else if (order.isDelivered === "Đang Giao Hàng") {
                displayStatus = "Đang Giao Hàng";
            } else if (order.isDelivered === "Đã Giao Hàng") {
                displayStatus = "Đã Giao Hàng";
            } else {
                displayStatus = "Chưa Xác Nhận";
            }

            return {
                ...order,
                key: order._id,
                userName: order?.shippingAddress?.fullName,
                address: order?.shippingAddress?.address,
                paymentMethod: orderContant.payment[order?.paymentMethod],
                isPaid: order?.isPaid ? "Đã Thanh Toán" : "Chưa Thanh Toán",
                isDelivered: displayStatus,
                totalPrice: convertPrice(order?.totalPrice),
                productNames: productNames,
                createdAt: convertDateTime(order?.createdAt),
                name: order?.orderItems?.name,
                amount: order?.orderItems?.amount,
                productAmount: productAmount,
                productPrice: productPrice,
            };
        });

    useEffect(() => {
        if (isSuccessDelected && dataDeleted?.status === "OK") {
            message.success();
            handleCancelDelete();
        } else if (isErrorDeleted) {
            message.error();
        }
    }, [isSuccessDelected]);

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateOrderDetails({
            isDelivered: "",
        });
        form.resetFields();
    };

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === "OK") {
            message.success();
            handleCloseDrawer();
        } else if (isErrorUpdated) {
            message.error();
        }
    }, [isSuccessUpdated]);

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };

    const handleDeleteOrder = () => {
        mutationDeleted.mutate(
            { id: rowSelected, token: user?.access_token },
            {
                onSettled: () => {
                    queryOrder.refetch();
                },
            }
        );
    };

    return (
        <div
            style={{
                padding: "40px",
                width: "100%",
                backgroundColor: "var(--background-admin)",
            }}>
            <Container>
                <WrapperHeader>QUẢN LÝ ĐƠN ĐẶT HÀNG</WrapperHeader>

                {/* Chart */}
                <div style={{ height: 200, width: 200 }}>
                    <PieChartComponent data={orders?.data} />
                </div>

                {/* Table */}
                <div style={{ marginTop: "20px" }}>
                    <TableComponent
                        columns={columns}
                        isLoading={isLoadingOrders}
                        data={dataTable}
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: (event) => {
                                    setRowSelected(record._id);
                                },
                            };
                        }}
                    />
                </div>

                {/* Details Order */}
                <ModalComponent
                    title='Chi tiết thông tin sản phẩm'
                    visible={isDetailsModalOpen}
                    onCancel={() => setIsDetailsModalOpen(false)}
                    footer={null}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ marginBottom: "10px" }}>
                            <span
                                style={{
                                    fontSize: "1.6rem",
                                    fontWeight: "600",
                                    marginRight: "10px",
                                }}>
                                Tên Khách Hàng:
                            </span>
                            <span
                                style={{
                                    fontSize: "1.4rem",
                                    lineHeight: "3rem",
                                }}>
                                {selectedOrderData?.shippingAddress?.fullName}
                            </span>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <span
                                style={{
                                    fontSize: "1.6rem",
                                    fontWeight: "600",
                                    marginRight: "10px",
                                }}>
                                Địa Chỉ:
                            </span>
                            <span
                                style={{
                                    fontSize: "1.4rem",
                                    lineHeight: "3rem",
                                }}>
                                {selectedOrderData?.shippingAddress?.address}
                            </span>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <span
                                style={{
                                    fontSize: "1.6rem",
                                    fontWeight: "600",
                                    marginRight: "10px",
                                }}>
                                Thành Phố:
                            </span>
                            <span
                                style={{
                                    fontSize: "1.4rem",
                                    lineHeight: "3rem",
                                }}>
                                {selectedOrderData?.shippingAddress?.city}
                            </span>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <span
                                style={{
                                    fontSize: "1.6rem",
                                    fontWeight: "600",
                                    marginRight: "10px",
                                }}>
                                Số Điện Thoại:
                            </span>
                            <span
                                style={{
                                    fontSize: "1.4rem",
                                    lineHeight: "3rem",
                                }}>
                                {selectedOrderData?.shippingAddress?.phone}
                            </span>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <span
                                style={{
                                    fontSize: "1.6rem",
                                    fontWeight: "600",
                                    marginRight: "10px",
                                }}>
                                Tên Sản Phẩm:
                            </span>
                            <span
                                style={{
                                    fontSize: "1.4rem",
                                    lineHeight: "3rem",
                                }}>
                                {selectedOrderData?.productNames}
                            </span>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <span
                                style={{
                                    fontSize: "1.6rem",
                                    fontWeight: "600",
                                    marginRight: "10px",
                                }}>
                                Số Lượng:
                            </span>
                            <span
                                style={{
                                    fontSize: "1.4rem",
                                    lineHeight: "3rem",
                                }}>
                                {selectedOrderData?.productAmount}
                            </span>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <span
                                style={{
                                    fontSize: "1.6rem",
                                    fontWeight: "600",
                                    marginRight: "10px",
                                }}>
                                Ngày Đặt Hàng:
                            </span>
                            <span
                                style={{
                                    fontSize: "1.4rem",
                                    lineHeight: "3rem",
                                }}>
                                {selectedOrderData?.createdAt}
                            </span>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <span
                                style={{
                                    fontSize: "1.6rem",
                                    fontWeight: "600",
                                    marginRight: "10px",
                                }}>
                                Phương Thức Thanh Toán:
                            </span>
                            <span
                                style={{
                                    fontSize: "1.4rem",
                                    lineHeight: "3rem",
                                }}>
                                {selectedOrderData?.paymentMethod}
                            </span>
                        </div>
                    </div>
                </ModalComponent>

                {/* Delete Product */}
                <ModalComponent
                    title='Xóa Hoá Đơn'
                    open={isModalOpenDelete}
                    onCancel={handleCancelDelete}
                    onOk={handleDeleteOrder}>
                    <Loading isLoading={isLoadingDeleted}>
                        <div>Bạn có chắc muốn xóa đơn hàng này không?</div>
                    </Loading>
                </ModalComponent>
            </Container>
        </div>
    );
};

export default AdminOrder;
