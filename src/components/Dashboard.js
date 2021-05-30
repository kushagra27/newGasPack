import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import Sidebar from "./Sidebar";
import NewLogin from "./NewLogin";

const Dashboard = (props) => {
  console.log(props)
  // props.history.push('/newParty')
  return (
    <>
      <Container fluid>
        <Row>
          <Col lg={12} id="page-content-wrapper" className="mt-3">
            <NewLogin />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default withRouter(Dashboard);
