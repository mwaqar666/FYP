import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CardWidget from './components/CardWidget';
import { Col, Container, Row } from 'react-bootstrap';
import NavigationBar from './components/NavigationBar';
import axios from 'axios';

class App extends Component {
  state = {
    apiData: {
      'Voltage Drop': '0 V',
      // 'Soil Resistance': '0 Ωm',
      'EC': '0 mS/cm',
      'Temperature': '0 °C',
      'pH': '0',
      'Moisture': '0 %',
      'Nitrogen': '0 mg/kg',
      'Phosphorus': '0 mg/kg',
      'Pottassium': '0 mg/kg',
    }
  }

  constructor() {
    super();

    this.resetValues = this.resetValues.bind(this);
    this.readValues = this.readValues.bind(this);
    this.setValues = this.setValues.bind(this);
  }

  async readValues() {
    const { data } = await axios.get('http://localhost:3001/get-data');

    this.setValues({
      'Voltage Drop': `${Number(data.Voltage_drop.toPrecision(3))} V`,
      // 'Soil Resistance': `${Number(data.R_Soil.toPrecision(3))} Ωm`,
      'EC': `${Number(data['EC-mS/cm'].toPrecision(3))} mS/cm`,
      'Temperature': `${Number(data.Temperature.toPrecision(3))} °C`,
      'pH': Number(data.pH.toPrecision(3)),
      'Moisture': `${Number(data.Mositure.toPrecision(3))} %`,
      'Nitrogen': `${Number(data.nitrogen.toPrecision(3))} mg/kg`,
      'Phosphorus': `${Number(data.phosphorus.toPrecision(3))} mg/kg`,
      'Pottassium': `${Number(data.potassium.toPrecision(3))} mg/kg`,
    });
  }

  setValues(values) {
    this.setState({
      apiData: values,
    });
  }

  resetValues() {
    this.setValues({
      'Voltage Drop': '0 V',
      // 'Soil Resistance': '0 Ωm',
      'EC': '0 mS/cm',
      'Temperature': '0 °C',
      'pH': '0',
      'Moisture': '0 %',
      'Nitrogen': '0 mg/kg',
      'Phosphorus': '0 mg/kg',
      'Pottassium': '0 mg/kg',
    });
  }

  render() {
    return (
      <div className="App">
        <NavigationBar readValues={this.readValues} resetValues={this.resetValues} />
        <Container className="mt-5 mb-3">
          <Row>
            {
              Object.entries(this.state.apiData).map(([name, value], index) => {
                return (
                  <Col key={index} md="6" sm="6" xs="6" className="mt-3">
                    <CardWidget title={name} value={value} />
                  </Col>
                );
              })
            }
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
