import { Table } from "antd";
import React, { useState } from "react";
import Loading from "../../components/LoadingComponent/Loading";
import { Excel } from "antd-table-saveas-excel";
import { DeleteOutlined } from "@ant-design/icons";
import { useMemo } from "react";

const TableComponent = (props) => {
    const {
        selectionType = "checkbox",
        data: dataSource = [],
        isLoading = false,
        columns = [],
        handleDelteMany,
    } = props;
    const [rowSelectedKeys, setRowSelectedKeys] = useState([]);
    const newColumnExport = useMemo(() => {
        const arr = columns?.filter((col) => col.dataIndex !== "action");
        return arr;
    }, [columns]);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKeys(selectedRowKeys);
        },
        // getCheckboxProps: (record) => ({
        //   disabled: record.name === 'Disabled User',
        //   // Column configuration not to be checked
        //   name: record.name,
        // }),
    };

    const handleDeleteAll = () => {
        handleDelteMany(rowSelectedKeys);
    };

    const exportExcel = () => {
        const excel = new Excel();
        excel
            .addSheet("Excel")
            .addColumns(newColumnExport)
            .addDataSource(dataSource, {
                str2Percent: true,
            })
            .saveAs("Excel.xlsx");
    };

    return (
        <Loading isLoading={isLoading}>
            <button
                onClick={exportExcel}
                style={{
                    fontWeight: "600",
                    padding: "5px",
                    fontSize: "14px",
                    backgroundColor: "#343a40",
                    color: "#fff",
                    margin: "0px 0 30px 0",
                }}>
                EXCEL
            </button>

            {!!rowSelectedKeys.length && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                    onClick={handleDeleteAll}>
                    <DeleteOutlined style={{ color: "black" }} />
                    <span
                        style={{
                            fontWeight: "600",
                            fontSize: "14px",
                            cursor: "pointer",
                            marginLeft: "5px",
                        }}>
                        Xóa tất cả
                    </span>
                </div>
            )}
                <Table
                    style={{ width: "100%" }}
                    rowSelection={{
                        type: selectionType,
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={dataSource}
                    {...props}
                />
        </Loading>
    );
};

export default TableComponent;
