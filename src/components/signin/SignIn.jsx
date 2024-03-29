import { Component } from 'react';
class SignIn extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            error: ""
        }
    }
    onEmailChange = (event) => {
        this.setState({email: event.target.value})
    }
    onPasswordChange = (event) => {
        this.setState({password: event.target.value})
    }
    
    onSubmitSignIn = (e) => {
        if ((e.code) && e.code!== 'Enter') {
            return
        }
        fetch(`${process.env.REACT_APP_BACKEND_URL}/signin/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.userId && data.success==='true') {
                this.props.saveAuthTokenInSession(data.token);
                this.props.fetchUser(data.userId, data.token);
                this.props.onRouteChange('home');
            } else {
                this.setState({ error: 'wrong credentials' } );
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({ error: 'wrong credentials' } );
        })
    }
    render() {
        const { onRouteChange } = this.props;
        return (
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
            <main className="pa4 black-80">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                    <legend className="f2 fw6 ph0 mh0">Sign In</legend>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f4" htmlFor="email-address">Email</label>
                        <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address" onChange={ this.onEmailChange }/>
                    </div>
                    <div className="mv3">
                        <label className="db fw6 lh-copy f4" htmlFor="password">Password</label>
                        <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password" onChange={ this.onPasswordChange } onKeyDown={ this.onSubmitSignIn }/>
                    </div>
                    </fieldset>
                    <div className="">
                    <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f4 dib" type="submit" value="Sign in" onClick={ this.onSubmitSignIn }/>
                    </div>
                    {
                        (this.state.error==='wrong credentials')
                        ? <small className="f5 red b" id="comment-desc">
                          Wrong credentials
                          </small>
                        : <></>
                    }
                    <div className="lh-copy mt3">
                    <p onClick={ () => onRouteChange('register') }
                        className="f4 link dim black db underline pointer">Register
                    </p>
                    </div>
                </div>
            </main>
            </article>
        );
    }
}

export default SignIn;