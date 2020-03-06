import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import './style.css'
import axios from 'axios'

class DayWeather extends Component {

    getWeather = async () => {
        await axios.get("http://api.openweathermap.org/data/2.5/weather?q=Oran,dz&APPID=f1cc3e6fd7c2d8b919ac7c4665bf0ed2")
            .then(response => {
                console.log('data', response.data)
                this.setState({
                    weather: response.date
                })
            })
            .catch(err => {
                console.log(err);
            })
    }

    componentDidMount = () => {
        //this.getWeather();
    }

    render() {
        return (

            <Col md="2" className="mx-auto daydiv text-center px-1">
                <h5 className="mb-0">{this.props.day}</h5>
                <span>{this.props.date}</span>
                <br/>
                <img src={this.props.icon} alt="Weather" />
                <br />
                <span style={{fontSize:"13px", width:"100%"}}>
                    {this.props.description}
                </span>
                <br/>
                {this.props.temperature}
                <br />
                {this.props.wind}
            </Col>

        )
    }

}

export default DayWeather