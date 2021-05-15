import React from 'react'
import { Container, Row, Col, Form, Button, Card, Spinner } from "react-bootstrap";
import Sidebar from "./Sidebar";
import db from "./Firestore";
import NavbarLg from "./NavbarLg";
import { withRouter } from 'react-router';
import DatePicker from "react-date-picker";

class DailyStock extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            currentParty:'',
            data:[],
            gas: this.props.gas,
            total:[
                {
                    gas:'O2',
                    quantity: 0
                },
                {
                    gas:'CO2',
                    quantity: 0
                },
                {
                    gas:'N2',
                    quantity: 0
                },
                {
                    gas:'DA',
                    quantity: 0
                },
                {
                    gas:'N20',
                    quantity: 0
                },
            ],
            selectedDate:'',
            loading: false
        }
    }

    componentDidMount = ()=>{
        console.log(this.props.gas)
        this.setState({selectedDate: new Date()})
    }

    componentDidUpdate = ()=>{
        
    }

    handleChange = (e)=>{
        const {name, value} = e.target
        this.setState({[name]: value})
    }

    handleSubmit = (e)=>{
        e.preventDefault()
        if( !(this.state.currentParty && this.state.currentChallan && (this.state.currentO2 || this.state.currentCO2 || this.state.currentN2 || this.state.currentDA || this.state.currentN20))){
            alert('cannot be empty')
            return
        } 
        const entry = {
            partyName: this.state.currentParty,
            challanNumber: this.state.currentChallan,
            cylinders: [
                {
                    gas:'O2',
                    quantity: this.state.currentO2? this.state.currentO2: 0
                },
                {
                    gas:'CO2',
                    quantity: this.state.currentCO2? this.state.currentCO2: 0
                },
                {
                    gas:'N2',
                    quantity: this.state.currentN2? this.state.currentN2: 0
                },
                {
                    gas:'DA',
                    quantity: this.state.currentDA? this.state.currentDA: 0
                },
                {
                    gas:'N20',
                    quantity: this.state.currentN20? this.state.currentN20: 0
                },
            ],
            soldFrom: this.state.currentLocation
        }

        var total = this.state.total

        entry.cylinders.map(item =>{
            total.map(totItem =>{
                if(totItem.gas === item.gas){
                    totItem.quantity += parseInt(item.quantity)
                }
            })
        })

        const data = this.state.data
        data.push(entry)
        this.setState({
            data, 
            total, 
            currentParty: '',
            currentChallan: '',
            currentO2: '',
            currentCO2: '',
            currentN2: '',
            currentDA: '',
            currentN20: '',
        })
        console.log(entry)
    }

    handleRemove = (challanNumber)=>{
        var data = this.state.data
        var total = this.state.total
        var arr=[]
        data.map(item => {
            if(item.challanNumber === challanNumber){
                item.cylinders.map(item =>{
                    total.map(totItem =>{
                        if(totItem.gas === item.gas){
                            totItem.quantity -= parseInt(item.quantity)
                        }
                    })
                })

            } else {
                arr.push(item)
            }
        })

        console.log(
            arr, total
        )
        this.setState({data: arr, total})
    }

    createGas = ()=>{
        return (
            this.props.gas.map(item =>{
                return(
                    <td>
                        <input
                            type="number"
                            placeholder={`Enter ${item.gas}`}
                            value={this.state["current"+item]}
                            name={`current${item.gas}`}
                            onChange={this.handleChange}
                        >
                        </input>
                    </td>
                )
            })
        )
    }

    handleUpload = ()=>{
        
    }

    render(){
        return(
            this.state.loading?
            <Spinner animation="border">

            </Spinner>
            :
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
                        >
                            <div>
                                <DatePicker dateFormat="dd/mm/yyyy" value={this.state.selectedDate} onChange={date => this.setState({selectedDate: date})} />
                            </div>

                            <table
                                style={{borderStyle:"solid",borderWidth:"1px"}}
                            >
                                <tr>
                                    <th colSpan={4 + this.props.gas.length}>Filled / Dispatch</th>
                                </tr>
                                <tr>
                                    <th>Party Name</th>
                                    <th>Challan Number</th>
                                    <th>Location</th>
                                    <th colSpan={this.props.gas.length}>Cylinder Quantity</th>
                                    <th>Action</th>
                                </tr>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    {this.state.gas.map(item =>{
                                        return(<th>{item.gas}</th>)
                                    })}
                                    <th></th>
                                    <th></th>
                                </tr>
                                <tr>
                                    <td>
                                        <input 
                                            type="text"
                                            placeholder="Enter Party Name"
                                            value={this.state.currentParty}
                                            name="currentParty"
                                            onChange={this.handleChange}
                                        >
                                        </input>
                                    </td>
                                    <td>
                                        <input 
                                            type="number"
                                            placeholder="Enter Challan Number"
                                            value={this.state.currentChallan}
                                            name="currentChallan"
                                            onChange={this.handleChange}
                                        >
                                        </input>
                                    </td>
                                    
                                    <td>
                                        <select 
                                            as="select"
                                            placeholder=""
                                            value={this.state.currentLocation}
                                            name="currentLocation"
                                            onChange={this.handleChange}
                                        >
                                            <option value="">Select</option>
                                            <option value="SHOP">SHOP</option>
                                            <option value="CBJ">CBJ</option>
                                        </select>
                                    </td>
                                    {
                                        this.createGas()
                                    }
                                    <td>
                                        <Button onClick={this.handleSubmit}>
                                            Submit
                                        </Button>
                                    </td>
                                </tr>
                                {this.state.data.length>0?
                                <>
                                    {this.state.data.map(item =>{
                                        return(
                                            <tr>
                                                <td>{item.partyName}</td>
                                                <td>{item.challanNumber}</td>
                                                <td>{item.soldFrom}</td>
                                                {item.cylinders.map( gas =>{
                                                    return(
                                                        <td>{gas.quantity}</td>
                                                    )
                                                })}
                                                <td>
                                                    <Button
                                                        variant="outline-danger"
                                                        onClick= {()=>{this.handleRemove(item.challanNumber)}}
                                                    >
                                                        Remove
                                                    </Button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    <tr>
                                        <th>Total</th>
                                        <th></th>
                                        {
                                            this.state.total.map(item =>{
                                                return(
                                                    <th>{item.quantity}</th>
                                                )
                                            })
                                        }
                                    </tr>
                                    </>
                                :<></>}
                            </table>
                            <Button onClick={this.handleUpload}>
                                Upload
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
}

export default withRouter(DailyStock)