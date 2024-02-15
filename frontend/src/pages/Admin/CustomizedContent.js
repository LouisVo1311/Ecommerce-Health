import {
    IdcardOutlined,
    AppstoreAddOutlined,
    ShoppingOutlined,
} from "@ant-design/icons";

function CustomizedContent(props) {
    const { data, colors, setKeySelected } = props;

    return (
        <div
            style={{
                display: "flex",
                gap: "20px",
                justifyItems: "center",
                marginTop: "40px",
            }}>
            {Object.keys(data) &&
                Object.keys(data)?.map((item) => {
                    return (
                        <div
                            key={Math.random()}
                            style={{
                                width: 270,
                                background: `linear-gradient(${
                                    colors[item] && colors[item][0]
                                }, ${colors[item] && colors[item][1]})`,
                                height: 162,
                                display: "flex",
                                padding: "20px",
                                boxShadow: "0 0 1px rgba(0,0,0,.125), 0 1px 3px rgba(0,0,0,.2)",
                                justifyContent: "space-between",
                                alignItems: "center",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                            onClick={() => setKeySelected(item)}>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}>
                                <span
                                    style={{
                                        color: "#fff",
                                        fontSize: "3.5rem",
                                        fontWeight: "600",
                                    }}>
                                    {data[item]}
                                </span>
                                <span
                                    style={{
                                        color: "#fff",
                                        fontSize: "2.2rem",
                                    }}>
                                    {item}
                                </span>
                            </div>
                            <span style={{ color: "#fff" }}>
                                {item === "users" && <IdcardOutlined style={{ fontSize: "7rem"}}/>}
                                {item === "products" && <AppstoreAddOutlined style={{ fontSize: "7rem"}}/>}
                                {item === "orders" && <ShoppingOutlined style={{ fontSize: "7rem"}}/>}
                            </span>
                        </div>
                    );
                })}
        </div>
    );
}

export default CustomizedContent;
