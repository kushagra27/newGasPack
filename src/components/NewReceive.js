import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {withRouter} from 'react-router-dom';
import Sidebar from "./Sidebar";

const NewReceive = () => {
  return (
    <>
      <Container fluid>
        <Row>
          <Col lg={2} id="sidebar-wrapper">
            <Sidebar />
          </Col>
          <Col lg={10} id="page-content-wrapper">
            New Receive
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default withRouter(NewReceive);
