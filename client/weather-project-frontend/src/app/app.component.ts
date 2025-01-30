import { Component, OnInit } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
import { WeatherService } from './weather.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule, HttpClientModule],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'weather-project-frontend';
  weatherData: any;
  errorMessage: string = '';
  currentTemp = 0;
  city = '';
  country = '';
  longitude = 0;
  latitude = 0;

  constructor(private weatherService: WeatherService){}

  ngOnInit(): void {
    this.weatherService.getWeather().subscribe(
      data => {
        this.weatherData = data;
        console.log(this.weatherData);
        this.currentTemp = data.main.temp;
        this.city = data.name;
        this.country = data.sys.country;
      },
      error => {
        this.errorMessage = "Failed to connect to API.";
        console.error('Error fetching weather data', error);
      }
    );
}

updateLatLong(){
  console.log("button clicked!!!");
  this.weatherService.getLatLong(this.latitude, this.longitude);
  console.log("set new lat and long to ${this.latitude} and ${this.longitude}");
}

  convertToJson(data: any): string {
    return JSON.stringify(data, null, 2);
  }
}
