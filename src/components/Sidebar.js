import React from "react";
import { Nav } from "react-bootstrap";
import { withRouter, Link} from 'react-router-dom';

const Sidebar = () => {
  return (
    <>
      <Nav
        className="bg-dark sidebar"
        activeKey="/home"
      >
        <div className="sidebar-sticky"></div>
        <Nav.Item>
          <Link to="/newParty">New Party</Link>
        </Nav.Item>
        <hr/>
        <Nav.Item>
          <Link to="/newDispatch">New Dispatch</Link>
        </Nav.Item>
        <hr/>
        <Nav.Item>
          <Link to="/newReceive">New Receive</Link>
        </Nav.Item>
        <hr/>
      </Nav>
    </>
  );
};

export default withRouter(Sidebar);
