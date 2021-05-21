import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import Sidebar from "./Sidebar";
import useForm from "./CustomHooks";
import db from "./Firestore";
import NavbarLg from "./NavbarLg";

class NewParty extends React.Component {
  constructor(props){
    super()
    this.state = {
      inputs:{
      },
    }
  }
  componentDidMount = ()=>{

  }

  handleInputChange = (e) => {
    const {name, value} = e.target
    this.setState(inputs => ({...inputs, [name]: value}))
    // console.log(e.target.name, e.target.value)
}

handleChange = (e)=> {
  const {name, value} = e.target
  this.setState({[name]: value})
}

  handleSubmit = (e) => {
    e.preventDefault()
    const empty = {}

    const cylinders = this.props.gas.map( item =>{
      var obj = {
          gas: item.gas,
          quantity: this.state["current" + item.gas]? this.state["current" + item.gas]: 0
      }
      return obj
    })
    var obj = {
      partyName: this.state.partyName,
      contactPerson: this.state.contactPerson,
      contactPerson: this.state.contactPerson,
      contactPersonSO: this.state.contactPersonSO,
      partyContact: this.state.partyContact,
      partyCity: this.state.partyCity,
      partyVillage: this.state.partyVillage,
      partyAddress: this.state.partyAddress,
    }
    db.collection("parties")
      .doc(`${this.state.partyName}`)
      .set(obj)
      .then(() => {

        db.collection("parties").doc(`${this.state.partyName}`).collection('dispatch').doc("OB").set({challanNumber:"OB", cylinders})
          .then(() => {
            console.log("Document successfully written!");
            alert('Successfully Added')
            window.location.reload()
          });
          console.log(obj);

        console.log("Document successfully written!");
      })
    console.log(obj);
  };

  render(){
    return (
      <>
      <div className="d-lg-none"><NavbarLg/></div>
        <Container fluid>
          <Row>
            <Col lg={2} id="sidebar-wrapper" className="d-xs-none d-sm-none d-xl-block d-md-block">
              <Sidebar />
            </Col>
            <Col
              lg={10}
              id="page-content-wrapper"
              className="d-flex justify-content-center"
            >
              <Card className="mt-3 card mb-3">
                <Card.Body>
                  <Form onSubmit={this.handleSubmit} className="form">
                    <Row>
                      <Col lg={6}>
                        <Form.Group controlId="formBasicName">
                          <Form.Label class="font-weight-bold">Party Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Name"
                            value={this.state.partyName}
                            name="partyName"
                            onChange={this.handleInputChange}
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
                            value={this.state.contactPerson}
                            name="contactPerson"
                            onChange={this.handleInputChange}
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
                            value={this.state.contactPersonSO}
                            name="contactPersonSO"
                            onChange={this.handleInputChange}
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
                            value={this.state.partyContact}
                            name="partyContact"
                            onChange={this.handleInputChange}
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
                            value={this.state.partyVillage}
                            name="partyVillage"
                            onChange={this.handleInputChange}
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
                            value={this.state.partyCity}
                            name="partyCity"
                            onChange={this.handleInputChange}
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
                        value={this.state.partyAddress}
                        name="partyAddress"
                        onChange={this.handleInputChange}
                        required
                      />
                      <Form.Text className="text-muted">
                        Address of Party
                      </Form.Text>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label class="font-weight-bold">Opening Balance</Form.Label>
                      <table className="newPartytable">
                        <tr>
                          {this.props.gas.map(item =>{
                              return(<th >{item.gas}</th>)
                          })}
                        </tr>
                        <tr>
                          {this.props.gas.map(item =>{
                            return(
                              <td>
                                <input
                                  style={{width:"7rem",padding:"0.5rem 1rem 2rem 1rem", border:"none"}}
                                  placeholder="Enter Quantity"
                                  value={this.state['current'+item.gas]}
                                  name={'current'+item.gas}
                                  type="number"
                                  onChange = {this.handleChange}
                                >
                                </input>
                              </td>
                              )
                          })}
                        </tr>
                      </table>
                      <Form.Text className="text-muted">
                        Opening Balance
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
    )
  }
}

export default NewParty;
