import React from 'react'
import { Container, Row, Col, Form, Button, Card, Spinner } from "react-bootstrap";
import Sidebar from "./Sidebar";
import db from "./Firestore";
import NavbarLg from "./NavbarLg";
import { withRouter } from 'react-router';
import DatePicker from "react-date-picker";

class NewReceive extends React.Component{
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
            clicked: false
        }
    }

    componentDidMount = ()=>{
        console.log(this.props.gas)
        this.setState({selectedDate: new Date()})
        var partyNamesDL = this.props.partyNames.map(item =>{
            return(<option value={item} >{item}</option>)
        })
        const total = this.props.gas.map( item =>{
            var obj = {
                gas: item.gas,
                quantity: 0
            }
            return obj
        })
        this.setState({partyNamesDL, total, loading:false})
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

    handleSubmit = (e)=>{
        e.preventDefault()
        if( !(this.state.currentParty && this.state.currentER && (this.state.currentO2 || this.state.currentCO2 || this.state.currentN2 || this.state.currentDA || this.state.currentN20 || this.state.currentH2 || this.state.currentAMM || this.state.currentARG || this.state.currentAIR))){
            alert('cannot be empty')
            return
        }

        const cylinders = this.props.gas.map( gasItem =>{
            var obj = {
                gas: gasItem.gas,
                quantity: this.state["current" + gasItem.gas]? this.state["current" + gasItem.gas]: 0
            }
            return obj
        })


        const entry = {
            partyName: this.state.currentParty,
            erNumber: this.state.currentER,
            cylinders: cylinders,
            soldFrom: this.state.currentLocation,
            dateSold: this.state.selectedDate
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
        var locationWiseEntry = this.state.locationWiseEntry
        if(locationWiseEntry[entry.soldFrom]){
            locationWiseEntry[entry.soldFrom].push(entry)
        } else {
            locationWiseEntry[entry.soldFrom] = []
            locationWiseEntry[entry.soldFrom].push(entry)
        }
        this.setState({
            data, 
            total, 
            currentParty: '',
            currentER: '',
            currentO2: '',
            currentCO2: '',
            currentN2: '',
            currentDA: '',
            currentN20: '',
            currentH2:'',
            currentAMM:'',
            currentARG:'',
            currentAIR:'',
            locationWiseEntry
        })
        console.log(entry)
    }

    handleRemove = (erNumber)=>{
        var data = this.state.data
        var total = this.state.total
        var locationWiseEntry = []
        var arr=[]
        console.log(locationWiseEntry)
        data.map(item => {
            if(item.erNumber === erNumber){
                item.cylinders.map(cylItem =>{
                    total.map(totItem =>{
                        if(totItem.gas === cylItem.gas){
                            totItem.quantity -= parseInt(cylItem.quantity)
                        }
                    })
                locationWiseEntry =  this.state.locationWiseEntry[item.soldFrom].filter(locItem => locItem.erNumber !== erNumber)
            })
            } else {
                arr.push(item)
            }
        })
        console.log(
            arr, total, locationWiseEntry
        )
        this.setState({data: arr, total, locationWiseEntry})
    }

    createGas = ()=>{
        return (
            this.props.gas.map(item =>{
                return(
                    <td>
                        <input
                            style={{width:"5rem",padding:"0.5rem 0.5rem 1.5rem 0.5rem", border:"none"}}
                            type="number"
                            placeholder={`Enter ${item.gas}`}
                            value={this.state["current"+item.gas]}
                            name={`current${item.gas}`}
                            onChange={this.handleChange}
                        >
                        </input>
                    </td>
                )
            })
        )
    }

    tns = (obj)=>{
        return db.runTransaction((transaction) => {
            // This code may get re-run multiple times if there are conflicts.
            return transaction.get(obj.docRef).then((doc) => {
                if (!doc.exists) {
                    throw "Document does not exist!";
                }

                var balance = doc.data().balance
                console.log(balance)
                console.log(obj.receiveItem)
                balance.map( balanceItem =>{
                    obj.receiveItem.cylinders.map(cylItem =>{
                        if(cylItem.gas === balanceItem.gas)
                            balanceItem.quantity -= parseInt(cylItem.quantity)
                    })
                })
                transaction.set(obj.receiveRef, obj.receiveItem);
                transaction.update(obj.docRef, {balance: balance});
            });
        }).then(() => {
            console.log("Transaction successfully committed!");
        }).catch((error) => {
            console.log("Transaction failed: ", error);
        });
    }

    handleUpload = async ()=>{
        this.setState({clicked: true})
        try{
            if(!this.state.selectedDate){
                alert('Please select date')
                return
            }


            const batchArray2 = [];
            batchArray2.push(db.batch());
            let operationCounter2 = 0;
            let batchIndex2 = 0;

            await this.state.data.forEach(doc => {
                var obj = {
                    receiveRef: db.collection('parties').doc(doc.partyName).collection('receive').doc(doc.erNumber),
                    docRef: db.collection('parties').doc(doc.partyName),
                    receiveItem: doc,
                    docBalance: doc.cylinders
                }
                this.tns(obj)
                var erRef = db.collection('er').doc(doc.erNumber)
    
                // update document data here...
                batchArray2[batchIndex2].set(erRef, doc);
                operationCounter2++;
    
                if (operationCounter2 === 499) {
                batchArray2.push(db.batch());
                batchIndex2++;
                operationCounter2 = 0;
                }
            });
            await batchArray2.forEach(async batch => await batch.commit());

            await this.updateStock()

            alert('Click Ok to continue')
            this.setState({data:[], clicked: false})
        } catch(err){
            console.error(`updateWorkers() errored out : ${err.stack}`);
        }
        
    }

    updateStock = ()=>{
        Object.keys(this.state.locationWiseEntry).map(location =>{
            var challanRef = db.collection('stocks').doc(location).collection(this.handleDate(this.state.selectedDate)).doc('empty')
            console.log(challanRef)
            // This code may get re-run multiple times if there are conflicts.
            return db.runTransaction(async (transaction) => {
                return transaction.get(challanRef).then((doc) => {
                    console.log(doc.data())
                    if (!doc.exists) {
                        challanRef.set({er:this.state.locationWiseEntry[location]}).then(()=>{
                        })
                        console.log("New Document created")
                    } else {
                        console.log('in else')
                        console.log(doc.data().er)
                        console.log(this.state.locationWiseEntry[location])
                        var newER = (doc.data().er).concat(this.state.locationWiseEntry[location])
                        console.log(newER)
                        transaction.update(challanRef, { er: newER });
                    }
                }).then(() => {
                    console.log("Transaction successfully committed!");
                }).catch((error) => {
                    console.log("Transaction failed: ", error);
                });
            });
        })
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
                        >
                            <div  className="mt-2 mb-4">
                                <DatePicker dateFormat="dd/mm/yyyy" value={this.state.selectedDate} onChange={date => this.setState({selectedDate: date})} />
                            </div>

                            <table
                                style={{borderStyle:"solid",borderWidth:"1px"}}
                                className="newRectable"
                            >
                                <tr>
                                    <th colSpan={4 + this.props.gas.length}>Empty / Receive</th>
                                </tr>
                                <tr>
                                    <th>Party Name</th>
                                    <th>ER Number</th>
                                    <th>Location</th>
                                    <th colSpan={this.props.gas.length}>Cylinder Quantity</th>
                                    <th>Action</th>
                                </tr>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    {this.state.gas.map(item =>{
                                        return(<th>{item.gas}</th>)
                                    })}
                                    <th></th>
                                </tr>
                                <tr>
                                    <td>
                                        <input 
                                            style={{width:"6rem",padding:"0.5rem 0.5rem 1.5rem 0.5rem", border:"none"}}
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
                                    </td>
                                    <td>
                                        <input 
                                            style={{width:"6rem",padding:"0.5rem 0.5rem 1.5rem 0.5rem", border:"none"}}
                                            type="number"
                                            placeholder="Enter Challan Number"
                                            value={this.state.currentER}
                                            name="currentER"
                                            onChange={this.handleChange}
                                        >
                                        </input>
                                    </td>
                                    
                                    <td>
                                        <select 
                                            style={{width:"6rem",padding:"0.5rem 0.5rem 1.5rem 0.5rem", border:"none"}}
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
                                        <Button onClick={this.handleSubmit} className="m-2">
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
                                                <td>{item.erNumber}</td>
                                                <td>{item.soldFrom}</td>
                                                {item.cylinders.map( gas =>{
                                                    return(
                                                        <td>{gas.quantity}</td>
                                                    )
                                                })}
                                                <td>
                                                    <Button
                                                        className="m-2"
                                                        variant="outline-danger"
                                                        onClick= {()=>{this.handleRemove(item.erNumber)}}
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
                                :<></>}
                            </table>
                            <Button onClick={this.handleUpload} disabled={this.state.clicked}  className="button mt-4">
                                Upload
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
}

export default withRouter(NewReceive)