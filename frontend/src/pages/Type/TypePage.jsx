import React from "react";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Pagination } from "antd";
import { WrapperProducts } from "./style";
import { useLocation } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import { useEffect } from "react";
import { useState } from "react";
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import { Container, Row, Col } from "react-bootstrap";

const TypePage = () => {
    const searchProduct = useSelector((state) => state?.product?.search);
    const searchDebounce = useDebounce(searchProduct, 500);

    const { state } = useLocation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [panigate, setPanigate] = useState({
        page: 0,
        limit: 10,
        total: 1,
    });
    const fetchProductType = async (type, page, limit) => {
        setLoading(true);
        const res = await ProductService.getProductType(type, page, limit);
        if (res?.status === "OK") {
            setLoading(false);
            setProducts(res?.data);
            setPanigate({ ...panigate, total: res?.totalPage });
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (state) {
            fetchProductType(state, panigate.page, panigate.limit);
        }
    }, [state, panigate.page, panigate.limit]);

    const onChange = (current, pageSize) => {
        setPanigate({ ...panigate, page: current - 1, limit: pageSize });
    };
    return (
        <Loading isLoading={loading}>
            <Container>
                <div>
                    <Row>
                        <Col
                            lg={9}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}>
                            <WrapperProducts>
                                {products
                                    ?.filter((pro) => {
                                        if (searchDebounce === "") {
                                            return pro;
                                        } else if (
                                            pro?.name
                                                ?.toLowerCase()
                                                ?.includes(
                                                    searchDebounce?.toLowerCase()
                                                )
                                        ) {
                                            return pro;
                                        }
                                    })
                                    ?.map((product) => {
                                        return (
                                            <Col lg={4}>
                                                <CardComponent
                                                    key={product._id}
                                                    countInStock={
                                                        product.countInStock
                                                    }
                                                    description={
                                                        product.description
                                                    }
                                                    image={product.image}
                                                    name={product.name}
                                                    price={product.price}
                                                    rating={product.rating}
                                                    type={product.type}
                                                    selled={product.selled}
                                                    discount={product.discount}
                                                    id={product._id}
                                                />
                                            </Col>
                                        );
                                    })}
                            </WrapperProducts>
                            <Pagination
                                defaultCurrent={panigate.page + 1}
                                total={panigate?.total}
                                onChange={onChange}
                                style={{
                                    textAlign: "center",
                                    marginTop: "40px"
                                }}
                            />
                        </Col>
                    </Row>
                </div>
            </Container>
        </Loading>
    );
};

export default TypePage;
