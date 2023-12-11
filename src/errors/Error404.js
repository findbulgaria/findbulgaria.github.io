import React from 'react';
import { Link } from 'react-router-dom';

function Error404(){
    return(
        <div>
            <h1>404 Not Found</h1>
            <p>Die Seite, die du suchst, existiert nicht.</p>
            <p>Bitte überprüfe die URL oder gehe zurück zur <Link to="/">Startseite</Link>.</p>
        </div>
    )
}
export default Error404;