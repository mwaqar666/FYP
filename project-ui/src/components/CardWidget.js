import React, { Component } from 'react';
import { Card } from 'react-bootstrap';

class CardWidget extends Component {
    render() {
        return (
            <Card className="w-100">
                <Card.Body>
                    <p>{this.props.title}</p>
                    <Card.Text className="display-5" style={{ textAlign: 'right' }}>{this.props.value}</Card.Text>
                </Card.Body>
            </Card>
        );
    }
}

export default CardWidget
