import React from 'react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Nav from './layout/Nav';

const App = React.createClass({

    render() {
        return (
            <div>
                <Header />
                <Nav />
                <div className="container">
                    <div className="wrapper">
                        { this.props.children }
                    </div>
                </div>
                <Footer />
            </div>
        );
    },
});

export { App as default };
