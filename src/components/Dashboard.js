import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import Sidebar from "./Sidebar";
import NewLogin from "./NewLogin";

const Dashboard = () => {
  return (
    <>
      <Container fluid>
        <Row>
          <Sidebar />

          <Col lg={10} id="page-content-wrapper" className="d-flex justify-content-between align-items-center">
            <NewLogin />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default withRouter(Dashboard);
