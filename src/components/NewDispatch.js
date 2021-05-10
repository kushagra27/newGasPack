import React from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import useForm from "./CustomHooks";
import Sidebar from "./Sidebar";
import db from "./Firestore";

const NewDispatch = () => {
  const submit = () => {
    db.collection("parties")
      .doc(`${inputs["partyName"]}`)
      .set(inputs)
      .then(() => {
        console.log("Document successfully written!");
      });
    console.log(inputs);
  };

  const { inputs, handleInputChange, handleSubmit } = useForm(submit);

  return (
    <>
      <Container fluid>
        <Row>
          <Col lg={2} id="sidebar-wrapper">
            <Sidebar />
          </Col>
          <Col lg={10} id="page-content-wrapper">
            <Row>
              <Form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-center align-items-center">
                  <Form.Group controlId="formBasicName" className="p-4">
                    <Form.Label class="font-weight-bold">Party Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Name"
                      value={inputs["partyName"]}
                      name="partyName"
                      onChange={handleInputChange}
                      required
                      list="browsers"
                    />
                    <Form.Text className="text-muted">
                      Name of the party
                    </Form.Text>
                    <datalist id="browsers">
                      <option value="Edge" />
                      <option value="Firefox" />
                      <option value="Chrome" />
                      <option value="Opera" />
                      <option value="Safari" />
                    </datalist>
                  </Form.Group>

                  <Form.Group controlId="formBasicPerson" className="p-4">
                    <Form.Label class="font-weight-bold">Contact Person</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Name"
                      value={inputs["contactPerson"]}
                      name="contactPerson"
                      onChange={handleInputChange}
                      required
                    />
                    <Form.Text className="text-muted">
                      Name of the person in contact
                    </Form.Text>
                  </Form.Group>
                  <Button type="submit" className="button"> 
                    Submit
                  </Button>
                </div>
              </Form>
            </Row>
            <Row>
              <Table
                striped
                bordered
                hover
                variant="dark"
                style={{ margin: "1.3rem" }}
              >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Party Name</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                  </tr>
                  <tr>
                    <td>Quantity</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                  </tr>
                  <tr>
                    <td>Gas Name</td>
                    <td colSpan="2">Larry the Bird</td>
                    <td>@twitter</td>
                  </tr>
                  <tr>
                    <td>Quantity</td>
                    <td colSpan="2">Larry the Bird</td>
                    <td>@twitter</td>
                  </tr>
                </tbody>
              </Table>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default withRouter(NewDispatch);
