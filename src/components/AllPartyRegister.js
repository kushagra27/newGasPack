import React from "react";
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Card,
  Spinner,
  Modal,
  InputGroup,
  ThemeProvider,
} from "react-bootstrap";
import Sidebar from "./Sidebar";
import db from "./Firestore";
import NavbarLg from "./NavbarLg";
import { withRouter } from "react-router";
import DatePicker from "react-date-picker";
import _ from "lodash";
import PartyRegister from "./PartyRegister";

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
            srNo:1,
            modalShow: false,
            hideLowBalances: true
        }
    }

  componentDidMount = () => {
    var partyNamesDL = this.props.partyNames.map((item) => {
      return <option value={item}>{item}</option>;
    });
    var obj = {};
    db.collection("parties")
      .get()
      .then(async (querySnapshot) => {
        await querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          obj[doc.id] = doc.data();
        });

            console.log(obj)
            var sno = 0
            var lowSno = 0
            var lowBalanceHidden = []
            var lowBal = 0
            var bal = 0
            var show = Object.keys(obj).map( name =>{
                if(_.find(obj[name].balance, function(o) { return o.quantity != 0; }))
                {
                        lowBal = 0
                        lowSno+=1
                        lowBalanceHidden.push(
                            <tr onClick={()=>{this.handleShow(obj[name].partyName)}} >
                                <td>{lowSno}</td>
                                <td style={{textAlign:'left'}}>{obj[name].partyName}</td>
                                {
                                    obj[name].balance.map(balItem =>{
                                        if(balItem.quantity){
                                            lowBal+=balItem.quantity
                                            return(<td><strong>{balItem.quantity}</strong></td>)
                                        } else {
                                            return(<td>{balItem.quantity}</td>)
                                        }
                                    })
                                }
                                <td><strong>{lowBal}</strong></td>
                            </tr>
                        )
                }
                bal = 0
                sno+=1
                return(
                    <tr onClick={()=>{this.handleShow(obj[name].partyName)}} >
                        <td>{sno}</td>
                        <td style={{textAlign:'left'}}>{obj[name].partyName}</td>
                        {
                            obj[name].balance.map(balItem =>{
                                bal+=balItem.quantity
                                if(balItem.quantity){
                                    return(<td><strong>{balItem.quantity}</strong></td>)
                                } else {
                                    return(<td>{balItem.quantity}</td>)
                                }
                            })
                        }
                        {
                            bal?
                                <td><strong>{bal}</strong></td>
                            :
                                <td>{bal}</td>
                        }
                    </tr>
                )
            })
            await this.setState({partyNamesDL, data: obj, show: show, lowBalanceHidden, loading: false})
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
  };

  handleDate = (date) => {
    // console.log(date)
    const a = date.getDate();
    const b = date.getFullYear();
    const c = date.getMonth() + 1;
    const e = a + "-" + c + "-" + b;

    return e;
  };

  handleShow = (name) => {
    this.setState({ name, modalShow: true });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

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
                            className="d-flex justify-content-center mt-5"
                            
                        >
                            <div className="d-flex justify-content-center mt-3">
                                <h2>All Party Register</h2>
                            </div>
                            <div className='custom-control custom-switch'>
                                <input
                                    type='checkbox'
                                    className='custom-control-input'
                                    id='customSwitchesChecked'
                                    defaultChecked = {this.state.hideLowBalances}
                                    onChange={()=>{this.setState({hideLowBalances: !this.state.hideLowBalances})}}
                                />
                                <label className='custom-control-label' htmlFor='customSwitchesChecked'>
                                    Hide Low Balances
                                </label>
                            </div>
                            <table className="table-hover">
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
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.hideLowBalances
                                        ?
                                            this.state.lowBalanceHidden.length > 0?this.state.lowBalanceHidden:[]
                                        :
                                            this.state.show.length > 0?this.state.show:[]}
                                </tbody>
                            </table>
                            <Modal
                                size="lg"
                                show={this.state.modalShow}
                                onHide={() => this.setState({modalShow: false})}
                                aria-labelledby="example-modal-sizes-title-lg"
                            >
                                <Modal.Header closeButton>
                                <Modal.Title id="example-modal-sizes-title-lg">
                                    Party History
                                </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <PartyRegister gas={this.props.gas} partyNames={this.props.partyNames} pn={this.state.name} />
                                </Modal.Body>
                            </Modal>
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
}
export default withRouter(AllPartyRegister);
