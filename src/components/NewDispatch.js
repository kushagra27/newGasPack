import React,{useState, useEffect, useRef} from "react";
import { Container, Row, Col, Form, Button, Table, InputGroup, FormControl, Dropdown, DropdownButton } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import useForm from "./CustomHooks";
import Sidebar from "./Sidebar";
import db from "./Firestore";
import NavbarLg from "./NavbarLg";
import { render } from "@testing-library/react";

class NewDispatch extends React.Component {
  constructor(props){
    super()
    this.state = {
      inputs:{
        cylinders:[]
      },
      gasCount:1,
      components:[],
      data:[],
      currentGas:{}
    }
  }
  componentDidMount = ()=>{
    this.updateComponents()
    // const gasCount = this.state.gasCount + 1
    // this.setState({gasCount})
  }

  handleInputChange = (e) => {
    const {name, value} = e.target
    var inputs = this.state.inputs
    inputs[name] = value
    this.setState({inputs})
    console.log(e.target.name, e.target.value)
    console.log(this.state.inputs)
    console.log(this.state)
  }

  handleChange = (e) => {
    const {name, value} = e.target
    var currentGas = this.state.currentGas
    currentGas[name] = value
    this.setState({currentGas})
    console.log(e.target.name, e.target.value)
    console.log(this.state.currentGas)
    console.log(this.state)
  }
  
  handleSubmit = (e) => {
    e.preventDefault()
    var inputs = this.state.inputs
    if(!this.state.currentGas['gas'] || !this.state.currentGas['gas']){
      alert('cannot be empty')
      return
    } else if(this.state.currentGas['gas'] && this.state.currentGas['gas']){
      var cur = this.state.currentGas
        cur['sno'] = this.state.gasCount
        inputs.cylinders.push(cur)
    }
    var data = this.state.data
    data.push(inputs)
    this.setState({data},()=>{
      // console.log(inputs)
      // db.collection("parties")
      //   .doc(`${inputs["partyName"]}`)
      //   .set(inputs)
      //   .then(() => {
      //     console.log("Document successfully written!");
      //   });
    })
    console.log(this.state.inputs);
    console.log(this.state.data);
    // Object.keys(inputs).map(header =>{
    //   if(header === 'cylinders')
    //     inputs[header] = []
    //   else 
    //     inputs[header] = ''
    // })
    this.setState({inputs, gasCount:1, components:[]},()=>{
      this.updateComponents()
    })
  };

  comp = () =>{
    return(
      <>
        <Form.Group controlId="formBasicPerson">
          
        </Form.Group>

        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Label class="font-weight-bold">Gas Quantity</Form.Label>
          <InputGroup>
            <Form.Control
              type="number"
              placeholder="Enter Quantity"
              value={this.state.currentGas["qty"]}
              name={"qty"}
              onChange={this.handleChange}
              required
            />
            <InputGroup.Append>
              <Form.Control name={"gas"} value={this.state.currentGas['gas']} onChange={this.handleChange} as="select" style={{borderRadius:"0"}} required>
                <option value="">Select</option>
                <option value="O2">O2</option>
                <option value="CO2">CO2</option>
                <option value="N2">N2</option>
                <option value="H2">H2</option>
                <option value="DA">DA</option>
              </Form.Control>
            </InputGroup.Append>
            <InputGroup.Append>
              <Button style={{'marginLeft':".5rem"}} variant="outline-danger">
                Remove
              </Button>
            </ InputGroup.Append>     
          </InputGroup>
          <Form.Text className="text-muted">
              Number and type of gas
          </Form.Text>
        </Form.Group>

      </>
    )
  }
  

  updateComponents = ()=>{
    const newVal = this.state.components.concat(this.comp())
    this.setState({ components: newVal })
  }

  handleAddGas = () => {
    console.log(this.state.gasCount, this.state.inputs['cylinders'])
    if(this.state.currentGas['gas'] && this.state.currentGas['qty']){
      // const cnt = this.state.gasCount + 1
      // this.setState({gasCount: cnt},()=>{
        var cur = this.state.currentGas
        cur['sno'] = this.state.gasCount
        var inputs = this.state.inputs
        inputs.cylinders.push(cur)
        this.setState({inputs, currentGas:{}, gasCount: cur['sno'] + 1 },()=>{
          this.updateComponents()
        })
      // })
    } else {
      alert('Enter previous first')
    }
  }

  render(){
    return (
      <>
      <div className="d-lg-none"><NavbarLg/></div>
        <Container fluid>
        
          <Row>
            <Col lg={2} id="sidebar-wrapper" className="d-xs-none d-sm-none d-xl-block d-md-block">
              <Sidebar />
            </Col>
            <Col lg={10} id="page-content-wrapper">
              <Row className="d-flex justify-content-center">
                <Form onSubmit={this.handleSubmit} className="mt-2 mb-2 ">
                  <div className="card">
                    <Form.Group controlId="formBasicName" >
                      <Form.Label class="font-weight-bold">Party Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Name"
                        value={this.state.inputs["partyName"]}
                        name="partyName"
                        onChange={this.handleInputChange}
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
                        type="number"
                        placeholder="Enter Challan Number"
                        value={this.state.inputs["challanNumber"]}
                        name="challanNumber"
                        onChange={this.handleInputChange}
                        required
                      />
                      <Form.Text className="text-muted">
                        Number of Challan
                      </Form.Text>
                    </Form.Group>
  
                    {this.state.components}
  
                    <Button onClick={this.handleAddGas} className="button mb-3"> 
                      Add Another Gas
                    </Button>
  
                    <Button type="submit" className="button"> 
                      Submit
                    </Button>
                  </div>
                </Form>
              </Row>
              {
                this.state.data.length > 0?
                  <Row>
                    <Table
                      striped
                      bordered
                      hover
                      variant="dark"
                      style={{ margin: "1.3rem" }}
                    >
                      <thead>
                      {/* <tr>
                        {
                          Object.keys(data[0]).map(item =>{
                            return(
                              <th>{item}</th>
                            )
                          })
                        }
                      </tr> */}
                        <tr>
                          <th>#</th>
                          <th>Party Name</th>
                          <th>Challan Number</th>
                          <th colSpan={6} >Cylinders</th>
                        </tr>
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th>O2</th>
                          <th>CO2</th>
                          <th>N2</th>
                          <th>H2</th>
                          <th>DA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.data.map( (item,cnt) =>{
                          return(
                            <tr>
                              <td>{cnt + 1}</td>
                              <td>{item.partyName}</td>
                              <td>{item.challanNumber}</td>                            
                                {item.cylinders.map(gas =>{
                                  return(
                                    <td>
                                      {gas.qty}
                                    </td>)
                                })}
                            </tr>
                          )
                        })}
                      </tbody>
                    </Table>
                  </Row>
                :<></>
              }
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}

export default withRouter(NewDispatch);
