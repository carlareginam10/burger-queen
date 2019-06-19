import React from 'react';
import '../components/App.css';
import '../components/Input.css';
import Logo from '../images/logo.png';
import del from '../images/del.png';
import Button from '../components/button';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import firebase from '../firebaseConfig';
import withFirebaseAuth from 'react-with-firebase-auth';
import DataCoffe from "../data/menuCoffe";
import DataLunch from  "../data/menuLunch";

const firebaseAppAuth = firebase.auth();
const database = firebase.firestore();


class Hall extends React.Component{
  constructor(props){
    super(props);
    this.state = {     
      clientName: "",
      userName: "", 
      amountToPay:"",    
      buy: [],
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
    database.collection('ordered').get()
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

  resetForm = () => {
    this.setState({
        ...this.state,
        clientName: "",
        userName: "",     
        buy: [],
    })
  }

  handleClick = ()=> {
    const object = {
      clientName: this.state.clientName,   
      userName: this.state.userName,
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
                    <Button text="CAFÉ DA MANHÃ" onClick={()=>this.showCoffe()}></Button>
                    <Button text="ALMOÇO" onClick={()=>this.showLunch()}></Button>
                    <Button text="PEDIDOS REALIZADOS" onClick={()=>this.showOrder()}></Button>
                  </ul>
               </main>                       
                  <div className="container-section">       
                    <input className="sign-up-name rounded-border" value={this.state.clientName} placeholder="Digite o nome do cliente" onChange={(e)=> this.handleChange(e,"clientName")} />
                  </div>
                <hr></hr>
                <Container>
                  <Row>
                    {
                      this.state.showCoffe?
                      <Col xs={6} >
                        <p className="align-left font-size-m fonte-color-p">CARDÁPIO CAFÉ DA MANHÃ</p>                                                     
                          {
                            DataCoffe.map((item, i)=>{                
                              return <div>                                         
                                        <button className="item-button button-style" key={i} onClick={()=> {this.clickBuy(item)}}>{item.nameItem} - {item.price} </button>
                                      </div>
                                }
                              )}      
                        </Col>
                    :null}
                    {
                      this.state.showLunch?
                      <Col xs={6} >
                        <p className="align-left font-size-m fonte-color-p">CARDÁPIO ALMOÇO</p>                                                     
                        {
                          DataLunch.map((item, i)=>{                
                            return <div>                                         
                                      <button className="item-button button-style" key={i} onClick={()=> {this.clickBuy(item)}}>{item.nameItem} - {item.price} </button>
                                   </div>
                                }
                              )}      
                        </Col>
                      :null }
                      {
                        this.state.showOrder?
                        <Col xs={6} >
                            <p className="align-left font-size-m fonte-color-p">PEDIDOS REALIZADOS</p>  
                          {                         
                            this.state.listIntem.map(item =>{
                               return <div>                               
                                  <button className="button-style-order button-order button-style" > 
                                      <p>{item.clientName} </p>
                                  </button>                           
                              </div>
                             })
                          } 
                        </Col>
                      :null }
                      <Col xs={6} md="auto"> 
                      <p className="align-left font-size-m fonte-color-p">PEDIDO: {this.state.clientName
                      }</p>                    
                          {
                            this.state.buy.map((product, i)=>{
                              return <div>
                                <button className="item-button button-style" key={i}> {product.quant} - {product.nameItem} : {product.price * product.quant} </button>
                                  <img className="img-del" onClick ={this.delEvent.bind(this, i)} src={del}></img>
                              </div>
                            })
                          }                         
                       </Col>
                    </Row>                    
                </Container>
                <hr></hr>
                <Container>
                    <Row> 
                      <Col xs={6}>  
                        <p className=" font-size-m fonte-color-p padding-top">GARÇON: </p>             
                      </Col>
                      <Col xs={6}>  
                        <p className="align-right font-size-m fonte-color-p">VALOR TOTAL: {amountToPay}  <Button  text="Finalizar Pedido" onClick ={this.handleClick}/></p>             
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
})(Hall);



