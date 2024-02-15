import { Button, Form, Space } from "antd";
import React from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import DrawerComponent from "../DrawerComponent";
import Loading from "../LoadingComponent/Loading";
import ModalComponent from "../ModalComponent/ModalComponent";
import { getBase64, convertDateTime } from "../../utils";
import { useEffect } from "react";
import * as message from "../../components/Message/Message";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import {
    DeleteOutlined,
    FormOutlined,
    EyeOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { Container } from "react-bootstrap";

const AdminUser = () => {
    const [rowSelected, setRowSelected] = useState("");
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedUserData, setSelectedUserData] = useState({});
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const user = useSelector((state) => state?.user);
    const searchInput = useRef(null);

    const [stateUserDetails, setStateUserDetails] = useState({
        name: "",
        email: "",
        phone: "",
        isAdmin: false,
        avatar: "",
        address: "",
        role: "",
    });

    const [form] = Form.useForm();

    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rests } = data;
        const res = UserService.updateUser(id, { ...rests }, token);
        return res;
    });

    const mutationDeletedMany = useMutationHooks((data) => {
        const { token, ...ids } = data;
        const res = UserService.deleteManyUser(ids, token);
        return res;
    });

    const handleDeleteManyUsers = (ids) => {
        mutationDeletedMany.mutate(
            { ids: ids, token: user?.access_token },
            {
                onSettled: () => {
                    queryClient.invalidateQueries(["users"]);
                },
            }
        );
    };

    const mutationDeleted = useMutationHooks((data) => {
        const { id, token } = data;
        const res = UserService.deleteUser(id, token);
        return res;
    });

    const fetchGetDetailsUser = async (rowSelected) => {
        const res = await UserService.getDetailsUser(rowSelected);
        if (res?.data) {
            setStateUserDetails({
                name: res?.data?.name,
                email: res?.data?.email,
                phone: res?.data?.phone,
                isAdmin: res?.data?.isAdmin,
                address: res?.data?.address,
                avatar: res?.data?.avatar,
                role: res?.data?.role,
            });
        }
        setIsLoadingUpdate(false);
    };

    useEffect(() => {
        form.setFieldsValue(stateUserDetails);
    }, [form, stateUserDetails]);

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true);
            fetchGetDetailsUser(rowSelected);
        }
    }, [rowSelected, isOpenDrawer]);

    const handleDetailsUser = () => {
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

    const {
        data: dataDeletedMany,
        isLoading: isLoadingDeletedMany,
        isSuccess: isSuccessDelectedMany,
        isError: isErrorDeletedMany,
    } = mutationDeletedMany;

    const queryClient = useQueryClient();
    const users = queryClient.getQueryData(["users"]);
    const isFetchingUser = useIsFetching(["users"]);

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
                        onClick={handleDetailsUser}
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
        setSelectedUserData(record);
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

    const columns = [
        {
            title: "Mã Người Dùng",
            dataIndex: "_id",
            sorter: (a, b) => a._id.length - b._id.length,
            ...getColumnSearchProps("_id"),
        },
        {
            title: "Tên Tài Khoản",
            dataIndex: "name",
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps("name"),
        },
        {
            title: "Email",
            dataIndex: "email",
            sorter: (a, b) => a.email.length - b.email.length,
            ...getColumnSearchProps("email"),
        },
        {
            title: "Phân Quyền",
            dataIndex: "isAdmin",
            filters: [
                {
                    text: "True",
                    value: true,
                },
                {
                    text: "False",
                    value: false,
                },
            ],
        },
        {
            title: "Vai Trò",
            dataIndex: "role",
            sorter: (a, b) => a.role.length - b.role.length,
            ...getColumnSearchProps("role"),
        },
        {
            title: "Hành Động",
            dataIndex: "action",
            render: (_, record) => renderAction(record),
        },
    ];

    const dataTable =
        users?.data?.length > 0 &&
        users?.data?.map((user) => {
            return {
                ...user,
                key: user._id,
                isAdmin: user.isAdmin ? "TRUE" : "FALSE",
                createdAt: convertDateTime(user?.createdAt),
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

    useEffect(() => {
        if (isSuccessDelectedMany && dataDeletedMany?.status === "OK") {
            message.success();
        } else if (isErrorDeletedMany) {
            message.error();
        }
    }, [isSuccessDelectedMany]);

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateUserDetails({
            name: "",
            email: "",
            phone: "",
            isAdmin: false,
            role: "",
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

    const handleDeleteUser = () => {
        mutationDeleted.mutate(
            { id: rowSelected, token: user?.access_token },
            {
                onSettled: () => {
                    queryClient.invalidateQueries(["users"]);
                },
            }
        );
    };

    const handleOnchangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value,
        });
    };

    const handleOnchangeAvatarDetails = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateUserDetails({
            ...stateUserDetails,
            avatar: file.preview,
        });
    };

    const onUpdateUser = () => {
        mutationUpdate.mutate(
            { id: rowSelected, token: user?.access_token, ...stateUserDetails },
            {
                onSettled: () => {
                    queryClient.invalidateQueries(["users"]);
                },
            }
        );
    };

    return (
        <div style={{ padding: "40px", width: "100%", backgroundColor: "var(--background-admin)" }}>
            <Container>
                <WrapperHeader>QUẢN LÍ TÀI KHOẢN</WrapperHeader>

                {/* Table User */}
                <div style={{ marginTop: "40px" }}>
                    <TableComponent
                        handleDelteMany={handleDeleteManyUsers}
                        columns={columns}
                        isLoading={isFetchingUser}
                        data={dataTable}
                        onRow={(record) => {
                            return {
                                onClick: (_id) => {
                                    setRowSelected(record._id);
                                },
                            };
                        }}
                    />
                </div>

                {/* Update User */}
                <DrawerComponent
                    title='CẬP NHẬT TÀI KHOẢN'
                    isOpen={isOpenDrawer}
                    onClose={() => setIsOpenDrawer(false)}
                    width='50%'>
                    <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                        <Form
                            name='basic'
                            labelCol={{ span: 2 }}
                            wrapperCol={{ span: 22 }}
                            onFinish={onUpdateUser}
                            autoComplete='on'
                            form={form}>
                            <Form.Item
                                label='Name'
                                name='name'
                                rules={[
                                    {
                                        required: false,
                                        message: "Please input your name!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateUserDetails["name"]}
                                    onChange={handleOnchangeDetails}
                                    name='name'
                                    style={{ marginLeft: "10px" }}
                                />
                            </Form.Item>
                            <Form.Item
                                label='Email'
                                name='email'
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your email!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateUserDetails["email"]}
                                    onChange={handleOnchangeDetails}
                                    name='email'
                                    style={{ marginLeft: "10px" }}
                                />
                            </Form.Item>

                            <Form.Item
                                label='Vai trò'
                                name='role'
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your role!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateUserDetails["role"]}
                                    onChange={handleOnchangeDetails}
                                    name='role'
                                    style={{ marginLeft: "10px" }}
                                />
                            </Form.Item>

                            <Form.Item
                                label='Adress'
                                name='address'
                                rules={[
                                    {
                                        required: false,
                                        message: "Please input your  address!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateUserDetails.address}
                                    onChange={handleOnchangeDetails}
                                    name='address'
                                    style={{ marginLeft: "10px" }}
                                />
                            </Form.Item>

                            <Form.Item
                                label='Phone'
                                name='phone'
                                rules={[
                                    {
                                        required: false,
                                        message: "Please input your  phone!",
                                    },
                                ]}>
                                <InputComponent
                                    value={stateUserDetails.phone}
                                    onChange={handleOnchangeDetails}
                                    name='phone'
                                    style={{ marginLeft: "10px" }}
                                />
                            </Form.Item>

                            <Form.Item
                                label='Avatar'
                                name='avatar'
                                rules={[
                                    {
                                        required: false,
                                        message: "Please input your image!",
                                    },
                                ]}>
                                <WrapperUploadFile
                                    onChange={handleOnchangeAvatarDetails}
                                    maxCount={1}>
                                    <Button style={{ marginLeft: "10px" }}>
                                        Select File
                                    </Button>
                                    {stateUserDetails?.avatar && (
                                        <img
                                            src={stateUserDetails?.avatar}
                                            style={{
                                                height: "80px",
                                                width: "80px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                                marginLeft: "20px",
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

                {/* Details User */}
                <ModalComponent
                    title='Chi tiết thông tin tài khoản'
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
                                Tên Tài Khoản:
                            </span>
                            <span style={{ fontSize: "1.4rem" }}>
                                {selectedUserData.name}
                            </span>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <span
                                style={{
                                    fontSize: "1.6rem",
                                    fontWeight: "600",
                                    marginRight: "10px",
                                }}>
                                Email:
                            </span>
                            <span style={{ fontSize: "1.4rem" }}>
                                {selectedUserData.email}
                            </span>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <span
                                style={{
                                    fontSize: "1.6rem",
                                    fontWeight: "600",
                                    marginRight: "10px",
                                }}>
                                Mật Khẩu:
                            </span>
                            <span
                                style={{
                                    fontSize: "1.4rem",
                                    wordBreak: "break-all",
                                    lineHeight: "3rem",
                                }}>
                                {selectedUserData.password}
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
                            <span style={{ fontSize: "1.4rem" }}>
                                {selectedUserData.address}
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
                            <span style={{ fontSize: "1.4rem" }}>
                                {selectedUserData.phone}
                            </span>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <span
                                style={{
                                    fontSize: "1.6rem",
                                    fontWeight: "600",
                                    marginRight: "10px",
                                }}>
                                Ngày Tạo:
                            </span>
                            <span style={{ fontSize: "1.4rem" }}>
                                {selectedUserData.createdAt}
                            </span>
                        </div>
                    </div>
                </ModalComponent>

                {/* Delete User */}
                <ModalComponent
                    title='Xóa người dùng'
                    open={isModalOpenDelete}
                    onCancel={handleCancelDelete}
                    onOk={handleDeleteUser}>
                    <Loading isLoading={isLoadingDeleted}>
                        <div>Bạn có chắc muốn xóa tài khoản này không?</div>
                    </Loading>
                </ModalComponent>
            </Container>
        </div>
    );
};

export default AdminUser;
