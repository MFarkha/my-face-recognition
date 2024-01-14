import './App.css';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm';
import Rank from './components/rank/Rank';
import ParticlesBg from 'particles-bg';
import FaceRecognition from './components/facerecognition/FaceRecognition';
import { Component } from 'react';
import SignIn from './components/signin/SignIn';
import Register from './components/register/Register';

const initialState =  {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: "",
    firstname: "",
    email: "",
    entries: 0,
    joined: ""
  }
}
class App extends Component {
  constructor () {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        firstname: data.firstname,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }
  setupClarifai = (imageUrl) => {
    const PAT = '8e814405291e431ab755b4e1a34acf90';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'famaten';
    const APP_ID = 'my-smart-brain-app';
    const MODEL_ID = 'face-detection';
    const IMAGE_URL = imageUrl;
    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
    });
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };
    return [requestOptions, MODEL_ID]
  }
  calcFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }
  displayFaceBox = (box) => {
    this.setState( {box} );
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  onImageSubmit = () => {
    this.setState({imageUrl: this.state.input});
    const [OPTIONS, MODEL_ID] = this.setupClarifai(this.state.input);
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", OPTIONS)
    .then(response => response.json())
    .then(result => {
      if (result) {
        this.imageEntriesUpdate();
        this.displayFaceBox(this.calcFaceLocation(result));
      }
    })
    .catch(error => console.log('error', error));
  }
  imageEntriesUpdate = () => {
    fetch('http://localhost:3001/image/', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: this.state.user.id
      })
    })
    .then(response => response.json())
    .then(data => {
        if (data) {
          this.setState(Object.assign(this.state.user, { entries: data }));
        }
    })
    .catch(err => console.log(err))
  }
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route});
  }
  render() {
    const {isSignedIn, imageUrl, box, route, user} = this.state;
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route === 'home'
          ? <div>
              <Logo />
              <Rank entries={ user.entries } firstname={ user.firstname } />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onImageSubmit}/>
              <FaceRecognition box={box} imageUrl={imageUrl}/>
            </div>
          : (
              route === 'signin'
              ? <SignIn onRouteChange={this.onRouteChange} loadUser={ this.loadUser } />
              : <Register onRouteChange={this.onRouteChange} loadUser={ this.loadUser }/>
            )
        }
      </div>
    );
  }
}

export default App;
