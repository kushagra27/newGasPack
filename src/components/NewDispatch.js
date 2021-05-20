import React from 'react'
import { Container, Row, Col, Form, Button, Card, Spinner } from "react-bootstrap";
import Sidebar from "./Sidebar";
import db from "./Firestore";
import NavbarLg from "./NavbarLg";
import { withRouter } from 'react-router';
import DatePicker from "react-date-picker";

class NewDispatch extends React.Component{
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
        // console.log(total)
        this.setState({partyNamesDL, total, loading:false, gas: this.state.gas})
    }

    handleChange = (e)=>{
        const {name, value} = e.target
        this.setState({[name]: value})
    }

    handleDate = date => {
        const a = date.getDate()
        const b = date.getFullYear()
        const c = date.getMonth()+1
        const e = b+"-"+c+'-'+a
        
        return e
    }

    handleSubmit = (e)=>{
        e.preventDefault()
        if( !(this.state.currentParty && this.state.currentChallan && (this.state.currentO2 || this.state.currentCO2 || this.state.currentN2 || this.state.currentDA || this.state.currentN20 || this.state.currentH2 || this.state.currentAMM || this.state.currentARG || this.state.currentAIR))){
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

        console.log(cylinders)
        const entry = {
            partyName: this.state.currentParty,
            challanNumber: this.state.currentChallan,
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
            gas: this.state.gas,
            currentParty: '',
            currentChallan: '',
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

    handleRemove = (challanNumber)=>{
        var data = this.state.data
        var total = this.state.total
        var locationWiseEntry = []
        var arr=[]
        console.log(locationWiseEntry)
        data.map(item => {
            if(item.challanNumber === challanNumber){
                item.cylinders.map(cylItem =>{
                    total.map(totItem =>{
                        if(totItem.gas === cylItem.gas){
                            totItem.quantity -= parseInt(cylItem.quantity)
                        }
                    })
                locationWiseEntry =  this.state.locationWiseEntry[item.soldFrom].filter(locItem => locItem.challanNumber !== challanNumber)
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
            this.state.gas.map(item =>{
                return(
                    <td>
                        <input
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

    handleUpload = async ()=>{
        this.setState({clicked: true})
        try{
            if(!this.state.selectedDate){
                alert('Please select date')
                return
            }
            const batchArray = [];
            batchArray.push(db.batch());
            let operationCounter = 0;
            let batchIndex = 0;
    
            this.state.data.forEach(doc => {
                const documentData = doc
    
                var docRef = db.collection('parties').doc(doc.partyName).collection('dispatch').doc(doc.challanNumber)
                // update document data here...
                batchArray[batchIndex].set(docRef, doc);
                operationCounter++;
    
                if (operationCounter === 499) {
                batchArray.push(db.batch());
                batchIndex++;
                operationCounter = 0;
                }
            });
            await batchArray.forEach(async batch => await batch.commit());
    
    
            const batchArray2 = [];
            batchArray2.push(db.batch());
            let operationCounter2 = 0;
            let batchIndex2 = 0;
    
            this.state.data.forEach(doc => {
                const documentData = doc
    
                var challanRef = db.collection('challans').doc(doc.challanNumber)
    
                // update document data here...
                batchArray2[batchIndex2].set(challanRef, doc);
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
            var challanRef = db.collection('stocks').doc(location).collection(this.handleDate(this.state.selectedDate)).doc('filled')
            console.log(challanRef)
            // This code may get re-run multiple times if there are conflicts.
            return db.runTransaction(async (transaction) => {
                return transaction.get(challanRef).then((doc) => {
                    console.log(doc.data())
                    if (!doc.exists) {
                        challanRef.set({challans:this.state.locationWiseEntry[location]}).then(()=>{
                        })
                        console.log("New Document created")
                    } else {
                        console.log('in else')
                        console.log(doc.data().challans)
                        console.log(this.state.locationWiseEntry[location])
                        var newChallans = (doc.data().challans).concat(this.state.locationWiseEntry[location])
                        console.log(newChallans)
                        transaction.update(challanRef, { challans: newChallans });
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
                                    <th></th>
                                    {this.state.gas.map(item =>{
                                        return(<th>{item.gas}</th>)
                                    })}
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
                                            list="partyNames"
                                        >
                                        </input>
                                        <datalist id="partyNames">
                                            {this.state.partyNamesDL}
                                        </datalist>
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
                                        this.state.data ?
                                            this.createGas()
                                        : <></>
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
                            <Button onClick={this.handleUpload} disabled={this.state.clicked}>
                                Upload
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
}

export default withRouter(NewDispatch)