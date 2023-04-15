import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Trip } from '../models/trip';
import { AuthResponse } from '../models/authresponse';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {

  constructor(
    private http: HttpClient
  ) { }

  private apiBaseUrl = 'http://localhost:3000/api/';
  private tripUrl = `${this.apiBaseUrl}trips/`;

  public addTrip(formData: Trip): Promise<Trip> {
    console.log('Inside TripDataService#addTrip');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('tripplanner-token')}`
      })
    };
    return this.http
      .post<Trip>(this.tripUrl, formData, httpOptions)
      .toPromise()
      .catch(this.handleError);
  }

  public getTrip(tripCode: string): Promise<Trip> {
    console.log('Inside TripDataService#getTrip(tripCode)');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('tripplanner-token')}`
      })
    };
    return this.http
      .get<Trip>(this.tripUrl + tripCode, httpOptions)
      .toPromise()
      .catch(this.handleError);
  }

  public getTrips(): Promise<Trip[]> {
    console.log('Inside TripDataService#getTrips');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('tripplanner-token')}`
      })
    };
    return this.http
      .get<Trip[]>(this.tripUrl, httpOptions)
      .toPromise()
      .catch(this.handleError);
  }

  updateTrip(trip: Trip, httpOptions): Promise<any> {
    const url = `${this.tripUrl}/${trip._id}`;
    return this.http.put(url, trip, httpOptions)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('Something has gone wrong', error);
    return Promise.reject(error.message || error);
  }

  public login(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('login', user);
  }

  public register(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('register', user);
  }

  private makeAuthApiCall(urlPath: string, user: User): Promise<AuthResponse> {
    const url: string = `${this.apiBaseUrl}${urlPath}`;
    return this.http
      .post<AuthResponse>(url, user)
      .toPromise()
      .catch(this.handleError);
  }
}
