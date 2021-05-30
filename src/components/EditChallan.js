import React from "react";
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Card,
  Spinner,
  Button,
  InputGroup,
  Form,
} from "react-bootstrap";
import Sidebar from "./Sidebar";
import db from "./Firestore";
import NavbarLg from "./NavbarLg";
import { withRouter } from "react-router";
import DatePicker from "react-date-picker";
import _ from "lodash";

class EditChallan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentParty: "",
      data: [],
      gas: this.props.gas,
      selectedDate: "",
      loading: true,
      partyNamesDL: [],
      locationWiseEntry: {},
      displayData: {
        SHOP: {},
        CBJ: {},
      },
      srNo: 1,
      selectedChallan: "",
      challanNumber: "",
    };
  }

  componentDidMount = () => {
    var obj = {};
    var challanList = [];
    db.collection("challans")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          obj[doc.id] = doc.data();
          challanList.push(<option value={doc.id}>{doc.id}</option>);
        });
        this.setState({ challanList, data: obj, loading: false });
        if (this.props.challanNumber) {
          console.log(this.props.challanNumber);
          var chn = {};
          chn.target = {
            name: "challanNumber",
            value: this.props.challanNumber,
          };
          this.handleChange(chn);
        }
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

  handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "challanNumber") {
      if (_.find(this.state.data, { challanNumber: value })) {
        var data = _.find(this.state.data, { challanNumber: value });
        data.cylinders.map((cylItem) => {
          this.setState({ ["current" + cylItem.gas]: cylItem.quantity });
        });
        this.setState({
          partyName: data.partyName,
          soldFrom: data.soldFrom,
          dateSold: data.dateSold.toDate(),
          selectedChallan: data,
        });
      }
    }
    this.setState({ [name]: value });
  };

  tns = async (obj) => {
    return db
      .runTransaction((transaction) => {
        // This code may get re-run multiple times if there are conflicts.
        return transaction.get(obj.docRef).then((doc) => {
          if (!doc.exists) {
            throw "Document does not exist!";
          }

          var balance = doc.data().balance;
          // console.log(balance)
          // console.log(obj.dispatchItem)

          balance.map((balanceItem) => {
            obj.dispatchItem.cylinders.map((cylItem) => {
              if (cylItem.gas === balanceItem.gas) {
                // console.log(_.find(this.state.selectedChallan.cylinders, {gas: balanceItem.gas}))
                balanceItem.quantity -= parseInt(
                  _.find(this.state.selectedChallan.cylinders, {
                    gas: balanceItem.gas,
                  }).quantity
                );
                balanceItem.quantity += parseInt(cylItem.quantity);
              }
            });
          });
          transaction.set(obj.dispatchRef, obj.dispatchItem);
          transaction.update(obj.docRef, { balance: balance });
        });
      })
      .then(() => {
        console.log("Transaction successfully committed!");
      })
      .catch((error) => {
        console.log("Transaction failed: ", error);
      });
  };

  handleUpload = async (e) => {
    try {
      e.preventDefault();
      this.setState({ clicked: true });
      if (!this.state.dateSold) {
        alert("Please select date");
        return;
      }

      const cylinders = this.props.gas.map((gasItem) => {
        var obj = {
          gas: gasItem.gas,
          quantity: this.state["current" + gasItem.gas]
            ? this.state["current" + gasItem.gas]
            : 0,
        };
        return obj;
      });

      var doc = {
        partyName: this.state.partyName,
        challanNumber: this.state.challanNumber,
        dateSold: this.state.dateSold,
        soldFrom: this.state.soldFrom,
        cylinders: cylinders,
      };

      var obj = {
        dispatchRef: db
          .collection("parties")
          .doc(doc.partyName)
          .collection("dispatch")
          .doc(doc.challanNumber),
        docRef: db.collection("parties").doc(doc.partyName),
        dispatchItem: doc,
        docBalance: doc.cylinders,
      };
      // console.log(obj)
      // console.log(doc)
      this.tns(obj);
      var challanRef = db.collection("challans").doc(doc.challanNumber);

      challanRef.set(doc);
      await this.updateStock(doc);

      alert("Click Ok to continue");
      this.setState({
        clicked: false,
        partyName: "",
        soldFrom: "",
        dateSold: "",
        selectedChallan: "",
      });
      this.props.gas.map((gasItem) => {
        this.setState({ ["current" + gasItem.gas]: 0 });
      });
    } catch (err) {
      console.error(`updateWorkers() errored out : ${err.stack}`);
    }
  };

  updateStock = (obj) => {
    // console.log(this.handleDate(this.state.dateSold))
    var challanRef = db
      .collection("stocks")
      .doc(this.state.soldFrom)
      .collection(this.handleDate(this.state.dateSold))
      .doc("filled");
    // console.log(challanRef)
    // This code may get re-run multiple times if there are conflicts.
    return db.runTransaction(async (transaction) => {
      return transaction
        .get(challanRef)
        .then((doc) => {
          // console.log(doc.data())
          if (!doc.exists) {
            console.log("New Document created");
          } else {
            // console.log('in else')
            // console.log(doc.data().challans)
            var newChallans = doc.data().challans.filter((chl) => {
              return (
                chl.challanNumber !== this.state.selectedChallan.challanNumber
              );
            });
            newChallans.push(obj);
            transaction.update(challanRef, { challans: newChallans });
          }
        })
        .then(() => {
          console.log("Transaction successfully committed!");
        })
        .catch((error) => {
          console.log("Transaction failed: ", error);
        });
    });
  };

  render() {
    return this.state.loading ? (
      <Spinner animation="border" className="spinner"></Spinner>
    ) : (
      <>
        <div className="d-lg-none">
          <NavbarLg />
        </div>
        <Container fluid>
          <Row>
            <Sidebar />

            <Col lg={10} id="page-content-wrapper" className="">
              <div className="d-flex justify-content-center mt-3">
                <h2>Edit Challan</h2>
              </div>
              <Card className="mt-3 card mb-3">
                <Card.Body>
                  <Form onSubmit={this.handleUpload} className="form">
                    <Row>
                      <Col lg={6}>
                        <Form.Group controlId="formBasicSO">
                          <Form.Label class="font-weight-bold">
                            Challan Number
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Challan Number"
                            value={this.state.challanNumber}
                            name="challanNumber"
                            onChange={this.handleChange}
                            list="challanNumbers"
                            required
                          />
                          <datalist id="challanNumbers">
                            {this.state.challanList}
                          </datalist>
                          <Form.Text className="text-muted">
                            Challan Number
                          </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formBasicSO">
                          <Form.Label class="font-weight-bold">
                            Sold From
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Sold From"
                            value={this.state.soldFrom}
                            name="challanNumber"
                            onChange={this.handleChange}
                            disabled
                            required
                          />
                          <Form.Text className="text-muted">
                            Sold From
                          </Form.Text>
                        </Form.Group>
                      </Col>

                      <Col lg={6}>
                        <Form.Group controlId="formBasicCity">
                          <Form.Label class="font-weight-bold">
                            Party Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Party Name"
                            value={this.state.partyName}
                            name="partyName"
                            onChange={this.handleChange}
                            disabled
                            required
                          />
                          <Form.Text className="text-muted">
                            Party Name
                          </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formBasicCity">
                          <Form.Label class="font-weight-bold">
                            Date Sold
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Date Sold"
                            value={
                              this.state.dateSold
                                ? this.handleDate(this.state.dateSold)
                                : ""
                            }
                            name="dateSold"
                            onChange={this.handleChange}
                            disabled
                            required
                          />
                          <Form.Text className="text-muted">
                            Date of Challan
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group>
                      <Form.Label class="font-weight-bold">
                        Opening Balance
                      </Form.Label>
                      <table className="newPartytable">
                        <tr>
                          {this.props.gas.map((item) => {
                            return <th>{item.gas}</th>;
                          })}
                        </tr>
                        <tr>
                          {this.props.gas.map((item) => {
                            return (
                              <td>
                                <input
                                  style={{
                                    width: "7rem",
                                    padding: "0.5rem 1rem 2rem 1rem",
                                    border: "none",
                                  }}
                                  placeholder="Enter Quantity"
                                  value={this.state["current" + item.gas]}
                                  name={"current" + item.gas}
                                  type="number"
                                  onChange={this.handleChange}
                                ></input>
                              </td>
                            );
                          })}
                        </tr>
                      </table>
                      <Form.Text className="text-muted">
                        Opening Balance
                      </Form.Text>
                    </Form.Group>
                    <div className="d-flex justify-content-center">
                      <Button type="submit" className="button">
                        Submit
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
export default withRouter(EditChallan);
