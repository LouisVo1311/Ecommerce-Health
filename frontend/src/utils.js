import { orderContant } from "./contant";
import { format } from "date-fns";

export const isJsonString = (data) => {
    try {
        JSON.parse(data);
    } catch (error) {
        return false;
    }
    return true;
};

export const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

export const renderOptions = (arr) => {
    let results = [];
    if (arr) {
        results = arr?.map((opt) => {
            return {
                value: opt,
                label: opt,
            };
        });
    }
    results.push({
        label: "Thêm Phân Loại",
        value: "add_type",
    });
    return results;
};

export const renderOptionsSupplier = (array) => {
    let result = [];
    if (array) {
        result = array?.map((op) => {
            return {
                value: op,
                label: op,
            };
        });
    }
    result.push({
        label: "Thêm Nhà Cung Cấp",
        value: "add_supplier",
    });
    return result;
};

export const convertPrice = (price) => {
    try {
        const result = price?.toLocaleString().replaceAll(",", ".");
        return `${result} VND`;
    } catch (error) {
        return null;
    }
};

export const convertDateTime = (dateTimeString) => {
    try {
        const dateTime = new Date(dateTimeString);
        const result = format(dateTime, "dd-MM-yyyy HH:mm");
        return result;
    } catch (error) {
        console.error("Error converting date time:", error);
        return null;
    }
};

export const convertDataChart = (data, type) => {
    try {
        const object = {};
        Array.isArray(data) &&
            data.forEach((opt) => {
                if (!object[opt[type]]) {
                    object[opt[type]] = 1;
                } else {
                    object[opt[type]] += 1;
                    console.log(
                        "c;getBase64",
                        object[opt[type]],
                        typeof object[opt[type]]
                    );
                }
            });
        const results =
            Array.isArray(Object.keys(object)) &&
            Object.keys(object).map((item) => {
                return {
                    name: orderContant.payment[item],
                    value: object[item],
                };
            });
        return results;
    } catch (e) {
        return [];
    }
};
