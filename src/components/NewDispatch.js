import React,{useState, useEffect, useRef} from "react";
import { Container, Row, Col, Form, Button, Table, InputGroup, FormControl, Dropdown, DropdownButton } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import useForm from "./CustomHooks";
import Sidebar from "./Sidebar";
import db from "./Firestore";

const NewDispatch = () => {
  const submit = () => {
    // db.collection("parties")
    //   .doc(`${inputs["partyName"]}`)
    //   .set(inputs)
    //   .then(() => {
    //     console.log("Document successfully written!");
    //   });
    console.log(inputs);
  };

  const [gasCount, setGasCount] = useState(1)
  const { inputs, handleInputChange, handleSubmit, handleSelect } = useForm(submit);
  const comp = <>
  <Form.Group controlId="formBasicPerson">
    
  </Form.Group>

  <Form.Group controlId="exampleForm.ControlSelect1">
    <Form.Label class="font-weight-bold">Gas Quantity - {gasCount}</Form.Label>
    <InputGroup>
      <Form.Control
        type="text"
        placeholder="Enter Name"
        value={inputs["qty" + gasCount]}
        name={"qty" + gasCount}
        onChange={handleInputChange}
        required
      />
      <InputGroup.Append>
        <Form.Control name={"gas" + gasCount} value={inputs['gas' + gasCount]} onChange={handleInputChange} as="select" style={{borderRadius:"0"}}>
          <option value="">Select</option>
          <option value="O2">O2</option>
          <option value="CO2">CO2</option>
          <option value="N2">N2</option>
          <option value="H2">H2</option>
          <option value="DA">DA</option>
        </Form.Control>
      </InputGroup.Append>
    </InputGroup>
    <Form.Text className="text-muted">
        Number and type of gas
      </Form.Text>
  </Form.Group>
</>
  const [components, setComponents] = useState([])

  useEffect(()=>{
    setComponents( components => [ ...components, comp] )
  },[gasCount])

  const handleAddGas = () => {
    setGasCount(gasCount + 1)
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col lg={2} id="sidebar-wrapper">
            <Sidebar />
          </Col>
          <Col lg={10} id="page-content-wrapper">
            <Row className="d-flex justify-content-center">
              <Form onSubmit={handleSubmit} className="mt-2 mb-2 ">
                <div className="card">
                  <Form.Group controlId="formBasicName" >
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

                  <Form.Group controlId="formBasicPerson" >
                    <Form.Label class="font-weight-bold">Challan Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Name"
                      value={inputs["challanNumber"]}
                      name="challanNumber"
                      onChange={handleInputChange}
                      required
                    />
                    <Form.Text className="text-muted">
                      Number of Challan
                    </Form.Text>
                  </Form.Group>

                  {components}

                  <Button onClick={handleAddGas} className="button mb-3"> 
                    Add Another Gas
                  </Button>

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
