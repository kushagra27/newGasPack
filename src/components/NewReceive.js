import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {withRouter} from 'react-router-dom';
import NewLogin from "./NewLogin";
import NavbarLg from "./NavbarLg";
import Sidebar from "./Sidebar";

const NewReceive = () => {
  return (
    <>
    <div className="d-lg-none"><NavbarLg/></div>
      <Container fluid>
        <Row>
          <Col lg={2} id="sidebar-wrapper" className="d-xs-none d-sm-none d-xl-block d-md-block">
            <Sidebar />
          </Col>
          <Col lg={10} id="page-content-wrapper">
            New Receive
            <NewLogin/>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default withRouter(NewReceive);
