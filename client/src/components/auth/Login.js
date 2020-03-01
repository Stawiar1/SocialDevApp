import React, { Fragment, useState } from 'react';
import {Link} from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const {email, password} = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const onSubmit = async e => {
        e.preventDefault();
        console.log('SUCCESS')    
    }

    return (
        <Fragment>
            <h1 className="large text-primary">
                Zaloguj się
            </h1>
            <p className="lead"><i className="fas fa-user"></i> Zaloguj się</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input 
                    type="email" 
                    placeholder="E-mail" 
                    name='email' 
                    value={email} 
                    onChange={e => onChange(e)} 
                    required />
                </div>
                <div className="form-group">
                    <input 
                    type='password' 
                    placeholder='Hasło(min. 6 znaków)'
                    minLength='6'
                    name='password'
                    value={password} 
                    onChange={e => onChange(e)}
                    required
                    />
                </div>
                <input type="submit" value="Zaloguj się" className="btn btn-primary" />
            </form>
            <p className="my-1">
                Nie masz jeszcze konta? <Link to="register">Utwórz je!</Link>
            </p>
        </Fragment>
    )
}

export default Login;
