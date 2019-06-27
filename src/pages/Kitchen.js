
import React from 'react';
import '../components/App.css';
import '../components/Input.css';
import Logo from '../images/logo.png';
import Button from '../components/button';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import firebase from '../firebaseConfig';
import withFirebaseAuth from 'react-with-firebase-auth';
import Cooker from '../images/cooker.png';
import Back from '../images/back.png';
import Ok from '../images/ok.png';

const firebaseAppAuth = firebase.auth();
const database = firebase.firestore();


class Cozinha extends React.Component{
  constructor(props){
    super(props);
    this.state = {     
      clientName: "",
      nameFunc: "", 
      amountToPay:"",   
      buy: [],
      listIntem:[],
      showOrder:true,
      showPreparing:false
    }
  }

  showOrder(){
    this.setState({
      showPreparing:false,
      showFinished: false,
      showOrder:true
    })
  }

  showFinished(){
    this.setState({
      showPreparing:false,
      showOrder:false,
      showFinished: true
      
    })
  }

  showPreparing(){
    this.setState({
      showOrder:false,
      showFinished: false,
      showPreparing:true

    })
  }
 
  componentDidMount(){
    database.collection('ordered').get()
    .then((querySnapshot)=> {
      const data= querySnapshot.docs.map(doc =>doc.data())
      this.setState({listIntem: data})
    });
    firebaseAppAuth.onAuthStateChanged((user) => {
      database.collection('users').doc(user.uid).get()
        .then(querySnapshot => {          
          const server = querySnapshot.data().userName
          this.setState({
          server: server
        })
      })            
    });
  }

  handleChange = (event, element) => {
    const newState = this.state;
    newState[element]=event.target.value
    this.setState(newState);
  }

  resetForm = () => {
    this.setState({
        ...this.state,
        clientName: "",
        nameFunc: "",     
        buy: [],
    })
  }

  handleClick = ()=> {
    const object = {
      clientName: this.state.clientName,   
      nameFunc: this.state.nameFunc,
      buy: this.state.buy,  
      amountToPay: this.state.amountToPay, 
    }

    database.collection('ordered').add(object)
    .then((querySnapshot)=> {
      const data= querySnapshot.docs.map(doc =>doc.data())
      this.setState({listIntem: data})
    });
    alert("pedido realizado")
    this.resetForm();
  }

  clickBuy = (item) => {
    const itemIndex = this.state.buy.findIndex((dataMenu) =>
       {
          return dataMenu.nameItem === item.nameItem
      })
      if(itemIndex < 0) {
        const newItem = {
          ...item,
          quant: 1
        };
        this.setState({
          buy: this.state.buy.concat(newItem)
        });
      } else {
        let newCompra = this.state.buy;
        newCompra[itemIndex].quant +=1;
        this.setState({
          buy: newCompra
        });
      }
    }

    delEvent = (index, e) => {
      const buy = this.state.buy
      buy.splice(index, 1);
      this.setState({buy:buy})
    }
   
    render() {
      const amountToPay = this.state.buy.reduce((acc, cur) => 
      {
        return acc + (cur.quant * cur.price)
      }, 0);  
       
        return(
        <div className="App">
           <header className="App-header ">  
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="/">
                      <img src={Logo} width="160" height="160" className="d-inline-block align-top"/>                                  
                    </Navbar.Brand>  
                </Navbar>   
                <main className="container-section">
                  <ul className="edit-align">
                    <Button text="PEDIDOS REALIZADOS" onClick={()=>this.showOrder()}></Button>
                    <Button text="PREPARANDO" onClick={()=>this.showPreparing()}></Button>
                    <Button text="PRONTO" onClick={()=>this.showFinished()}></Button>
                  </ul>
               </main>                       
               <hr></hr>
               <Container>
                  <Row>
                  {
                    this.state.showOrder?
                      <Col  md={{ span: 8, offset: 2 }} >
                        <h2 className="align-center font-size-m font-color-h2">PEDIDOS REALIZADOS</h2> 
                          {                         
                            this.state.listIntem.map((item, i) =>{
                              return <div>                               
                                <button className="button-order button-style  button-size button-text-color" key={i} > 
                                <p>{item.clientName} </p>                             
                                </button> 
                                <img src={Cooker}></img>       
                              </div>
                             })
                          } 
                        </Col>
                      :null }
                  {
                    this.state.showPreparing?
                      <Col  md={{ span: 8, offset: 2 }} >
                        <h2 className="align-center font-size-m font-color-h2">PREPARANDO</h2>                                                     
                          {
                            this.state.listIntem.map((item, i) =>{                
                              return <div>                                         
                                  <button className="button-Preparing button-style button-size button-text-color " key={i} > 
                                  <p>{item.clientName} </p> 
                                  </button>
                                  <img  src={Ok}></img>
                                </div>
                                }
                              )}      
                        </Col>
                    :null}
                    {
                      this.state.showFinished?
                        <Col  md={{ span: 8, offset: 2 }} >
                          <h2 className="align-center font-size-m font-color-h2">PRONTO</h2>                                                     
                            {
                              this.state.listIntem.map((item, i) =>{                 
                                  return <div>                                         
                                      <button className="button-finished button-style button-size button-text-color " key={i} >
                                      {item.clientName}
                                      </button>
                                      <img src={Back}></img>
                                  </div>
                                }
                              )}      
                        </Col>
                      :null }
                     </Row>                    
                </Container>
                <hr></hr>
                <Container>
                    <Row> 
                      <Col xs={6}>  
                        <p className=" font-size-m fonte-color-p padding-top">USUÁRIO LOGADO: {this.state.server} </p>             
                      </Col>                     
                  </Row> 
                </Container> 
           </header>
       </div>
      )
    }
}
export default withFirebaseAuth ({
  firebaseAppAuth,
})(Cozinha);