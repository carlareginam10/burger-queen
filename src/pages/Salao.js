import React from 'react';
import '../components/App.css';
import '../components/Input.css';
import logo from '../images/logo.png';
import del from '../images/del.png';
import Button from '../components/button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import firebase from '../firebaseConfig';
import withFirebaseAuth from 'react-with-firebase-auth';
import DataMenuOne from "../data/menuOne";
import DataMenuTwo from  "../data/menuTwo";

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
      showCoffe:true,
      showLunch:false
    }
  }

  showCoffe(){
    this.setState({
      showLunch:false,
      showOrder: false,
      showCoffe:true
         
    })
  }

  showLunch(){
    this.setState({
      showCoffe:false,
      showOrder: false,
      showLunch:true
    })
  }

  showOrder(){
    this.setState({
      showCoffe:false,
      showLunch:false,
      showOrder: true

    })
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
           <header className="App-header ">  
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="/">
                      <img
                        alt=""
                        src={logo}
                        width="160"
                        height="160"
                        className="d-inline-block align-top"
                      />                      
                    </Navbar.Brand>  
                                 
                </Navbar>   
                <main className="containerLogin">
                  <ul className="edit-align">
                    <Button text="CAFÉ DA MANHÃ" onClick={()=>this.showCoffe()}></Button>
                    <Button text="ALMOÇO" onClick={()=>this.showLunch()}></Button>
                    <Button text="PEDIDOS REALIZADOS" onClick={()=>this.showOrder()}></Button>
                  </ul>
               </main>  
                        
  
               <div className="container">       
                  <input className="sign-up-name rounded-border" value={this.state.nameClient} placeholder="Digite o nome do cliente" onChange={(e)=> this.handleChange(e,"nameClient")} />
                </div>
                <hr ></hr>
                <Container>
                    <Row>
                      {
                        this.state.showCoffe?
                        <Col xs={6} >
                          {/* {
                            this.state.listIntem.map(item =>{
                              return <p> Cliente: {item.name} </p>
                            })
                          } */}                        
                            <p className="align-left font-size-m fonte-color-p">CARDÁPIO</p>                                                     
                              {
                                DataMenuOne.map((item, i)=>{                
                                return <div>                                         
                                          <button className="itemButton" key={i} onClick={()=> {this.clickComprar(item)}}>{item.nameItem} - {item.price} </button>
                                       </div>
                                }
                              )}      
                        </Col>
                      :null}
                        {
                        this.state.showLunch?
                        <Col xs={6} >
                          {/* {
                            this.state.listIntem.map(item =>{
                              return <p> Cliente: {item.name} </p>
                            })
                          } */}                        
                            <p className="align-left font-size-m fonte-color-p">CARDÁPIO</p>                                                     
                              {
                                DataMenuTwo.map((item, i)=>{                
                                return <div>                                         
                                          <button className="itemButton" key={i} onClick={()=> {this.clickComprar(item)}}>{item.nameItem} - {item.price} </button>
                                       </div>
                                }
                              )}      
                        </Col>
                      :null}
                       {
                        this.state.showOrder?
                        <Col xs={6} >
                          {/* {
                            this.state.listIntem.map(item =>{
                              return <p> Cliente: {item.name} </p>
                            })
                          } */}                        
                            <p className="align-left font-size-m fonte-color-p">PEDIDOS REALIZADOS</p>  
                            <p className="align-left font-size-m ">Implementando...</p>                                                     
                               
                        </Col>
                      :null}
                      <Col xs={6} md="auto">                     
                          <p className="align-left font-size-m fonte-color-p">PEDIDO</p>
                          {
                            this.state.comprar.map((produto, i)=>{
                              return <div>
                                <button className="itemButton  " key={i}> {produto.quantidade} - {produto.nameItem} : {produto.price * produto.quantidade}
                                <img className="img-del" src={del}></img>
                                </button>
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
                      <p className="align-right font-size-m fonte-color-p">VALOR TOTAL: {valorTotal}  <Button  text="Finalizar Pedido" onClick ={this.handleClick}/></p>             
                                                                        
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



