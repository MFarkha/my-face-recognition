import React from "react";

class Register extends React.Component {
    constructor() {
        super();
        this.state = {
            firstname: '',
            email: '',
            password: '',
            error: ''
        }
    }
    onEmailChange = (event) => {
        this.setState({email: event.target.value})
    }
    onPasswordChange = (event) => {
        this.setState({password: event.target.value})
    }
    onFirstNameChange = (event) => {
        this.setState({firstname: event.target.value})
    }
    onSubmitRegister = () => {
        fetch('http://localhost:3001/register/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                firstname: this.state.firstname,
                email: this.state.email,
                password: this.state.password
            })
        })
        .then(response => response.json())
        .then(user => {
            if (user.id) {
                this.props.loadUser(user);
                this.props.onRouteChange('home');
            } else {
                this.setState({ error: 'unable to register' } );
            }
        })
        .catch(err => {
            // console.log(err);
            this.setState({ error: 'unable to register' } );
        })
    }
    render() {
        return (
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
            <main className="pa4 black-80">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                    <legend className="f2 fw6 ph0 mh0">Register</legend>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f4" htmlFor="firstName">First Name</label>
                        <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="text" name="firstName" id="firstName" onChange={ this.onFirstNameChange }/>
                    </div>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f4" htmlFor="email-address">Email</label>
                        <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address" onChange={ this.onEmailChange }/>
                    </div>
                    <div className="mv3">
                        <label className="db fw6 lh-copy f4" htmlFor="password">Password</label>
                        <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password" onChange={ this.onPasswordChange }/>
                    </div>
                    </fieldset>
                    {
                        (this.state.error.length!==0)
                        ? <small className="f5 red b" id="comment-desc">
                          ${this.state.error}
                          </small>
                        : <></>
                    }
                    <div className="">
                    <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f4 dib" type="submit" value="Register" onClick={ this.onSubmitRegister }/>
                    </div>
                </div>
            </main>
            </article>
        );
    }
}
export default Register;