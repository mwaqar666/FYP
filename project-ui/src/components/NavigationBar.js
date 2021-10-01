import React, { Component } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'

export default class NavigationBar extends Component {
    render() {
        return (
            <div>
                <Navbar fixed="top" bg="primary" variant="dark">
                    <Container>
                        <Navbar.Brand href="#home">Macro Nutrient Detector</Navbar.Brand>
                        <Nav className="me-auto"></Nav>
                        <Nav>
                            <Nav.Link onClick={this.props.readValues}>Read Values</Nav.Link>
                            <Nav.Link onClick={this.props.resetValues}>Reset</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>
            </div>
        );
    }
}
