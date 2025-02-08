import { Component, OnInit } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
import { WeatherService } from './weather.service';
import { UserRegistrationService } from './user-registration.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule} from '@angular/forms';
import { response } from 'express';

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
  displayedError: string = ''
  searchMethod = 'city';
  currentTemp = 0;
  city = '';
  country = '';
  longitude = 0;
  latitude = 0;
  temp_long = 0;
  temp_lat = 0;
  temp_city = '';
  temp_country = ''
  country_list: string[] = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", 
    "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", 
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", 
    "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", 
    "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", 
    "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Congo (Congo-Kinshasa)", 
    "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", 
    "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", 
    "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", 
    "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", 
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", 
    "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", 
    "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", 
    "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", 
    "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", 
    "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", 
    "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", 
    "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", 
    "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", 
    "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", 
    "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", 
    "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", 
    "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", 
    "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", 
    "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", 
    "Yemen", "Zambia", "Zimbabwe"];

  temp_username: string = '';
  temp_email: string = '';
  temp_password: string = '';
  userReq: string = 'SignUp';
  signUpResponse: string = '';
  logInResponse: string = '';


  constructor(private weatherService: WeatherService, private userService: UserRegistrationService){}

  ngOnInit(): void {
    console.log("ngOnInit() call...");
}

  toggleSignUpLogIn(){
    if (this.userReq === 'SignUp'){
      this.userReq = 'LogIn';
    }
    else{
      this.userReq = 'SignUp';
    }
  }

  userSignUp(){
    console.log("sign-up button clicked.");

    // call the service sign up function
    this.userService.signUp(this.temp_username, this.temp_email, this.temp_password).subscribe({
      next: (response) => {console.log('Sign up successful:', response),
        this.signUpResponse = 'Log In Success';
      },
      error: (err) => {console.log("Sign-up error:", err),
        this.signUpResponse = err.error.error;
      }
    });
  }

  userLogIn(){
    console.log("log in button clicked");
    this.userService.logIn(this.temp_username, this.temp_password).subscribe({
      next: (response) => {console.log('Log in success:', response),
        this.logInResponse = 'Sign Up Success';
      },
      error: (err) => {console.log('Log in error:', err),
        this.logInResponse = err.error.error;
      }
    });
  }

  onSearch(){
    this.errorMessage = '';
    this.displayedError = '';
    console.log("onSearch() button clicked, proceeding with API call...")
    if (this.searchMethod === 'city'){
      console.log("search method by city, proceed...");
      this.weatherService.searchCity(this.temp_city, this.temp_country).subscribe(
        data => {
          this.weatherData = data;
          this.currentTemp = this.convertKtoF(this.weatherData.main.temp);
          this.city = this.weatherData.name;
          this.country = this.weatherData.sys.country;
          console.log(this.weatherData)
          console.log("got API data from search by city");
        },
        error => {
          this.errorMessage = "API error";
          this.displayedError = "Error, " + this.temp_city + " in " + this.temp_country + " not found. Please try again.";
          console.error('API Error', error);
        }
      )
    }
    else{
      console.log("search method by coordinates, proceed...")
      this.weatherService.searchLatLong(this.temp_lat, this.temp_long).subscribe(
        data => {
          this.weatherData = data;
          this.currentTemp = this.convertKtoF(this.weatherData.main.temp);
          this.city = this.weatherData.name;
          this.country = this.weatherData.sys.country;
          this.latitude = this.temp_lat;
          this.longitude = this.temp_long;
          console.log(this.weatherData)
          console.log("got API data from search by coordinates");
        },
        error => {
          this.errorMessage = "API error";
          this.displayedError = "Error, weather data at Latitude: " + this.temp_lat + " and Longitude: " + this.temp_long + "not found. Please try again.";
          console.error('API Error', error);
        }
      )
    }
  }

  searchByLatLong(){
    console.log("search button clicked, sending requested coordinates to weatherService");
    this.weatherService.searchLatLong(this.latitude, this.longitude);
    console.log("sent new coordinates request to weatherService");
  }

  searchByCity(){
    console.log("search button clicked, sending requested city to weatherService");
    this.weatherService.searchCity(this.city, this.country);
    console.log("sent new city request to weatherService");
  }

  convertKtoF(kelvin: number){
    return Math.round(((kelvin - 273.15) * 1.8) + 32);
  }

  toggleSearchMode(){
    if (this.searchMethod == 'city'){
      this.searchMethod = 'coordinates';
    }
    else{
      this.searchMethod = 'city';
    }
  }
}
