import React from 'react';
import '../components/App.css';
import '../components/Input.css';
import logo from '../images/logo.png';
import Button from '../components/button';
import firebase from '../firebaseConfig';
import withFirebaseAuth from 'react-with-firebase-auth';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
const firebaseAppAuth = firebase.auth();

const database = firebase.firestore();

class Home extends React.Component {
 constructor(props) {
   super(props);
   this.state = {
     displayName: "",
     email: "",
     senha: "",
     tipo: "salao",
     showLogin:true,
     showCadastro:false
     

   }
 }    
 
  handleChange = (event, element) => {
   const newState = this.state;
   newState[element] = event.target.value
   this.setState(newState);
 } 
 
  showCadastro(){
    this.setState({
      showLogin:false,
      showCadastro:true    
    })
  }

  showLogin(){
    this.setState({
      showLogin:true,
     showCadastro:false
    })
  }
 
  createUser = (e) => {
   e.preventDefault();
   this.props.createUserWithEmailAndPassword
     (this.state.email, this.state.senha)
     .then(resp => {
      if(resp){
       console.log(resp)
       const id = resp.user.uid;
       database.collection('users').doc(id).set({
         email: this.state.email,
         displayName: this.state.displayName,
         tipo: this.state.tipo
       })
       .then(() =>{
          this.props.history.push(`/${this.state.tipo}`);
         alert("usuário criado")
        });
      }

    })
     .catch(error => alert(error));
  }  

 signIn = (e) => {
  e.preventDefault();
   this.props.signInWithEmailAndPassword(this.state.email, this.state.senha)
   .then((resp) => { 
     const id = resp.user.uid;
     database.collection('users').doc(id).get()
     .then(resp =>{
       const data = resp.data();
        this.props.history.push(`/${data.tipo}`);
      })
    });
 }  
 render() {
   if(this.props.error){
     alert(this.props.error)
   }  

   return (
     <div className="App">
       <header className="App-header  ">
         <div className="background-image">
           <figure className="logo"><img src={logo}></img></figure>
         </div>
         <main className="containerLogin">
            <ul className="edit-align">
              <li className="sign-in font-size-m choice-login fonte-color-p"  onClick={()=>this.showLogin()} >LOGIN</li>
              
              <li className="sign-up font-size-m choice-login fonte-color-p" onClick={()=>this.showCadastro()}>CADASTRO</li>
            </ul>
            {
                this.state.showLogin?

                <form className="section-sign-in divLogin active ">
                
                <input className="sign-in-email rounded-border" value={this.state.email} placeholder="Digite seu email" onChange={(e) => this.handleChange(e, "email")} />
                <input className="sign-in-password rounded-border" value={this.state.senha} placeholder="Digite sua senha" onChange={(e) => this.handleChange(e, "senha")} />
                <section>
                  <Button className="sign-in-button " text="LOGAR" onClick={this.signIn} />
                </section>
              </form>
             :null
            }
           {
                this.state.showCadastro?
                
                  
                  <form className="section-sign-in divCadastro ">
                    <input className="sign-up-name rounded-border" value={this.state.displayName} placeholder="name completo" onChange={(e) => this.handleChange(e, "displayName")} />
                    <input className="sign-in-email rounded-border" value={this.state.email} placeholder="Digite seu email" onChange={(e) => this.handleChange(e, "email")} />
                    <input className="sign-in-password rounded-border" value={this.state.senha} placeholder="Digite sua senha" onChange={(e) => this.handleChange(e, "senha")} />
                    <select onChange={(e) => this.handleChange(e, "tipo")} className="rounded-border">
                      <option value="Salao" >Salão</option>
                      <option value="Cozinha">Cozinha</option>
                    </select>
                    <section>
                      <Button className="sign-in-button " text="CADASTRAR" onClick={this.createUser} />
                    </section>
                  </form>

               
                :null
              }

         </main>
       </header>
     </div>
   )
 }

}export default withFirebaseAuth({ firebaseAppAuth, })(Home);

