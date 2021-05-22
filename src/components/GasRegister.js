import React from 'react'
import { Container, Row, Col, Tabs, Tab, Card, Spinner, Button, InputGroup, ThemeProvider } from "react-bootstrap";
import Sidebar from "./Sidebar";
import db from "./Firestore";
import NavbarLg from "./NavbarLg";
import { withRouter } from 'react-router';
import DatePicker from "react-date-picker";
import _ from "lodash";

class GasRegister extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            currentParty:'',
            data:[],
            gas: this.props.gas,
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
        var partyNamesDL = this.props.partyNames.map(item =>{
            return(<option value={item} >{item}</option>)
        })
        this.setZero()
        this.setState({loading: false, partyNamesDL})
    }

    setZero = ()=>{
        var d = {}
        this.props.gas.map( item =>{
            d[item.gas] = 0
        })
        this.setState({d})
    }

    handleSubmit = async ()=>{
        this.setState({loading: true})
        var data = []
        await db.collection('parties').doc(this.state.currentParty).collection('dispatch').get().then(qs =>{
            qs.forEach((doc) => {
                // console.log(doc.id, doc.data())
                data.push(doc.data())
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

        await db.collection('parties').doc(this.state.currentParty).collection('receive').get().then(qs =>{
            qs.forEach((doc) => {
                console.log(doc.id, doc.data())
                data.push(doc.data())
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

        var sorted = _.orderBy(data, ['dateSold'], ['asc']);
        console.log(sorted)
        const d = this.state.d
        const r = this.state.d
        const b = this.state.d
        var comp = sorted.map( item =>{
            return(
                <tr>
                    <td>{this.handleDate(item.dateSold.toDate())}</td>
                    <td>{item.challanNumber?item.challanNumber:item.erNumber}</td>
                    {
                    item.cylinders.map(cylItem =>{
                        var arr = []
                        this.props.gas.map( gasItem =>{
                            if(cylItem.gas === gasItem.gas){
                                if(item.challanNumber){
                                    d[gasItem.gas] += parseInt(cylItem.quantity)
                                    arr.push(<td>{cylItem.quantity?cylItem.quantity:'-'}</td>)
                                    arr.push(<td>{'-'}</td>)
                                    arr.push(<td>{d[cylItem.gas]?d[cylItem.gas]:'-'}</td>)
                                    console.log(d)
                                    console.log(cylItem, item.challanNumber)
                                } else if (item.erNumber){
                                    d[gasItem.gas] -= parseInt(cylItem.quantity)
                                    arr.push(<td>{'-'}</td>)
                                    arr.push(<td>{cylItem.quantity?cylItem.quantity:'-'}</td>)
                                    arr.push(<td>{d[cylItem.gas]?d[cylItem.gas]:'-'}</td>)
                                    console.log(d)
                                    console.log(cylItem, item.erNumber)
                                }
                            }
                        })
                        console.log(d)
                        return arr
                    })}
                </tr>
            )
        })
        this.setState({toShow: (comp.reverse()), loading: false})
    }

    handleDate = date => {
        // console.log(date)
        const a = date.getDate()
        const b = date.getFullYear()
        const c = date.getMonth()+1
        const e = a+"-"+c+'-'+b
        
        return e
    }


    handleChange = (e)=>{
        const {name, value} = e.target
        this.setState({[name]: value})
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
                                <input 
                                    type="text"
                                    placeholder="Enter Party Name"
                                    value={this.state.currentParty}
                                    name="currentParty"
                                    onChange={this.handleChange}
                                    list="partyNames"
                                >
                                </input>
                                <datalist id="partyNames">
                                    {this.state.partyNamesDL}
                                </datalist>
                                <Button onClick={this.handleSubmit}>
                                    OK
                                </Button>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th colSpan={3 + (this.props.gas.length*3)}>Party Name</th>
                                    </tr>
                                    <tr>
                                        <th>Date</th>
                                        <th>Dispatch / Receive No</th>
                                        {this.props.gas.map(item =>{
                                            return(<th colSpan={3}>{item.gas}</th>)
                                        })}
                                    </tr>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        {this.props.gas.map(item =>{
                                            return(<>
                                                    <th>D</th>
                                                    <th>R</th>
                                                    <th>B</th>
                                                </>)
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.toShow}
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
}
export default withRouter(GasRegister)