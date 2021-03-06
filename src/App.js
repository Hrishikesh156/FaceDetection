import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/logo/logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
 

const app = new Clarifai.App({
    apiKey: '51c32d39940b4850a345f35765878a67'
   });



const particlesOpt={
        
    

        particles: {
            number:{
                value:100,
                density:{
                    enable:true,
                    value_area:1000
                }

            }
           
         }
    }
  






class App extends Component{
    constructor(){
        super();
        this.state={
            input: '',
            imgUrl:'',
            box: '',
            route: 'signin' ,
            isSignedIn: false


        }
    }
    FaceLocation = (data) =>{
       const clarifaiFace= data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimg');
        const width = Number(image.width);
        const height = Number(image.height);
        console.log(width,height);
        console.log(clarifaiFace.left_col);
        return{
            leftCol: clarifaiFace.left_col * width ,
            topRow : clarifaiFace.top_row * height ,
            rightCol : width - (clarifaiFace.right_col * width),
            bottomRow : height - (clarifaiFace.bottom_row*height)
        


        }
    }

    displayFaceBox = (box)  =>{
        this.setState({box:box})
    }
    onInputChange=(event)=>{
        this.setState({input:event.target.value});
    }
     onSubmit=()=>{
         this.setState({imgUrl:this.state.input});
        
         app.models.predict(Clarifai.FACE_DETECT_MODEL,this.state.input)
         .then(response=>this.displayFaceBox(this.FaceLocation(response)))
         .catch(err=>console.log(err));
         

        

    
     }  
     onRouteChange  = (route) => {
         if(route === 'signout'){
             this.setState({isSignedIn:false})
         }
         else if(route=== 'home'){
             this.setState({isSignedIn:true})
         }
        this.setState({route:route});

     } 

    
    render(){
        const {isSignedIn,imgUrl,rout,box} = this.state;
         return(
             <div className="App">
                 <Particles className="particles"
                 params={particlesOpt} />
                 <Navigation isSignedIn={isSignedIn} onRouteChange = {this.onRouteChange} />
                 {  
                    this.state.route === 'home'
                    ?                    
                    <div>
                    <Logo />
                     <Rank />
                     <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
                     <FaceRecognition box = {box} imgUrl = {imgUrl} />
                        </div> 
                    :
                    (
                        this.state.route === 'signin'
                        ? <SignIn onRouteChange = {this.onRouteChange}/>
                        : <Register onRouteChange = {this.onRouteChange}/>


                    )


                 }
                 
                <footer> </footer>
             </div>
         );
     }
 }
 

export default App;