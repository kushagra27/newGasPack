import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  return (
    <>
      <Container fluid>
        <Row>
          <Col lg={2} id="sidebar-wrapper">
            <Sidebar />
          </Col>
          <Col lg={10} id="page-content-wrapper">
            Gas deatils
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
