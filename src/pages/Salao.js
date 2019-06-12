import React from 'react';
import '../components/App.css';
import '../components/Input.css';
import Button from '../components/button';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import firebase from '../firebaseConfig';
import withFirebaseAuth from 'react-with-firebase-auth';
import DataMenuOne from "../data/menuOne";
// import DataMenuTwo from  "../data/menuTwo";

const firebaseAppAuth = firebase.auth();
const database = firebase.firestore();

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("email usuario", user.email)
    console.log("usuário logado", user)
  } else {
    console.log("não encontrado usuario")
  }
});


class Salao extends React.Component{
  constructor(props){
    super(props);
    this.state = {     
      nameClient: "",
      nameFunc: "",     
      comprar: [],
      listIntem:[],
    }
  }
  componentDidMount(){
    database.collection('laboratoria').get()
    .then((querySnapshot)=> {
      const data= querySnapshot.docs.map(doc =>doc.data())
      this.setState({listIntem: data})
    });
  }
  handleChange = (event, element) => {
    const newState = this.state;
    newState[element]=event.target.value
    this.setState(newState);
  }

  handleClick = ()=> {
    const object = {
      nameClient: this.state.nameClient,   
      nameFunc: this.state.nameFunc,
      comprar: this.state.comprar,  
    }

    database.collection('laboratoria').add(object)
    // this.setState({
    //   listIntem: this.state.listIntem.concat(object).reverse()
      
    //   })
    }

  clickComprar = (item) => {
    const itemIndex = this.state.comprar.findIndex((DataMenuOne) =>
       {
          return DataMenuOne.nameItem === item.nameItem
      })
      if(itemIndex < 0) {
        const newItem = {
          ...item,
          quantidade: 1
        };
        this.setState({
          comprar: this.state.comprar.concat(newItem)
        });
      } else {
        let newCompra = this.state.comprar;
        newCompra[itemIndex].quantidade +=1;
        this.setState({
          comprar: newCompra
        });
      }
    }
   
    render() {
      const valorTotal = this.state.comprar.reduce((acc, cur) => 
      {
        return acc + (cur.quantidade * cur.price)
      }, 0);    
        return(
        <div className="App">
           <header className="App-header">  
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#home">
                      <img
                        alt=""
                        src="../images/logo.png"
                        width="70"
                        height="70"
                        className="d-inline-block align-top"
                      />
                      {' React Bootstrap'}
                    </Navbar.Brand>
                </Navbar> 
                <div className="container">       
                  <input className="sign-up-name rounded-border" value={this.state.nameClient} placeholder="Digite o nome do cliente" onChange={(e)=> this.handleChange(e,"nameClient")} />
                </div>
                <hr></hr>
                <Container>
                    <Row>
                      <Col xs={6} >
                        {/* {
                          this.state.listIntem.map(item =>{
                            return <p> Cliente: {item.name} </p>
                          })
                        } */}
                        
                       
                          <p className="align-left font-size-m">CARDÁPIO</p>
                          
                            {
                              DataMenuOne.map((item, i)=>{                
                              return <div>                                         
                                        <button className="itemButton" key={i} onClick={()=> {this.clickComprar(item)}}>{item.nameItem} - {item.price} </button>
                                                  
                                    </div>
                              }
                            )}          
                                         
                      </Col>
                      <Col xs={6} md="auto"  >
                     
                          <p className="align-left font-size-m">PEDIDO</p>
                          
                          {
                            this.state.comprar.map((produto, i)=>{
                              return <div>
                              <p key={i}> {produto.quantidade} - {produto.nameItem} : {produto.price * produto.quantidade}  
                              </p>
                              
                              


                              </div>
                              
                              
                            })
                          }
                         
                      
                      
                       </Col>
                    </Row>                    
                </Container>
                <hr></hr>
                <Container>
                    <Row> 
                      <Col xs={12}>  
                      <p className="align-right">Valor Total: {valorTotal}  <Button  text="Finalizar Pedido" onClick ={this.handleClick}/></p>             
                                                                        
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
})(Salao);



