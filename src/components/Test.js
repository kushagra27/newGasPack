import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import Sidebar from "./Sidebar";
import useForm from "./CustomHooks";
import db from "./Firestore";
import NavbarLg from "./NavbarLg";

class Test extends React.Component {
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
          quantity: this.state["current" + item.gas]? parseInt(this.state["current" + item.gas]): 0
      }
      return obj
    })
    var obj = {
      partyName: this.state.partyName,
      balance: cylinders,
    }
    db.collection("suppliers")
      .doc(`${this.state.partyName}`)
      .set(obj)
      .then(() => {})
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
                    <div className="d-flex justify-content-center">
                      <Button type="submit" className="button">
                        Submit
                      </Button>
                    </div>
                    </Row>
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

export default Test;
