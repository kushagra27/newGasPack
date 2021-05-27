/* eslint-disable jsx-a11y/alt-text */
import {React, useContext, useState, useEffect} from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import {signInWithGoogle} from '../components/Firestore'
import {UserContext} from './UserProvider'
import {Redirect, withRouter} from 'react-router-dom'

const NewLogin = (props) => {
  console.log(props)
  const user = useContext(UserContext)
  const [redirect, setredirect] = useState(null)



  useEffect(() => {
    console.log(user)
    if (user) {
      console.log('hi')
      props.history.push('/newParty')
    }
  }, [user])
  return (
    <>
      <Container fluid className="d-flex justify-content-center">
        <Card className="pr-5 cardLogin pl-5">
          <Row>
            <Col lg={12}>
              <Card.Body>
                <Card.Title className="font-weight-bold">Login now</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content. Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <div className="d-flex justify-content-center mt-5">
                  <button class="googlebtn" onClick={signInWithGoogle} >
                  <img
                    class="google-icon-svg mr-3"
                    src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                  />
                  Login
                </button>
                </div>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
};

export default withRouter(NewLogin);
