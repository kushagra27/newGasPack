import React, {useState, useEffect} from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Sidebar from "./Sidebar";
import useForm from './CustomHooks'
import db from './Firestore'


const NewParty = () => {
    const submit = ()=>{
        db.collection('parties').doc(`${inputs['partyName']}`).set(inputs).then(()=>{
            console.log("Document successfully written!");
        })
        console.log(inputs)
    }


    const {inputs, handleInputChange, handleSubmit} = useForm(submit);


    return (
        <>
        <Container fluid>
            <Row>
            <Col lg={2} id="sidebar-wrapper">
                <Sidebar />
            </Col>
            <Col lg={10} id="page-content-wrapper">
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Party Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Name" value={inputs['partyName']} name="partyName" onChange={handleInputChange} required />
                        <Form.Text className="text-muted">
                            Name of the Party
                        </Form.Text>
                    </Form.Group>
 
                    <Form.Group controlId="formBasicPerson">
                        <Form.Label>Contact Person</Form.Label>
                        <Form.Control type="text" placeholder="Enter Name" value={inputs['contactPerson']} name="contactPerson" onChange={handleInputChange} required />
                        <Form.Text className="text-muted">
                            Name of the person in contact
                        </Form.Text>
                    </Form.Group>
                    
                    <Form.Group controlId="formBasicSO">
                        <Form.Label>Contact Person S/O</Form.Label>
                        <Form.Control type="text" placeholder="Enter Father's Name" value={inputs['contactPersonSO']} name="contactPersonSO" onChange={handleInputChange} required />
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPhone">
                        <Form.Label>Contact Number</Form.Label>
                        <Form.Control type="number" placeholder="Enter email" value={inputs['partyContact']} name="partyContact" onChange={handleInputChange} required />
                        <Form.Text className="text-muted">
                            Contact number of person
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicAddress">
                        <Form.Label>Party Address</Form.Label>
                        <Form.Control type="text" placeholder="Enter Address" value={inputs['partyAddress']} name="partyAddress" onChange={handleInputChange} required />
                        <Form.Text className="text-muted">
                            Address of Party
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicCity">
                        <Form.Label>Party City</Form.Label>
                        <Form.Control type="text" placeholder="Enter City" value={inputs['partyCity']} name="partyCity" onChange={handleInputChange} required />
                        <Form.Text className="text-muted">
                            City of Party
                        </Form.Text>
                    </Form.Group>
                    
                    <Form.Group controlId="formBasicVillage">
                        <Form.Label>Party Village</Form.Label>
                        <Form.Control type="text" placeholder="Enter Village" value={inputs['partyVillage']} name="partyVillage" onChange={handleInputChange} required />
                        <Form.Text className="text-muted">
                            Village of Party
                        </Form.Text>
                    </Form.Group>

                    <Button type='submit' variant="primary">
                        Submit
                    </Button>
                </Form>
            </Col>
            </Row>
        </Container>
        </>
    );
};

export default NewParty;
