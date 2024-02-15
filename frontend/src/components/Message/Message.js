import { message } from "antd";

const success = (mes = 'THÀNH CÔNG') => {
    message.success(mes);
};

const error = (mes = 'THẤT BẠI') => {
    message.error(mes);
};

const warning = (mes = 'CHÚ Ý') => {
    message.warning(mes);
};

export { success, error, warning }