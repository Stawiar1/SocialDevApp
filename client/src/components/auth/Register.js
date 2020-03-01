import React, { Fragment, useState } from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom';
import {setAlert} from '../../actions/alert';
import PropTypes from 'prop-types';

const Register = ({ setAlert }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
    });

    const { name, email, password, password2 } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const onSubmit = async e => {
        e.preventDefault();
        if(password !== password2){
            setAlert('Hasła się nie zgadzają' , 'danger')
        }else{
            console.log('SUCCESS')
        }
            
    }

    return (
        <Fragment>
            <h1 className="large text-primary">
                Rejestracja
            </h1>
            <p className="lead"><i className="fas fa-user"></i> Stwórz konto</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input 
                    type="text" 
                    placeholder="Imie" 
                    name='name' 
                    value={name} 
                    onChange={e => onChange(e)} 
                    required />
                </div>
                <div className="form-group">
                    <input 
                    type="email" 
                    placeholder="E-mail" 
                    name='email' 
                    value={email} 
                    onChange={e => onChange(e)} 
                    required />
                    <small className="form-text">
                        This site uses Gravatar, so if you want a profile image, use a
                        Gravatar email
                    </small>
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
                <div className="form-group">
                    <input 
                    type="password" 
                    placeholder="Powtórz hasło" 
                    value={password2} 
                    name='password2'
                    onChange={e => onChange(e)}
                    minLength="6"
                    required
                    />
                </div>
                <input type="submit" value="Stwórz konto" className="btn btn-primary" />
            </form>
            <p className="my-1">
                Masz już konto? <Link to="/login">Zaloguj się!</Link>
            </p>
        </Fragment>
    )
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired, 
};

export default connect(null , {setAlert})(Register);
