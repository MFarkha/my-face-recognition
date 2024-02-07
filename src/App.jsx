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
import Modal from './components/modal/Modal';
import Profile from './components/profile/Profile';

const initialState =  {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: "",
    firstname: "",
    email: "",
    entries: 0,
    joined: "",
    pet: "",
    age: ""
  }
}
class App extends Component {
  constructor () {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    const token = window.sessionStorage.getItem('token');
    if (token) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/signin/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer: ${token}`
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.userId) {
            this.fetchUser(data.userId, token);
          } else {
            throw new Error(`An error receiving the user id`);
          }
        })
        .catch(console.log);
    }
  }
  fetchUser = (userId, token) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer: ${token}`
      },
      })
      .then(resp => resp.json())
      .then(user => {
        if (user && user.email) {
          this.loadUser(user);
        }
        this.onRouteChange('home');
      })
      .catch(err => console.log('error getting the user data'))
  }
  saveAuthTokenInSession = (token) => {
    window.sessionStorage.setItem('token', token);
  }
  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        firstname: data.firstname,
        email: data.email,
        age: data.age,
        pet: data.pet,
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
  onImageSubmit = (e) => {
    if ((e.code) && e.code!== 'Enter') {
      return
    }
    const imageUrl = this.state.input;
    this.setState({ imageUrl });
    const token = window.sessionStorage.getItem('token');
    return fetch(`${process.env.REACT_APP_BACKEND_URL}/imageurl/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer: ${token}`
      },
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
          console.log('error: an empty result received from api service');
        }
      })
      .catch(error => console.log('error making api call:'));
  }
  imageEntriesUpdate = () => {
    const token = window.sessionStorage.getItem('token');
    return fetch(`${process.env.REACT_APP_BACKEND_URL}/image/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer: ${token}`
      },
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
  handleSignOut = () => {
    const token = window.sessionStorage.getItem('token');
    if (token) {
      return fetch(`${process.env.REACT_APP_BACKEND_URL}/signout/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer: ${token}`
        },
        })
        .then(response => response.json())
        .then((data) => {
          if (data.success) {
            return window.sessionStorage.clear();
          } else {
            throw new Error();
          }
        })
        .catch(err => console.log('A sign out error'));
    }
  }
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.handleSignOut();
      return this.setState(initialState);
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route });
  }
  toggleModal = () => {
    this.setState(prevState => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }))
  }
  render() {
    const { isSignedIn, imageUrl, boxes, route, user, isProfileOpen } = this.state;
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}
          toggleModal={this.toggleModal}/>
        { isProfileOpen && 
            <Modal>
              <Profile user={user} isProfileOpen={isProfileOpen}
                toggleModal={this.toggleModal} loadUser={this.loadUser}/>
            </Modal>
        }
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
              ? <SignIn onRouteChange={this.onRouteChange} 
                  fetchUser={ this.fetchUser } saveAuthTokenInSession={this.saveAuthTokenInSession}/>
              : <Register onRouteChange={this.onRouteChange}
                  fetchUser={ this.fetchUser } saveAuthTokenInSession={this.saveAuthTokenInSession}/>
              )
        }
      </div>
    );
  }
}

export default App;
