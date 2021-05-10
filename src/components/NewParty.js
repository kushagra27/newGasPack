import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import Sidebar from "./Sidebar";
import useForm from "./CustomHooks";
import db from "./Firestore";

const NewParty = () => {
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
          <Col
            lg={10}
            id="page-content-wrapper"
            className="d-flex justify-content-center"
          >
            <Card className="mt-3 card mb-3">
              <Card.Body>
                <Form onSubmit={handleSubmit} className="form">
                  <Row>
                    <Col lg={6}>
                      <Form.Group controlId="formBasicName">
                        <Form.Label class="font-weight-bold">Party Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Name"
                          value={inputs["partyName"]}
                          name="partyName"
                          onChange={handleInputChange}
                          required
                        />
                        <Form.Text className="text-muted">
                          Name of the Party
                        </Form.Text>
                      </Form.Group>

                      <Form.Group controlId="formBasicPerson">
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

                      <Form.Group controlId="formBasicSO">
                        <Form.Label class="font-weight-bold">Contact Person S/O</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Father's Name"
                          value={inputs["contactPersonSO"]}
                          name="contactPersonSO"
                          onChange={handleInputChange}
                          required
                        />
                        <Form.Text className="text-muted">Father's name</Form.Text>
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group controlId="formBasicPhone">
                        <Form.Label class="font-weight-bold">Contact Number</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter email"
                          value={inputs["partyContact"]}
                          name="partyContact"
                          onChange={handleInputChange}
                          required
                        />
                        <Form.Text className="text-muted">
                          Contact number of person
                        </Form.Text>
                      </Form.Group>

                      <Form.Group controlId="formBasicVillage">
                        <Form.Label class="font-weight-bold">Party Village</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Village"
                          value={inputs["partyVillage"]}
                          name="partyVillage"
                          onChange={handleInputChange}
                          required
                        />
                        <Form.Text className="text-muted">
                          Village of Party
                        </Form.Text>
                      </Form.Group>
                      <Form.Group controlId="formBasicCity">
                        <Form.Label class="font-weight-bold">Party City</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter City"
                          value={inputs["partyCity"]}
                          name="partyCity"
                          onChange={handleInputChange}
                          required
                        />
                        <Form.Text className="text-muted">
                          City of Party
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group controlId="formBasicAddress">
                    <Form.Label class="font-weight-bold">Party Address</Form.Label>
                    <Form.Control
                      type="text"
                      as="textarea" 
                      rows={3}
                      placeholder="Enter Address"
                      value={inputs["partyAddress"]}
                      name="partyAddress"
                      onChange={handleInputChange}
                      required
                    />
                    <Form.Text className="text-muted">
                      Address of Party
                    </Form.Text>
                  </Form.Group>

                  <div className="d-flex justify-content-center">
                    <Button type="submit" className="button">
                      Submit
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default NewParty;
