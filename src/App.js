import React from 'react';
import './App.css';
import DayWeather from './components/DayWeather/DayWeather'
import moment from 'moment'
import axios from 'axios'
import { Row, Col, Container, Input, Button, InputGroup } from 'reactstrap'
import Loader from 'react-loader-spinner'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
const API_KEY = "f1cc3e6fd7c2d8b919ac7c4665bf0ed2"

/* global google */

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      address: '',
      coordinates: {
        lat: null,
        lng: null
      },
      weather: '',
      Lat: '',
      Lon: '',
      city: '',
    }
  }


  WeatherDays = () => {
    let days = []
    for (let i = 0; i < 5; i++) {
      days.push(
        <DayWeather
          key={i}
          day={moment().add(i, 'days').format('dddd')}
          date={moment().add(i, 'days').format('DD, MMM')}
          icon={this.state.weather.list[i * 8].weather ? "http://openweathermap.org/img/wn/" + this.state.weather.list[i * 8].weather[0].icon + "@2x.png" : ""}
          description={this.state.weather.list[i * 8].weather ? this.state.weather.list[i * 8].weather[0].description : "-"}
          temperature={(this.state.weather.list ? this.state.weather.list[i * 8].main.temp : this.state.weather.main.temp) + "°C"}
          wind={(this.state.weather.list ? this.state.weather.list[i * 8].wind.speed : this.state.weather.wind.speed) + "m/s"}

        />
      )
    }
    return days
  }

  getWeatherByLatLon = async () => {
    
    await axios.get("http://api.openweathermap.org/data/2.5/forecast?units=metric&lat=" + this.state.Lat + "&lon=" + this.state.Lon + "&appid=" + API_KEY)
      .then(response => {
        this.setState({
          weather: response.data
        }, () => console.log(this.state.weather))
      })
      .catch(err => {
        console.log(err)
      })
  }
  getWeatherByMyLatLon = () => {
    navigator.geolocation.getCurrentPosition((pos) => this.setState({ Lat: pos.coords.latitude, Lon: pos.coords.longitude }, () => console.log('Lat', this.state.Lat)), () => console.log('Failed!'),
    () => this.getWeatherByMyLatLon)
  }

  getWeatherByCityName = async () => {
    await axios.get("http://api.openweathermap.org/data/2.5/forecast?units=metric&q=" + this.state.city + "&appid=" + API_KEY)
      .then(response => {
        this.setState({
          weather: response.data
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleChange = (e) => {
    if (e) {
      this.setState({
        city: e.target.value
      }, () => { console.log('city', this.state.city) })
    }

  }

  componentDidMount = () => {
    navigator.geolocation.getCurrentPosition((pos) => this.setState({ Lat: pos.coords.latitude, Lon: pos.coords.longitude }, () => console.log('Lat', this.state.Lat)), () => console.log('Failed!'))
    console.log("http://api.openweathermap.org/data/2.5/weather?lat=" + this.state.Lat + "&lon=" + this.state.Lon + "&appid=" + API_KEY)
  }

  onMove = (event) => {
    console.log('CENTER', event.target.getCenter())
    this.setState({
      Lat: event.target.getCenter().lat,
      Lon: event.target.getCenter().lng
    })
  }

  render() {
    return (
      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <p>
      //       Edit <code>src/App.js</code> and save to reload.
      //     </p>
      //     <a
      //       className="App-link"
      //       href="https://reactjs.org"
      //       target="_blank"
      //       rel="noopener noreferrer"
      //     >
      //       Learn React
      //     </a>
      //   </header>
      // </div>
      <div className="text-center">
        <h1 style={{ textAlign: "center", color: "white" }}>MY WEATHER APP</h1>
        <div className="w-100 text-center">
          <InputGroup className="w-50 mx-auto">
            <Input type="text" onChange={this.handleChange} placeholder="Type a city ..." className="mx-auto my-3" />
            <Button onClick={this.getWeatherByCityName} className="mx-auto my-auto">Search</Button>
          </InputGroup>
          
          {/* <PlacesAutocomplete
            value={this.state.address}
            onChange={this.setAddress}
            onSelect={this.handleSelect}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div>
                <Input className="w-50 mx-auto" {...getInputProps({ placeholder: "Choose an address ..." })} />
                <div>
                  {loading ? <div>Loading...</div> : null}
                  {suggestions.map((suggestion) => {
                    const style = {
                      backgroundColor: suggestion.active ? "#DDDDDD" : "transparent"
                    }
                    return <div {...getSuggestionItemProps(suggestion, { style })}>
                      {suggestion.description}
                    </div>
                  })}
                </div>
              </div>
            )}

          </PlacesAutocomplete> */}
        </div>


        {this.state.weather ?
          <div>
            <h3 className="text-center my-4 text-white">{this.state.weather.city.name + ", " + (this.state.weather.city ? this.state.weather.city.country : '')}</h3>
            <Container className="mb-4">
              <Row className="seven-cols mb-4">
                {this.WeatherDays()}
              </Row>
            </Container>
          </div>
          :
          null
        }
        <Map center={[this.state.Lat, this.state.Lon]} zoom={10} onmoveend={this.onMove}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
        </Map>
        <Button className="mx-auto mb-3" onClick={this.getWeatherByLatLon}>Confirm selected position</Button>
        <br/>
        <Button className="mx-auto mb-3" onClick={this.getWeatherByMyLatLon}>Detect my position</Button>

      </div>
    );
  }
}

export default App;
