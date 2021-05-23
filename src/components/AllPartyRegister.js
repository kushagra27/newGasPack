import React from 'react'
import { Container, Row, Col, Tabs, Tab, Card, Spinner, Button, InputGroup, ThemeProvider } from "react-bootstrap";
import Sidebar from "./Sidebar";
import db from "./Firestore";
import NavbarLg from "./NavbarLg";
import { withRouter } from 'react-router';
import DatePicker from "react-date-picker";
import _ from "lodash";

class AllPartyRegister extends React.Component{
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
            },
            srNo:1
        }
    }

    componentDidMount = ()=>{
        var partyNamesDL = this.props.partyNames.map(item =>{
            return(<option value={item} >{item}</option>)
        })
        var obj={}
        db.collection('parties').get()
        .then(async (querySnapshot) => {
            await querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
                obj[doc.id] = doc.data()
            });

            console.log(obj)
            var sno = 0
            var show = Object.keys(obj).map( name =>{
                sno+=1
                return(
                <tr>
                    <td>{sno}</td>
                    <td>{obj[name].partyName}</td>
                    {
                        obj[name].balance.map(balItem =>{
                            return(<td>{balItem.quantity}</td>)
                        })
                    }
                </tr>
                )
            })

            await this.setState({partyNamesDL, data: obj, show: show, loading: false})
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
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

    setShow = ()=>{
        
        // this.setState({show, loading: false})
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
                        
                            <Sidebar />
                        
                        <Col
                            lg={10}
                            id="page-content-wrapper"
                            className="d-flex justify-content-center mt-5"
                            
                        >
                            <table >
                                <thead >
                                    <tr>
                                        <th colSpan={3 + (this.props.gas.length*3)}>Party Name</th>
                                    </tr>
                                    <tr>
                                        <th>Sr. No</th>
                                        <th>Party Name</th>
                                        {this.props.gas.map(item =>{
                                            return(<th colSpan={1}>{item.gas}</th>)
                                        })}
                                    </tr>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        {/* {this.props.gas.map(item =>{
                                            return(<>
                                                <th>B</th>
                                            </>)
                                        })} */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.show.length > 0?this.state.show:[]}
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
}
export default withRouter(AllPartyRegister)