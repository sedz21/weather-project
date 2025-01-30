import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class WeatherService {
  longitude = -71.0565;
  latitude = 42.3555;
  //private apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=Boston&appid=11de3a2ba43cf4529505a783d47859b9';
  //private apiKey = '11de3a2ba43cf4529505a783d47859b9';
  private apiUrlCurrentLatLong = 'https://api.openweathermap.org/data/2.5/weather?lat=42.3555&lon=-71.0565&appid=11de3a2ba43cf4529505a783d47859b9';

  constructor(private http: HttpClient) { }

  getLatLong(number1: number, number2: number){
    this.latitude = number1;
    this.longitude = number2;
    this.apiUrlCurrentLatLong = 'https://api.openweathermap.org/data/2.5/weather?lat=${number1}&lon=${number2}&appid=11de3a2ba43cf4529505a783d47859b9';
  }

  getWeather(): Observable<any> {
    //const url = ${this.apiUrl}?q=${city}&appid=${this.apiKey};
    return this.http.get(this.apiUrlCurrentLatLong);
  }
}
