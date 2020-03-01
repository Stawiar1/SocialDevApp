import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div>
            <section className="landing">
                <div className="dark-overlay">
                    <div className="landing-inner">
                        <h1 className="x-large">SocialDev App</h1>
                        <p className="lead">Jesteś developerem? Stwórz swój profil , umieść swoje
                            portfolio , zamieszczaj posty oraz uzyskaj pomoc od innych programistów!
                        <p className="building">STRONA W TRAKCIE BUDOWY</p>
                            <div className="buttons">
                                <Link to="/register" className="btn btn-primary">Rejestracja</Link>
                                <Link to="/login" className="btn btn">Logowanie</Link>
                            </div>
                        </p>

                    </div>
                </div>
            </section>
        </div>
    )
}

export default Landing;
