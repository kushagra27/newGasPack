import React from "react"
import { Button, Container, Col, Row, 
    Card, FormGroup, Label, Input, FormFeedback, FormText, NavLink,
    Collapse , Alert, Spinner
} from 'react-bootstrap'
import Dashboard from "./Dashboard"
// import back from "./assets/backLight.png"
// import img from "./assets/cylinder.jpg"
import firebase from "./Firestore"


class SignIn extends React.Component{
    constructor(){
        super()
        this.state = {
            loading:false,
            done: false,
            signedIn: false,
            authenticated: false
        }
    }

    componentDidMount = () =>{
        firebase.auth().getRedirectResult().then((result) =>{
            if (result.credential) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // ...
                console.log("token", token)
            }
            // The signed-in user info.
            var user = result.user;
            console.log(user)
            this.setState({name: user.displayName, email: user.email})
            this.newUser(user)
        }).catch((error)=>  {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            // this.signIn()
            console.log("here")
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    const name = user.displayName;
                    const email = user.email;
                    console.log(name, email)
                    this.setState({name})
                    this.setState({email})
                    console.log(this.state.name)
                    console.log(this.state.email)
                    console.log("in")
                    this.newUser(user)
                } else {
                    this.setState({loading: false})
                }
            });    
        })
    }

    handleChange = (e) =>{
        const {name, value} = e.target
        this.setState({
            [name]: value
        })
    }

    newUser = (user)=>{
        const db = firebase.firestore()
        const userRef = db.collection('employees').doc(user.uid)
        return db.runTransaction((transaction)=>{
            // This code may get re-run multiple times if there are conflicts.
            return transaction.get(userRef).then((doc) =>{
                if (!doc.exists) {
                    transaction.set(userRef,{
                        email: user.email,
                        name: user.displayName,
                        uid: user.uid,
                        role: "new"
                    })
                    this.setState({
                        loading: false,
                        signedIn: true,
                        authenticated: false
                    })
                } else {
                    console.log("user exists")
                    if(doc.data().role === "emp"){
                        this.setState({
                            signedIn: true,
                            authenticated: true,
                            loading: false
                        })
                    } else {
                        this.setState({
                            signedIn: true,
                            loading: false,
                            authenticated: false
                        })
                    }
                }
            });
        }).then(() =>{
            console.log("Transaction successfully committed!");
        }).catch((error)=>{
            console.log("Transaction failed: ", error);
        })
    }

    signIn = ()=>{
        const db = firebase.firestore()
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const name = user.displayName;
                const email = user.email;
                const uid = user.uid;
                console.log(name, email)
                this.setState({name})
                this.setState({email})
                this.setState({uid})
                db.collection("employees").doc(user.uid).get().then((doc)=>{
                    if(doc.exists){
                        if(doc.data().role === "emp"){
                            this.setState({
                                signedIn: true,
                                loading: false,
                                authenticated: true
                            })
                        } else {
                            this.setState({
                                signedIn: true,
                                loading: false,
                                authenticated: false
                            })
                        }
                    }
                })
            } else {
                var provider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().signInWithRedirect(provider);
            }
        });
    }

    signOut = () =>{
        firebase.auth().signOut().then(() =>{
            // Sign-out successful.
            console.log("signedOut")
            this.setState({
                signedIn: false,
                authenticated: false
            })
        }).catch((error) =>{
            // An error happened.
        });    
    }
    
    ifSignedIn = () =>{
        var firebase = require("firebase")
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
            const name = user.displayName;
            const email = user.email;
            console.log(name, email)
            this.setState({name})
            this.setState({email})
            console.log(this.state.name)
            console.log(this.state.email)
            console.log("in")
            return true
            } else {
            console.log("out")
            return false
            }
        });
    }

    render(){
        return(
            <div >
                {
                    !this.state.loading && !this.state.signedIn?
                        <Container fluid={true} style={{display:"flex", overflow:"auto",clear:"both", justifyContent: "center",minHeight:"100vh", overflow:"scroll", alignItems: "center",backgroundRepeat: 'repeat'}}>
                            <div>
                                <Card style={{margin:"2em", marginTop:"2em",maxWidth:"30vw", minHeight:"10em", overflow:"hidden", padding:"0.5em"}}>
                                    {/* <CardImg top width="100%" style={{padding:"0.5em",maxWidth:"50vw"}} src={img} alt="Gopinath Logo" /> */}
                                    <Card.Body >
                                        <h1><Card.Title style={{textAlign: "center"}}><strong>Gas Pack</strong></Card.Title></h1>

                                        <Row style={{display:"flex",justifyContent:"center"}}>
                                            <Button
                                                onClick={this.state.signedIn?this.signOut:this.signIn}
                                                style={{margin:"5px"}}
                                                color={this.state.signedIn?"danger":"primary"}
                                            >
                                                {this.state.signedIn?"Sign Out":"Sign In"}
                                            </Button>
                                        </Row>

                                    </Card.Body>
                                </Card>
                            </div>
                        </Container>
                    : !this.state.loading && this.state.signedIn && this.state.authenticated?
                    <div>
                        <Button
                            onClick={this.state.signedIn?this.signOut:this.signIn}
                            style={{margin:"5px"}}
                            color={this.state.signedIn?"danger":"primary"}
                        >
                            {this.state.signedIn?"Sign Out":"Sign In"}
                        </Button>
                        <Dashboard signOut={this.signOut} />
                    </div>
                    : !this.state.loading && this.state.signedIn && !this.state.authenticated?
                    <div>
                        <Container fluid={true} style={{display:"flex", overflow:"auto",clear:"both", justifyContent: "center",minHeight:"100vh", overflow:"scroll", alignItems: "center",backgroundRepeat: 'repeat'}}>
                            <div>
                                <Card style={{margin:"2em", width:"30vw", marginTop:"2em",minHeight:"10em", overflow:"hidden", padding:"0.5em"}}>
                                    {/* <CardImg top width="100%" style={{padding:"0.5em"}} src={img} alt="Gopinath Logo" /> */}
                                    <Card.Body >
                                        <h1><Card.Title style={{textAlign: "center"}}><strong>Gas Pack</strong></Card.Title></h1>
                                        <Card.Text>Please Wait for the admin to authorize you</Card.Text>
                                        <Row style={{display:"flex",justifyContent:"center"}}>
                                            <Button
                                                onClick={this.state.signedIn?this.signOut:this.signIn}
                                                style={{margin:"5px"}}
                                                color={this.state.signedIn?"danger":"primary"}
                                            >
                                                {this.state.signedIn?"Sign Out":"Sign In"}
                                            </Button>
                                        </Row>

                                    </Card.Body>
                                </Card>
                            </div>
                        </Container>
                    </div>
                    :
                    <div style={{display:"flex", overflow:"auto",clear:"both", justifyContent: "center",minHeight:"100vh", overflow:"scroll", alignItems: "center",backgroundRepeat: 'repeat'}}>
                        <Spinner style={{ width: '3rem', height: '3rem' }}  color="dark" />
                    </div>
                }
            </div>
        )
    }
}

export default SignIn