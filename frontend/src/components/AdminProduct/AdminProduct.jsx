import { Button, Form, Space, Tooltip, Modal, DatePicker } from "antd";
import {
    DeleteOutlined,
    FormOutlined,
    EyeOutlined,
    SearchOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import React, { Fragment, useRef } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import { useState } from "react";
import InputComponent from "../InputComponent/InputComponent";
import { getBase64, convertDateTime } from "../../utils";
import * as ProductService from "../../services/ProductService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import { useEffect } from "react";
import * as message from "../../components/Message/Message";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import { Container } from "react-bootstrap";

const AdminProduct = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState("");
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedProductData, setSelectedProductData] = useState({});
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const user = useSelector((state) => state?.user);
    const searchInput = useRef(null);
    const { confirm } = Modal;
    const inittial = () => ({
        name: "",
        price: "",
        description: "",
        image: "",
        type: "",
        countInStock: "",
        discount: "",
        origin: "",
        packaging: "",
        exp: "",
    });
    const [stateProduct, setStateProduct] = useState(inittial());
    const [stateProductDetails, setStateProductDetails] = useState(inittial());

    const [form] = Form.useForm();

    const mutation = useMutationHooks((data) => {
        const {
            name,
            price,
            description,
            image,
            type,
            countInStock,
            discount,
            origin,
            packaging,
            exp,
        } = data;
        const res = ProductService.createProduct({
            name,
            price,
            description,
            image,
            type,
            countInStock,
            discount,
            origin,
            packaging,
            exp,
        });
        return res;
    });

    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rests } = data;
        const res = ProductService.updateProduct(id, token, { ...rests });
        return res;
    });

    const mutationDeleted = useMutationHooks((data) => {
        const { id, token } = data;
        const res = ProductService.deleteProduct(id, token);
        return res;
    });

    const mutationDeletedMany = useMutationHooks((data) => {
        const { token, ...ids } = data;
        const res = ProductService.deleteManyProduct(ids, token);
        return res;
    });

    const getAllProducts = async () => {
        const res = await ProductService.getAllProduct();
        return res;
    };

    const fetchGetDetailsProduct = async (rowSelected) => {
        const res = await ProductService.getDetailsProduct(rowSelected);
        if (res?.data) {
            setStateProductDetails({
                name: res?.data?.name,
                price: res?.data?.price,
                description: res?.data?.description,
                image: res?.data?.image,
                type: res?.data?.type,
                countInStock: res?.data?.countInStock,
                discount: res?.data?.discount,
                origin: res?.data?.origin,
                packaging: res?.data?.packaging,
                exp: res?.data?.exp,
            });
        }
        setIsLoadingUpdate(false);
    };

    useEffect(() => {
        if (!isModalOpen) {
            form.setFieldsValue(stateProductDetails);
        } else {
            form.setFieldsValue(inittial());
        }
    }, [form, stateProductDetails, isModalOpen]);

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true);
            fetchGetDetailsProduct(rowSelected);
        }
    }, [rowSelected, isOpenDrawer]);

    const handleDetailsProduct = () => {
        setIsOpenDrawer(true);
    };

    const handleDelteManyProducts = (ids) => {
        mutationDeletedMany.mutate(
            { ids: ids, token: user?.access_token },
            {
                onSettled: () => {
                    queryProduct.refetch();
                },
            }
        );
    };

    const { data, isLoading, isSuccess, isError } = mutation;
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
    const {
        data: dataDeletedMany,
        // isLoading: isLoadingDeletedMany,
        isSuccess: isSuccessDelectedMany,
        isError: isErrorDeletedMany,
    } = mutationDeletedMany;

    const queryProduct = useQuery({
        queryKey: ["products"],
        queryFn: getAllProducts,
    });

    const { isLoading: isLoadingProducts, data: products } = queryProduct;

    const renderAction = (record) => {
        return (
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
                    <FormOutlined
                        style={{
                            color: "var(--text-color-white)",
                            margin: "0 auto",
                        }}
                        onClick={handleDetailsProduct}
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
        );
    };

    const handleViewDetails = (record) => {
        setSelectedProductData(record);
        setIsDetailModalOpen(true);
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
                    ref={searchInput}
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

    const isProductExpired = (exp) => {
        const today = new Date();
        const expirationDate = new Date(exp);
        return expirationDate < today;
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
        
        const [month, day, year] = formattedDate.split('/');
        const formattedDateString = `${day}/${month}/${year}`;
        
        return formattedDateString;
    };

    const showDeleteConfirmation = (record) => {
        confirm({
            title: 'Xác nhận xoá sản phẩm',
            content: 'Sản phẩm đã hết hạn sử dụng! Bạn có muốn xoá sản phẩm này ra khỏi danh sách?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                handleDeleteProduct(record._id);
            },
            onCancel() {
                // Handle cancellation if needed
            },
        });
    };

    const columns = [
        {
            title: "Mã Sản Phẩm",
            dataIndex: "_id",
            sorter: (a, b) => a._id.length - b._id.length,
            ...getColumnSearchProps("_id"),
        },
        {
            title: "Tên Sản Phẩm",
            dataIndex: "name",
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps("name"),
        },
        {
            title: "Giá Nhập",
            dataIndex: "priceImport",
            sorter: (a, b) => a.priceImport - b.priceImport,
            filters: [
                {
                    text: ">= 100000",
                    value: ">=",
                },
                {
                    text: "<= 10000000",
                    value: "<=",
                },
            ],
            onFilter: (value, record) => {
                if (value === ">=") {
                    return record.priceImport >= 50;
                }
                return record.priceImport <= 50;
            },
        },
        {
            title: "Giá Bán",
            dataIndex: "price",
            sorter: (a, b) => a.price - b.price,
            filters: [
                {
                    text: ">= 100000",
                    value: ">=",
                },
                {
                    text: "<= 10000000",
                    value: "<=",
                },
            ],
            onFilter: (value, record) => {
                if (value === ">=") {
                    return record.price >= 50;
                }
                return record.price <= 50;
            },
        },
        {
            title: "Hạn Sử Dụng",
            dataIndex: "exp",
            sorter: (a, b) => a.exp - b.exp,
            ...getColumnSearchProps("exp"),
            render: (exp, record) => {
                const isExpired = isProductExpired(exp);
                const formattedExp = formatDate(exp);
                const style = isExpired ? { color: 'red', opacity: 0.5 } : {};
                
                return (
                    <div style={style}>
                        {formattedExp}
                        {isExpired && (
                            <span onClick={() => showDeleteConfirmation(record)}>
                                <ExclamationCircleOutlined style={{ marginLeft: 5 }} />
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            title: "Tồn Kho",
            dataIndex: "countInStock",
            sorter: (a, b) => a.countInStock - b.countInStock,
            filters: [
                {
                    text: ">= 500",
                    value: ">=",
                },
                {
                    text: "< 500",
                    value: "<",
                },
            ],
            onFilter: (value, record) => {
                if (value === ">=") {
                    return record.countInStock >= 500;
                }
                return record.countInStock < 500;
            },
            render: (text, record) => {
                const isZero = record.countInStock === 0;

                return (
                    <span style={{ color: isZero ? "red" : "inherit" }}>
                        {isZero ? (
                            <Fragment>
                                {text}
                                <Tooltip title='Sản phẩm trong kho đã hết'>
                                    <ExclamationCircleOutlined
                                        style={{
                                            color: "red",
                                            fontSize: "2rem",
                                            marginLeft: "10px",
                                        }}
                                        onClick={showQuantityAlert}
                                    />
                                </Tooltip>
                            </Fragment>
                        ) : (
                            text
                        )}
                    </span>
                );
            },
        },
        {
            title: "Giảm Giá",
            dataIndex: "discount",
            filters: [
                {
                    text: ">= 20",
                    value: ">=",
                },
                {
                    text: "< 20",
                    value: "<",
                },
            ],
            onFilter: (value, record) => {
                if (value === ">=") {
                    return record.discount >= 20;
                }
                return record.discount < 20;
            },
        },
        {
            title: "Đã Bán",
            dataIndex: "selled",
            sorter: (a, b) => a.selled - b.selled,
            ...getColumnSearchProps("selled"),
        },
        {
            title: "Hành Động",
            dataIndex: "action",
            render: (_, record) => renderAction(record),
        },
    ];

    const dataTable =
        products?.data?.length &&
        products?.data?.map((product) => {
            return {
                ...product,
                key: product._id,
                createdAt: convertDateTime(product?.createdAt),
            };
        });

    useEffect(() => {
        if (isSuccess && data?.status === "OK") {
            message.success();
            handleCancel();
        } else if (isError) {
            message.error();
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isSuccessDelectedMany && dataDeletedMany?.status === "OK") {
            message.success();
        } else if (isErrorDeletedMany) {
            message.error();
        }
    }, [isSuccessDelectedMany]);

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
        setStateProductDetails({
            name: "",
            price: "",
            description: "",
            image: "",
            type: "",
            countInStock: "",
            origin: "",
            packaging: "",
            exp: "",
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

    const handleDeleteProduct = () => {
        mutationDeleted.mutate(
            { id: rowSelected, token: user?.access_token },
            {
                onSettled: () => {
                    queryProduct.refetch();
                },
            }
        );
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({
            name: "",
            price: "",
            description: "",
            image: "",
            type: "",
            countInStock: "",
            discount: "",
            origin: "",
            packaging: "",
            exp: "",
        });
        form.resetFields();
    };

    const handleOnchangeDetails = (e) => {
        setStateProductDetails({
            ...stateProductDetails,
            [e.target.name]: e.target.value,
        });
    };

    const handleOnchangeAvatarDetails = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProductDetails({
            ...stateProductDetails,
            image: file.preview,
        });
    };
    const onUpdateProduct = () => {
        const { price, priceImport } = stateProductDetails;

        if (parseFloat(price) <= parseFloat(priceImport)) {
            message.error('Giá bán phải lớn hơn giá nhập');
            return; 
        }

        mutationUpdate.mutate(
            {
                id: rowSelected,
                token: user?.access_token,
                ...stateProductDetails,
            },
            {
                onSettled: () => {
                    queryProduct.refetch();
                },
            }
        );
    };

    const showQuantityAlert = () => {
        message.warning("Vui lòng nhập thêm số lượng sản phẩm vào kho!");
    };

    return (
        <div
            style={{
                padding: "40px",
                backgroundColor: "var(--background-admin)",
            }}>
            <Container>
                <WrapperHeader>DANH MỤC SẢN PHẨM</WrapperHeader>

                {/* Table Product */}
                <div style={{ marginTop: "20px" }}>
                    <TableComponent
                        handleDelteMany={handleDelteManyProducts}
                        columns={columns}
                        isLoading={isLoadingProducts}
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

                {/* Update Product */}
                <DrawerComponent
                    title='CẬP NHẬT SẢN PHẨM'
                    isOpen={isOpenDrawer}
                    onClose={() => setIsOpenDrawer(false)}
                    width='50%'>
                    <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                        <Form
                            name='basic'
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 20 }}
                            onFinish={onUpdateProduct}
                            autoComplete='on'
                            form={form}>
                            <Form.Item
                                label='Mã Chứng Từ'
                                name='licence'
                                rules={[
                                    {
                                        required: false,
                                        message: "Please input your licence!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateProductDetails.licence}
                                    onChange={handleOnchangeDetails}
                                    name='licence'
                                />
                            </Form.Item>
                            <Form.Item
                                label='Tên Sản Phẩm'
                                name='name'
                                rules={[
                                    {
                                        required: false,
                                        message: "Please input your name!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateProductDetails["name"]}
                                    onChange={handleOnchangeDetails}
                                    name='name'
                                />
                            </Form.Item>
                            <Form.Item
                                label='Phân Loại'
                                name='type'
                                rules={[
                                    {
                                        required: false,
                                        message: "Please input your type!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateProductDetails.type}
                                    onChange={handleOnchangeDetails}
                                    name='type'
                                />
                            </Form.Item>
                            <Form.Item
                                label='Nguồn Gốc'
                                name='origin'
                                rules={[
                                    {
                                        required: false,
                                        message: "Please input your origin!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateProductDetails.origin}
                                    onChange={handleOnchangeDetails}
                                    name='origin'
                                />
                            </Form.Item>
                            <Form.Item
                                label='Quy Cách'
                                name='packaging'
                                rules={[
                                    {
                                        required: false,
                                        message: "Please input your packaging!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateProductDetails.packaging}
                                    onChange={handleOnchangeDetails}
                                    name='packaging'
                                />
                            </Form.Item>
                            <Form.Item
                                label='Thành Phần'
                                name='ingredient'
                                rules={[
                                    {
                                        required: false,
                                        message:
                                            "Please input your ingredient!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateProductDetails.ingredient}
                                    onChange={handleOnchangeDetails}
                                    name='ingredient'
                                />
                            </Form.Item>
                            <Form.Item
                                label='Mô tả'
                                name='description'
                                rules={[
                                    {
                                        required: false,
                                        message:
                                            "Please input your count description!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateProductDetails.description}
                                    onChange={handleOnchangeDetails}
                                    name='description'
                                />
                            </Form.Item>
                            <Form.Item
                                label='Chứng Nhận'
                                name='certification'
                                rules={[
                                    {
                                        required: false,
                                        message:
                                            "Please input your certification!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateProductDetails.certification}
                                    onChange={handleOnchangeDetails}
                                    name='certification'
                                />
                            </Form.Item>
                            <Form.Item
                                label='Giá Nhập'
                                name='priceImport'
                                rules={[
                                    {
                                        required: false,
                                        message:
                                            "Please input your priceImport!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateProductDetails.priceImport}
                                    onChange={handleOnchangeDetails}
                                    name='priceImport'
                                />
                            </Form.Item>
                            <Form.Item
                                label='Giá Bán'
                                name='price'
                                rules={[
                                    {
                                        required: false,
                                        message: "Please input your price!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateProductDetails.price}
                                    onChange={handleOnchangeDetails}
                                    name='price'
                                />
                            </Form.Item>
                            <Form.Item
                                label='Hạn Sử Dụng'
                                name='exp'
                                rules={[
                                    {
                                        required: false,
                                        message: "Please input your exp!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateProductDetails.exp}
                                    onChange={handleOnchangeDetails}
                                    name='exp'
                                />
                            </Form.Item>
                            <Form.Item
                                label='Tồn Kho'
                                name='countInStock'
                                rules={[
                                    {
                                        required: false,
                                        message:
                                            "Please input your count inStock!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateProductDetails.countInStock}
                                    onChange={handleOnchangeDetails}
                                    name='countInStock'
                                />
                            </Form.Item>
                            <Form.Item
                                label='Giảm Giá'
                                name='discount'
                                rules={[
                                    {
                                        required: false,
                                        message:
                                            "Please input your discount of product!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateProductDetails.discount}
                                    onChange={handleOnchangeDetails}
                                    name='discount'
                                />
                            </Form.Item>
                            <Form.Item
                                label='Hình Ảnh'
                                name='image'
                                rules={[
                                    {
                                        required: false,
                                        message:
                                            "Please input your count image!",
                                    },
                                ]}>
                                <WrapperUploadFile
                                    onChange={handleOnchangeAvatarDetails}
                                    maxCount={1}>
                                    <Button>Select File</Button>
                                    {stateProductDetails?.image && (
                                        <img
                                            src={stateProductDetails?.image}
                                            style={{
                                                height: "60px",
                                                width: "60px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                                marginLeft: "10px",
                                            }}
                                            alt='avatar'
                                        />
                                    )}
                                </WrapperUploadFile>
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                                <Button type='primary' htmlType='submit'>
                                    Apply
                                </Button>
                            </Form.Item>
                        </Form>
                    </Loading>
                </DrawerComponent>

                {/* Details Product */}
                <ModalComponent
                    title='Chi tiết thông tin sản phẩm'
                    visible={isDetailModalOpen}
                    onCancel={() => setIsDetailModalOpen(false)}
                    footer={null}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ marginBottom: "10px" }}>
                            <span
                                style={{
                                    fontSize: "1.6rem",
                                    fontWeight: "600",
                                    marginRight: "10px",
                                }}>
                                Mã Chứng Từ:
                            </span>
                            <span
                                style={{
                                    fontSize: "1.4rem",
                                    lineHeight: "3rem",
                                }}>
                                {selectedProductData.licence}
                            </span>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <span
                                style={{
                                    fontSize: "1.6rem",
                                    fontWeight: "600",
                                    marginRight: "10px",
                                }}>
                                Nhà Cung Cấp:
                            </span>
                            <span
                                style={{
                                    fontSize: "1.4rem",
                                    lineHeight: "3rem",
                                }}>
                                {selectedProductData.supplier}
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
                                {selectedProductData.name}
                            </span>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <span
                                style={{
                                    fontSize: "1.6rem",
                                    fontWeight: "600",
                                    marginRight: "10px",
                                }}>
                                Nguồn Gốc:
                            </span>
                            <span style={{ fontSize: "1.4rem" }}>
                                {selectedProductData.origin}
                            </span>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <span
                                style={{
                                    fontSize: "1.6rem",
                                    fontWeight: "600",
                                    marginRight: "10px",
                                }}>
                                Phân Loại:
                            </span>
                            <span style={{ fontSize: "1.4rem" }}>
                                {selectedProductData.type}
                            </span>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <span
                                style={{
                                    fontSize: "1.6rem",
                                    fontWeight: "600",
                                    marginRight: "10px",
                                }}>
                                Thành Phần:
                            </span>
                            <span style={{ fontSize: "1.4rem" }}>
                                {selectedProductData.ingredient}
                            </span>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <span
                                style={{
                                    fontSize: "1.6rem",
                                    fontWeight: "600",
                                    marginRight: "10px",
                                }}>
                                Qua Cách Đóng Gói:
                            </span>
                            <span style={{ fontSize: "1.4rem" }}>
                                {selectedProductData.packaging}
                            </span>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <span
                                style={{
                                    fontSize: "1.6rem",
                                    fontWeight: "600",
                                    marginRight: "10px",
                                }}>
                                Mô Tả:
                            </span>
                            <span
                                style={{
                                    fontSize: "1.4rem",
                                    lineHeight: "3rem",
                                }}>
                                {selectedProductData.description}
                            </span>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <span
                                style={{
                                    fontSize: "1.6rem",
                                    fontWeight: "600",
                                    marginRight: "10px",
                                }}>
                                Giấy Phép Chứng Nhận:
                            </span>
                            <span
                                style={{
                                    fontSize: "1.4rem",
                                    lineHeight: "3rem",
                                }}>
                                {selectedProductData.certification}
                            </span>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <span
                                style={{
                                    fontSize: "1.6rem",
                                    fontWeight: "600",
                                    marginRight: "10px",
                                }}>
                                Ngày Nhập:
                            </span>
                            <span style={{ fontSize: "1.4rem" }}>
                                {selectedProductData.createdAt}
                            </span>
                        </div>
                    </div>
                </ModalComponent>

                {/* Delete Product */}
                <ModalComponent
                    title='Xóa sản phẩm'
                    open={isModalOpenDelete}
                    onCancel={handleCancelDelete}
                    onOk={handleDeleteProduct}>
                    <Loading isLoading={isLoadingDeleted}>
                        <div>Bạn có chắc muốn xóa sản phẩm này không?</div>
                    </Loading>
                </ModalComponent>
            </Container>
        </div>
    );
};

export default AdminProduct;
