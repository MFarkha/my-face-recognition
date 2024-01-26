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
import ErrorBoundary from './components/errorboundary/ErrorBoundary';

const initialState =  {
  input: '',
  imageUrl: '',
  boxes: [],
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
  calcFaceLocation = (data) => {
    const faceRegions = data.outputs[0].data.regions;
    const boxes = faceRegions.map((region) => {
      const clarifaiFace = region.region_info.bounding_box;
      const image = document.getElementById('inputImage');
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
    });
    return boxes;
  }
  displayFaceBox = (boxes) => {
    this.setState({ boxes });
  }
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }
  onImageSubmit = () => {
    const imageUrl = this.state.input;
    this.setState({ imageUrl });
    fetch(`${process.env.REACT_APP_BACKEND_URL}/imageurl/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        imageUrl: imageUrl
      })
    })
    .then(response => response.json())
    .then(result => {
      if (result) {
        this.imageEntriesUpdate();
        this.displayFaceBox(this.calcFaceLocation(result));
      } else {
        console.log('error: empty result received from api service');
      }
    })
    .catch(error => console.log('error making api call'));
  }
  imageEntriesUpdate = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/image/`, {
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
    .catch(err => console.log('unable to update entries count'))
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
    const { isSignedIn, imageUrl, boxes, route, user } = this.state;
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route === 'home'
          ? <div>
              <Logo />
              <ErrorBoundary>
                <Rank entries={ user.entries } firstname={ user.firstname } />
                <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onImageSubmit}/>
                <FaceRecognition boxes={boxes} imageUrl={imageUrl}/>
              </ErrorBoundary>

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
