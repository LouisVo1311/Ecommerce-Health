import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent";
import { Container } from "react-bootstrap";

const ProductDetailsPage = () => {
    const { id } = useParams();
    
    return (
        <Container fluid="lg">
            <div>
                <div style={{ display: "flex", alignContent: "center" }}>
                    <Link to='/'>
                        <h4 style={{ color: "var(--popular-color)" }}>
                            Trang chủ
                        </h4>
                    </Link>
                    <h4 style={{ margin: "0 5px" }}>/</h4>
                    <h4
                        style={{
                            fontWeight: "600",
                        }}>
                        CHI TIẾT SẢN PHẨM
                    </h4>
                </div>

                <ProductDetailsComponent idProduct={id} />
            </div>
        </Container>
    );
};

export default ProductDetailsPage;
