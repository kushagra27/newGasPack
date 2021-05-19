import React from 'react'
import { Container, Row, Col, Tabs, Tab, Card, Spinner, Button } from "react-bootstrap";
import Sidebar from "./Sidebar";
import db from "./Firestore";
import NavbarLg from "./NavbarLg";
import { withRouter } from 'react-router';
import DatePicker from "react-date-picker";

class PartyHistory extends React.Component{
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
        this.setState({loading: false, partyNamesDL})
    }

    handleSubmit = ()=>{

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
                                <Button>
                                    OK
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
}
export default withRouter(PartyHistory)