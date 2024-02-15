import { Button, Form, Select } from "antd";
import React from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import { useState } from "react";
import InputComponent from "../InputComponent/InputComponent";
import { getBase64, renderOptions, renderOptionsSupplier } from "../../utils";
import * as ProductService from "../../services/ProductService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../LoadingComponent/Loading";
import { useEffect } from "react";
import * as message from "../Message/Message";
import { useQuery } from "@tanstack/react-query";
import { Container } from "react-bootstrap";

const AdminCreateProduct = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState("");
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

    const inittial = () => ({
        name: "",
        price: "",
        priceImport: "",
        ingredient: "",
        certification: "",
        licence: "",
        description: "",
        image: "",
        type: "",
        supplier: "",
        address: "",
        note: "",
        countInStock: "",
        newType: "",
        newSupplier: "",
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
            priceImport,
            ingredient,
            certification,
            licence,
            description,
            image,
            type,
            supplier,
            address,
            note,
            countInStock,
            discount,
            origin,
            packaging,
            exp,
        } = data;

        const res = ProductService.createProduct({
            name,
            price,
            priceImport,
            ingredient,
            certification,
            licence,
            description,
            image,
            type,
            supplier,
            address,
            note,
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
                priceImport: res?.data?.priceImport,
                ingredient: res?.data?.ingredient,
                certification: res?.data?.certification,
                licence: res?.data?.licence,
                description: res?.data?.description,
                image: res?.data?.image,
                type: res?.data?.type,
                supplier: res?.data?.supplier,
                address: res?.data?.address,
                note: res?.data?.note,
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

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct();
        return res;
    };

    const fetchAllSupplierProduct = async () => {
        const res = await ProductService.getAllSupplierProduct();
        return res;
    };

    const { data, isLoading, isSuccess, isError } = mutation;
    const {
        data: dataUpdated,
        isSuccess: isSuccessUpdated,
        isError: isErrorUpdated,
    } = mutationUpdate;
    const {
        data: dataDeleted,
        isSuccess: isSuccessDelected,
        isError: isErrorDeleted,
    } = mutationDeleted;
    const {
        data: dataDeletedMany,
        isSuccess: isSuccessDelectedMany,
        isError: isErrorDeletedMany,
    } = mutationDeletedMany;

    const queryProduct = useQuery({
        queryKey: ["products"],
        queryFn: getAllProducts,
    });

    const typeProduct = useQuery({
        queryKey: ["type-product"],
        queryFn: fetchAllTypeProduct,
    });

    const supplierProduct = useQuery({
        queryKey: ["supplier-product"],
        queryFn: fetchAllSupplierProduct,
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
            priceImport: "",
            ingredient: "",
            certification: "",
            licence: "",
            description: "",
            image: "",
            type: "",
            supplier: "",
            address: "",
            note: "",
            countInStock: "",
            discount: "",
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

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({
            name: "",
            price: "",
            priceImport: "",
            ingredient: "",
            certification: "",
            licence: "",
            description: "",
            image: "",
            type: "",
            supplier: "",
            address: "",
            note: "",
            countInStock: "",
            discount: "",
            origin: "",
            packaging: "",
            exp: "",
        });
        form.resetFields();
    };

    const onFinish = () => {
        const params = {
            name: stateProduct.name,
            price: stateProduct.price,
            priceImport: stateProduct.priceImport,
            ingredient: stateProduct.ingredient,
            certification: stateProduct.certification,
            licence: stateProduct.licence,
            description: stateProduct.description,
            image: stateProduct.image,
            type:
                stateProduct.type === "add_type"
                    ? stateProduct.newType
                    : stateProduct.type,
            supplier:
                stateProduct.supplier === "add_supplier"
                    ? stateProduct.newSupplier
                    : stateProduct.supplier,
            address: stateProduct.address,
            note: stateProduct.note,
            countInStock: stateProduct.countInStock,
            discount: stateProduct.discount,
            origin: stateProduct.origin,
            packaging: stateProduct.packaging,
            exp: stateProduct.exp,
        };
        mutation.mutate(params, {
            onSettled: () => {
                queryProduct.refetch();
            },
        });
    };

    const handleOnchange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value,
        });
    };

    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview,
        });
    };

    const handleChangeSelectType = (value) => {
        setStateProduct({
            ...stateProduct,
            type: value,
        });
    };

    const handleChangeSelectSupplier = (value) => {
        setStateProduct({
            ...stateProduct,
            supplier: value,
        });
    };

    return (
        <div style={{ padding: "40px", width: "100%", backgroundColor: "var(--background-admin)" }} >
            <Container>
                <WrapperHeader>THÊM SẢN PHẨM</WrapperHeader>
                <div style={{ padding: "0px 250px", marginTop: "20px" }}>
                    <Loading isLoading={isLoading}>
                        <Container>
                            <Form
                                name='basic'
                                onFinish={onFinish}
                                autoComplete='on'
                                form={form}>
                                <Form.Item
                                    label='Tên Sản Phẩm'
                                    name='name'
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng nhập đầy đủ thông tin sản phẩm!",
                                        },
                                    ]}>
                                    <InputComponent
                                        value={stateProduct["name"]}
                                        onChange={handleOnchange}
                                        name='name'
                                    />
                                </Form.Item>
                                <div>
                                    <Form.Item
                                        label='Nguồn Gốc'
                                        name='origin'
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập đầy đủ thông tin sản phẩm!",
                                            },
                                        ]}>
                                        <InputComponent
                                            value={stateProduct.origin}
                                            onChange={handleOnchange}
                                            name='origin'
                                        />
                                    </Form.Item>
                                </div>
                                <div>
                                    <Form.Item
                                        label='Phân Loại'
                                        name='type'
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập đầy đủ thông tin sản phẩm!",
                                            },
                                        ]}>
                                        <Select
                                            name='type'
                                            value={stateProduct.type}
                                            onChange={handleChangeSelectType}
                                            options={renderOptions(
                                                typeProduct?.data?.data
                                            )}
                                        />
                                    </Form.Item>
                                </div>
                                <div>
                                    {stateProduct.type === "add_type" && (
                                        <Form.Item
                                            label='Thêm Phân Loại'
                                            name='newType'
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng nhập đầy đủ thông tin sản phẩm!",
                                                },
                                            ]}>
                                            <InputComponent
                                                value={stateProduct.newType}
                                                onChange={handleOnchange}
                                                name='newType'
                                            />
                                        </Form.Item>
                                    )}
                                </div>
                                <div>
                                    <Form.Item
                                        label='Thành Phần'
                                        name='ingredient'
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập đầy đủ thông tin sản phẩm!",
                                            },
                                        ]}>
                                        <InputComponent
                                            value={stateProduct.ingredient}
                                            onChange={handleOnchange}
                                            name='ingredient'
                                        />
                                    </Form.Item>
                                </div>
                                <div>
                                    <Form.Item
                                        label='Mã Chứng Từ'
                                        name='licence'
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập đầy đủ thông tin sản phẩm!",
                                            },
                                        ]}>
                                        <InputComponent
                                            value={stateProduct.licence}
                                            onChange={handleOnchange}
                                            name='licence'
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label='Chứng Nhận Cấp Phép'
                                        name='certification'
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập đầy đủ thông tin sản phẩm!",
                                            },
                                        ]}>
                                        <InputComponent
                                            value={stateProduct.certification}
                                            onChange={handleOnchange}
                                            name='certification'
                                        />
                                    </Form.Item>
                                </div>
                                <div style={{ marginLeft: "10px" }}>
                                    <Form.Item
                                        label='Mô Tả'
                                        name='description'
                                        rules={[
                                            {
                                                required: false,
                                                message:
                                                    "Vui lòng nhập đầy đủ thông tin sản phẩm!",
                                            },
                                        ]}>
                                        <InputComponent
                                            value={stateProduct.description}
                                            onChange={handleOnchange}
                                            name='description'
                                        />
                                    </Form.Item>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}>
                                    <Form.Item
                                        label='Hạn Sử Dụng'
                                        name='exp'
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập đầy đủ thông tin sản phẩm!",
                                            },
                                        ]}>
                                        <InputComponent
                                            value={stateProduct.exp}
                                            onChange={handleOnchange}
                                            name='exp'
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        style={{ marginLeft: "10px" }}
                                        label='Quy Cách'
                                        name='packaging'
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập đầy đủ thông tin sản phẩm!",
                                            },
                                        ]}>
                                        <InputComponent
                                            value={stateProduct.packaging}
                                            onChange={handleOnchange}
                                            name='packaging'
                                        />
                                    </Form.Item>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}>
                                    <Form.Item
                                        label='Giá Nhập'
                                        name='priceImport'
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập đầy đủ thông tin sản phẩm!",
                                            },
                                        ]}>
                                        <InputComponent
                                            value={stateProduct.priceImport}
                                            onChange={handleOnchange}
                                            name='priceImport'
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label='Giá Bán'
                                        name='price'
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập đầy đủ thông tin sản phẩm!",
                                            },
                                        ]}>
                                        <InputComponent
                                            value={stateProduct.price}
                                            onChange={handleOnchange}
                                            name='price'
                                        />
                                    </Form.Item>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}>
                                    <Form.Item
                                        label='Tồn Kho'
                                        name='countInStock'
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập đầy đủ thông tin sản phẩm!",
                                            },
                                        ]}>
                                        <InputComponent
                                            value={stateProduct.countInStock}
                                            onChange={handleOnchange}
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
                                                    "Vui lòng nhập đầy đủ thông tin sản phẩm!",
                                            },
                                        ]}>
                                        <InputComponent
                                            value={stateProduct.discount}
                                            onChange={handleOnchange}
                                            name='discount'
                                        />
                                    </Form.Item>
                                </div>
                                <div>
                                    <Form.Item
                                        label='Nhà Cung Cấp'
                                        name='supplier'
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập đầy đủ thông tin sản phẩm!",
                                            },
                                        ]}>
                                        <Select
                                            name='supplier'
                                            value={stateProduct.supplier}
                                            onChange={handleChangeSelectSupplier}
                                            options={renderOptionsSupplier(
                                                supplierProduct?.data?.data
                                            )}
                                        />
                                    </Form.Item>
                                </div>
                                <div>
                                    {stateProduct.supplier ===
                                        "add_supplier" && (
                                        <Form.Item
                                            label='Thêm Nhà Cung Cấp'
                                            name='newSupplier'
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng nhập đầy đủ thông tin sản phẩm!",
                                                },
                                            ]}>
                                            <InputComponent
                                                value={stateProduct.newSupplier}
                                                onChange={handleOnchange}
                                                name='newSupplier'
                                            />
                                        </Form.Item>
                                    )}
                                </div>
                                <Form.Item
                                    label='Địa Chỉ'
                                    name='address'
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng nhập đầy đủ thông tin sản phẩm!",
                                        },
                                    ]}>
                                    <InputComponent
                                        value={stateProduct.address}
                                        onChange={handleOnchange}
                                        name='address'
                                    />
                                </Form.Item>
                                <Form.Item
                                    label='Ghi Chú'
                                    name='note'
                                    rules={[
                                        {
                                            required: false,
                                            message:
                                                "Vui lòng nhập đầy đủ thông tin sản phẩm!",
                                        },
                                    ]}>
                                    <InputComponent
                                        value={stateProduct.address}
                                        onChange={handleOnchange}
                                        name='note'
                                    />
                                </Form.Item>
                                <Form.Item
                                    label='Hình Ảnh'
                                    name='image'
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng nhập đầy đủ thông tin sản phẩmimage!",
                                        },
                                    ]}>
                                    <WrapperUploadFile
                                        onChange={handleOnchangeAvatar}
                                        maxCount={1}>
                                        <Button>Select File</Button>
                                        {stateProduct?.image && (
                                            <img
                                                src={stateProduct?.image}
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
                                <div style={{ marginTop: "20px" }}>
                                    <Form.Item
                                        wrapperCol={{
                                            offset: 20,
                                            span: 16,
                                        }}>
                                        <Button
                                            type='primary'
                                            htmlType='submit'>
                                            Tạo
                                        </Button>
                                    </Form.Item>
                                </div>
                            </Form>
                        </Container>
                    </Loading>
                </div>
            </Container>
        </div>
    );
};

export default AdminCreateProduct;
