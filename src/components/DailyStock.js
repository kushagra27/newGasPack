import React from 'react'
import { Container, Row, Col, Form, Button, Card, Spinner,Table, Tab, Tabs } from "react-bootstrap";
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
            total:[],
            selectedDate:'',
            loading: true,
            partyNamesDL:[],
            locationWiseEntry:{},
            displayData:{
                SHOP:{},
                CBJ:{}
            }
        }
    }

    componentDidMount = ()=>{
        // console.log(this.props.gas)
        this.setState({selectedDate: new Date()})
        var partyNamesDL = this.props.partyNames.map(item =>{
            return(<option value={item} >{item}</option>)
        })

        this.setTotal()

        var displayData = this.state.displayData
        db.collection('stocks').doc('SHOP').collection(this.handleDate(new Date())).get().then(qs =>{
            qs.forEach((doc) => {
                displayData['SHOP'][doc.id] = doc.data()
            });
            db.collection('stocks').doc('CBJ').collection(this.handleDate(new Date())).get().then(qs =>{
                qs.forEach((doc) => {
                    displayData['CBJ'][doc.id] = doc.data()
                });
                console.log(displayData)
                this.setState({partyNamesDL, displayData, loading:false })
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }

    handleChange = (e)=>{
        const {name, value} = e.target
        this.setState({[name]: value})
    }

    handleDate = date => {
        const a = date.getDate()
        const b = date.getFullYear()
        const c = date.getMonth()+1
        const e = a+"-"+c+'-'+b
        
        return e
    }

    changeDate = (date) =>{
        this.setState({selectedDate: date, loading: true})
        var displayData = {
            SHOP:{},
            CBJ:{}
        }
        db.collection('stocks').doc('SHOP').collection(this.handleDate(date)).get().then(qs =>{
            qs.forEach((doc) => {
                console.log(doc.id, doc.data())
                displayData['SHOP'][doc.id] = doc.data()
            });
            db.collection('stocks').doc('CBJ').collection(this.handleDate(date)).get().then(qs =>{
                qs.forEach((doc) => {
                    console.log(doc.id, doc.data())
                    displayData['CBJ'][doc.id] = doc.data()
                });
                console.log(displayData)
                this.setState({displayData, loading:false })
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

    }

    setTotal = () =>{
        const total = this.props.gas.map( item =>{
            var obj = {
                gas: item.gas,
                quantity: 0
            }
            return obj
        })
        this.setState({total})
    }

    showDispatch = (loc)=>{
        var comp = this.state.displayData[loc]["filled"]?
            this.state.displayData[loc]["filled"]["challans"].map(item =>{
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
                    </tr>
                )
            }) 
            : []

            var total = this.props.gas.map( item =>{
                var obj = {
                    gas: item.gas,
                    quantity: 0
                }
                return obj
            })

            if(this.state.displayData[loc]["filled"]){
                this.state.displayData[loc]["filled"]["challans"].map( item =>{
                    item.cylinders.map(item =>{
                        total.map(totItem =>{
                            if(totItem.gas === item.gas){
                                totItem.quantity += parseInt(item.quantity)
                            }
                        })
                    })
                })
    
                console.log(total)
    
                const arr = [
                    <tr>
                        <th>Total</th>
                        <th></th>
                        <th></th>
                        {
                            total.map(item =>{
                                return(
                                    <th>{item.quantity}</th>
                                )
                            })
                        }
                    </tr>
                ]
                comp.push(arr)
            }
        console.log(comp)
        return comp
    }

    showReceive = (loc) =>{
        var comp
        if(this.state.displayData[loc]['empty'])
            comp = 
                this.state.displayData[loc]["empty"]["er"].map(item =>{
                    return(
                        <tr>
                            <td>{item.partyName}</td>
                            <td>{item.erNumber}</td>
                            <td>{item.soldFrom}</td>
                            {item.cylinders.map( gas =>{
                                return(
                                    <td>{gas.quantity}</td>
                                )
                            })}
                        </tr>
                    )
                }) 
        else
            comp = []

            var total = this.props.gas.map( item =>{
                var obj = {
                    gas: item.gas,
                    quantity: 0
                }
                return obj
            })

            if(this.state.displayData[loc]["empty"]){
                this.state.displayData[loc]["empty"]["er"].map( item =>{
                    item.cylinders.map(item =>{
                        total.map(totItem =>{
                            if(totItem.gas === item.gas){
                                totItem.quantity += parseInt(item.quantity)
                            }
                        })
                    })
                })
    
                console.log(total)
    
                const arr = [
                    <tr>
                        <th>Total</th>
                        <th></th>
                        <th></th>
                        {
                            total.map(item =>{
                                return(
                                    <th>{item.quantity}</th>
                                )
                            })
                        }
                    </tr>
                ]
                comp.push(arr)
            }

        console.log(comp)
        return comp
    }

    render(){
        return(
            this.state.loading?
            <Spinner animation="border" className="spinner">

            </Spinner>
            :
            <>
                <div className="d-lg-none"><NavbarLg/></div>
                <Container fluid>
                    <Row>
                       
                            <Sidebar />
                        
                        <Col
                            lg={10}
                            id="page-content-wrapper"
                        >
                            <div className="mt-3">
                                <DatePicker dateFormat="dd/mm/yyyy" value={this.state.selectedDate} onChange={date => this.changeDate(date)} />
                            </div>

                            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="tab d-flex align-items-center">
                                <Tab eventKey="shop" title="SHOP" >
                                    <Tabs defaultActiveKey="location" id="uncontrolled">
                                        <Tab eventKey="dispatch" title="Dispatch">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th colSpan={3 + this.props.gas.length}>Dispatch</th>
                                                    </tr>
                                                    <tr>
                                                        <th>Party Name</th>
                                                        <th>Challan Number</th>
                                                        <th>Location</th>
                                                        <th colSpan={this.props.gas.length}>Cylinder Quantity</th>
                                                    </tr>
                                                    <tr>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        {this.state.gas.map(item =>{
                                                            return(<th>{item.gas}</th>)
                                                        })}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                    
                                                        this.showDispatch('SHOP')
                                                    
                                                    }
                                                </tbody>
                                            </table>
                                        </Tab>
                                        <Tab eventKey="receive" title="Receive">
                                        <table>
                                                <thead>
                                                    <tr>
                                                        <th colSpan={3 + this.props.gas.length}>Receive</th>
                                                    </tr>
                                                    <tr>
                                                        <th>Party Name</th>
                                                        <th>ER Number</th>
                                                        <th>Location</th>
                                                        <th colSpan={this.props.gas.length}>Cylinder Quantity</th>
                                                    </tr>
                                                    <tr>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        {this.state.gas.map(item =>{
                                                            return(<th>{item.gas}</th>)
                                                        })}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.showReceive('SHOP')}
                                                </tbody>
                                            </table>
                                        </Tab>
                                        </Tabs>

                                {/* {this.state.data.length>0?
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
                                    :<></>} */}
                                </Tab>
                                <Tab eventKey="cbj" title="CBJ" >
                                    <Tabs defaultActiveKey="location" id="uncontrolled">
                                        <Tab eventKey="dispatch" title="Dispatch">
                                            <table >
                                                <thead>
                                                    <tr>
                                                        <th colSpan={3 + this.props.gas.length}>Dispatch</th>
                                                    </tr>
                                                    <tr>
                                                        <th>Party Name</th>
                                                        <th>Challan Number</th>
                                                        <th>Location</th>
                                                        <th colSpan={this.props.gas.length}>Cylinder Quantity</th>
                                                    </tr>
                                                    <tr>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        {this.state.gas.map(item =>{
                                                            return(<th>{item.gas}</th>)
                                                        })}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                    
                                                        this.showDispatch('CBJ')
                                                    
                                                    }
                                                </tbody>
                                            </table>
                                        </Tab>
                                        <Tab eventKey="receive" title="Receive">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th colSpan={3 + this.props.gas.length}>Receive</th>
                                                    </tr>
                                                    <tr>
                                                        <th>Party Name</th>
                                                        <th>ER Number</th>
                                                        <th>Location</th>
                                                        <th colSpan={this.props.gas.length}>Cylinder Quantity</th>
                                                    </tr>
                                                    <tr>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        {this.state.gas.map(item =>{
                                                            return(<th>{item.gas}</th>)
                                                        })}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.showReceive('CBJ')}
                                                </tbody>
                                            </table>
                                        </Tab>
                                    </Tabs>
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
}

export default withRouter(DailyStock)