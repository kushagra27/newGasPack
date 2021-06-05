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
import {db} from "./Firestore";
import NavbarLg from "./NavbarLg";
import { withRouter } from "react-router";
import DatePicker from "react-date-picker";
import _ from "lodash";
import PartyRegister from "./PartyRegister";
import Table from "./Table";

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

        var gasWiseTotal = this.props.gas.map((item) => {
            var obj = {
              gas: item.gas,
              quantity: 0,
            };
            return obj;
        });
        

            // console.log(data)
            var sno = 1
            var lowSno = 1
            var lowBalanceHidden = []
            var lowBal = 0
            var bal = 0
        
            const data = _.toArray(obj).map( item =>{
                if(_.find(item.balance, function(o) { return o.quantity != 0; })){
                    lowBal = 0
                    item.sno = lowSno++
                    const gasObj = Object.assign({}, ...(item.balance).map(gas => { 
                        return { [gas.gas]: gas.quantity } 
                    }))
                    
                    item.balance.map(balItem => {
                        lowBal+=balItem.quantity
                    })
                    item.total = lowBal
                    lowBalanceHidden.push({...item, ...gasObj})
                }
                bal = 0
                item.sno = sno++
                const gasObj = Object.assign({}, ...(item.balance).map(gas => { 
                    return { [gas.gas]: gas.quantity } 
                }))
                
                item.balance.map(balItem => {
                    gasWiseTotal.map(gasItem =>{
                        if(gasItem.gas === balItem.gas){
                            gasItem.quantity += balItem.quantity
                        }
                    })
                    bal+=balItem.quantity
                })
                item.total = bal
                return ({...item, ...gasObj})
            })

            const footer = 
            <tr>
                <td colSpan={2}><strong>Total</strong></td>
                {gasWiseTotal.map(gasItem =>{
                    return(<td><strong>{gasItem.quantity}</strong></td>)
                })}
                <td><strong>{_.sumBy(gasWiseTotal, 'quantity') }</strong></td>
            </tr>

            await this.setState({partyNamesDL, lowBalanceHidden, data, loading: false, footer})
            // await this.setState({partyNamesDL, data: obj, show: show, lowBalanceHidden, gasWiseTotal,loading: false})
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
        console.log(this.state.data.length)
        const columns = [
              {
                Header: 'Party Name',
                Footer: 'Total',
                columns: [
                    ...[
                        {
                            Header: 'Sr. No',
                            Footer: 'Sr. No',
                            accessor: 'sno',
                        },
                        {
                            Header: 'Party Name',
                            Footer: 'Total',
                            accessor: 'partyName',
                        },
                    ],
                    ...this.props.gas.map(gasItem=>{
                        return({
                            Header:`${gasItem.gas}`,
                            accessor: `${gasItem.gas}`,
                            Footer: info => {
                                // Only calculate total visits if rows change
                                    var total = info.rows.reduce((sum, row) => row.values[gasItem.gas] + sum, 0)
                                return <><strong>{total}</strong></>
                            },
                        })
                    }),
                    {
                        Header: 'Total',
                        accessor: 'total',
                        Footer: info => {
                            // Only calculate total visits if rows change
                                var total = info.rows.reduce((sum, row) => row.values['total'] + sum, 0)
                            return <><strong>{total}</strong></>
                        },
                    },
                ],
              }
            ]
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
                            className="mt-5"
                            
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

                            
                            <div className='table-container'>
                                {
                                    this.state.hideLowBalances
                                    ?
                                        this.state.lowBalanceHidden.length > 0?
                                            <Table 
                                                columns={columns} 
                                                data={this.state.lowBalanceHidden} 
                                                footer = {this.state.footer} 
                                                click={this.handleShow.bind(this)}
                                                getCellProps={cellInfo => ({
                                                    style: {
                                                    fontWeight: cellInfo.value !== 0? 'bold' : 'normal',
                                                    },
                                                })}
                                                getRowProps={info => ({
                                                    onClick: () => this.handleShow(info.values.partyName),
                                                })}
                                                getColumnProps={column => ({
                                                    style: {
                                                        textAlign: column.Header==='Party Name'? 'left': 'center',
                                                    }
                                                })}
                                                />
                                        :[]
                                    :
                                        this.state.data.length > 0?
                                            <Table 
                                                columns={columns} 
                                                data={this.state.data} 
                                                footer = {this.state.footer} 
                                                click={this.handleShow.bind(this)}
                                                getCellProps={cellInfo => ({
                                                    style: {
                                                    fontWeight: cellInfo.value !== 0? 'bold' : 'normal',
                                                    },
                                                })}
                                                getRowProps={info => ({
                                                    onClick: () => this.handleShow(info.values.partyName),
                                                })}
                                                getColumnProps={column => ({
                                                    style: {
                                                        textAlign: column.Header==='Party Name'? 'left': 'center',
                                                    }
                                                })}
                                            />
                                        :[]
                                }                            
                            </div>
                            
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
                                    <PartyRegister gas={this.props.gas} partyNames={this.props.partyNames} pn={this.state.name} click={this.handleShow} />
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
