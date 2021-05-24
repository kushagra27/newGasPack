import { React, useContext, useState, useEffect } from "react";
import { Nav, Col } from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";
import { logOut } from "../components/Firestore";
import { UserContext } from "./UserProvider";
import { Redirect } from "react-router-dom";

const Sidebar = () => {
  const user = useContext(UserContext);
  const [redirect, setredirect] = useState(null);

  useEffect(() => {
    if (!user) {
      setredirect("/");
    }
  }, [user]);
  if (redirect) {
    <Redirect to={redirect} />;
  }

  return (
    <Col
      lg={2}
      id="sidebar-wrapper"
      className="d-xs-none d-sm-none d-xl-block d-md-block"
    >
      <Nav className="bg-dark sidebar " activeKey="/home">
        <div className="sidebar-sticky"></div>
        <Nav.Item>
          <button className="ml-5 mb-3 btn-danger btn" onClick={logOut}>Logout</button>
        </Nav.Item>
        <Nav.Item>
          <Link to="/newParty">New Party</Link>
        </Nav.Item>
        <hr />
        <Nav.Item>
          <Link to="/newDispatch">New Dispatch</Link>
        </Nav.Item>
        <hr />
        <Nav.Item>
          <Link to="/newReceive">New Receive</Link>
        </Nav.Item>
        <hr />
        <Nav.Item>
          <Link to="/dispatchSupplier">Dispatch to Supplier</Link>
        </Nav.Item>
        <hr />
        <Nav.Item>
          <Link to="/receiveSupplier">Receive from Supplier</Link>
        </Nav.Item>
        <hr />
        <Nav.Item>
          <Link to="/dailyStock">Daily Stock</Link>
        </Nav.Item>
        <hr />
        <Nav.Item>
          <Link to="/partyHistory">Party History</Link>
        </Nav.Item>
        <hr />
        <Nav.Item>
          <Link to="/allPartyRegister">All Party Register</Link>
        </Nav.Item>
        <hr />
        <Nav.Item>
          <Link to="/gasRegister">Gas Register</Link>
        </Nav.Item>
        <hr />
        <Nav.Item>
          <Link to="/editChallan">Edit Challan</Link>
        </Nav.Item>
        <hr />
        <Nav.Item>
          <Link to="/editEr">Edit ER</Link>
        </Nav.Item>
        <hr />
      </Nav>
    </Col>
  );
};

export default withRouter(Sidebar);
