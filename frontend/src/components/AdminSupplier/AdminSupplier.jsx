import { Button, Form, Space } from "antd";
import {
    DeleteOutlined,
    FormOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import React, { useRef, useState, useEffect } from "react";
import { WrapperHeader } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import * as ProductService from "../../services/ProductService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../LoadingComponent/Loading";
import * as message from "../Message/Message";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import { Container } from "react-bootstrap";

const AdminSupplier = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState("");
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const user = useSelector((state) => state?.user);
    const searchInput = useRef(null);
    const inittial = () => ({
        supplier: "",
        name: "",
        address: "",
        note: "",
    });
    const [stateProduct, setStateProduct] = useState(inittial());
    const [stateProductDetails, setStateProductDetails] = useState(inittial());

    const [form] = Form.useForm();

    const mutation = useMutationHooks((data) => {
        const { supplier, name, address, note } = data;
        const res = ProductService.createProduct({
            supplier,
            name,
            address,
            note,
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
                supplier: res?.data?.supplier,
                address: res?.data?.address,
                note: res?.data?.note,
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

    const renderAction = () => {
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

    const columns = [
        {
            title: "Tên Nhà Cung Cấp",
            dataIndex: "supplier",
            sorter: (a, b) => a.supplier.length - b.supplier.length,
            ...getColumnSearchProps("supplier"),
        },

        {
            title: "Địa Chỉ",
            dataIndex: "address",
            sorter: (a, b) => a.address.length - b.address.length,
            ...getColumnSearchProps("address"),
        },
        {
            title: "Ghi Chú",
            dataIndex: "note",
            sorter: (a, b) => a.note.length - b.note.length,
            ...getColumnSearchProps("note"),
        },
        {
            title: "Mã ID Sản Phẩm",
            dataIndex: "_id",
            sorter: (a, b) => a._id.length - b._id.length,
            ...getColumnSearchProps("name"),
        },
        {
            title: "Hành Động",
            dataIndex: "action",
            render: renderAction,
        },
    ];
    const dataTable =
        products?.data?.length &&
        products?.data?.map((product) => {
            return { ...product, key: product._id };
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
            supplier: "",
            name: "",
            address: "",
            note: "",
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
            supplier: "",
            name: "",
            address: "",
            note: "",
        });
        form.resetFields();
    };

    const handleOnchangeDetails = (e) => {
        setStateProductDetails({
            ...stateProductDetails,
            [e.target.name]: e.target.value,
        });
    };

    const onUpdateProduct = () => {
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

    return (
        <div
            style={{
                padding: "40px",
                width: "100%",
                backgroundColor: "var(--background-admin)",
            }}>
            <Container>
                <WrapperHeader>DANH MỤC NHÀ CUNG CẤP</WrapperHeader>

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
                    title='CẬP NHẬT NHÀ CUNG CẤP'
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
                                label='Tên Nhà Cung Cấp'
                                name='supplier'
                                rules={[
                                    {
                                        required: false,
                                        message: "Please input your supplier!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateProductDetails.supplier}
                                    onChange={handleOnchangeDetails}
                                    name='supplier'
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
                                label='Địa chỉ'
                                name='address'
                                rules={[
                                    {
                                        required: false,
                                        message: "Please input your address!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateProductDetails.address}
                                    onChange={handleOnchangeDetails}
                                    name='address'
                                />
                            </Form.Item>
                            <Form.Item
                                label='Ghi Chú'
                                name='note'
                                rules={[
                                    {
                                        required: false,
                                        message: "Please input your note!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateProductDetails.note}
                                    onChange={handleOnchangeDetails}
                                    name='note'
                                />
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                                <Button type='primary' htmlType='submit'>
                                    Apply
                                </Button>
                            </Form.Item>
                        </Form>
                    </Loading>
                </DrawerComponent>

                {/* Delete Product */}
                <ModalComponent
                    title='XOÁ NHÀ CUNG CẤP'
                    open={isModalOpenDelete}
                    onCancel={handleCancelDelete}
                    onOk={handleDeleteProduct}>
                    <Loading isLoading={isLoadingDeleted}>
                        <div>Bạn có chắc muốn xóa nhà cung cấp này không?</div>
                    </Loading>
                </ModalComponent>
            </Container>
        </div>
    );
};

export default AdminSupplier;
