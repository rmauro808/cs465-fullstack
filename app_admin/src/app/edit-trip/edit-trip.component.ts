import { Component, Inject, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';
import { AuthenticationService } from '../services/authentication';
import { BROWSER_STORAGE } from '../storage';

@Component({
  selector: 'app-edit-trip',
  templateUrl: './edit-trip.component.html',
  styleUrls: ['./edit-trip.component.css']
})
export class EditTripComponent implements OnInit {

  editForm: FormGroup;
  submitted = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private tripService: TripDataService,
    private authService: AuthenticationService,
    @Inject(BROWSER_STORAGE) private storage: Storage

  ) { }

  ngOnInit() {
    let tripCode = localStorage.getItem("tripCode");
    if (!tripCode) {
      alert("Something wrong, couldn't find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }

    console.log("EditTripComponent#onInit found tripCode " + tripCode);

    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ["", Validators.required],
      length: ["", Validators.required],
      start: ["", Validators.required],
      resort: ["", Validators.required],
      perPerson: ["", Validators.required],
      image: ["", Validators.required],
      description: ["", Validators.required],
    })

    console.log(
      "EditTripComponent#onInit calling TripDataService#getTrip('" + tripCode + "')"
    );

    this.tripService.getTrip(tripCode)
      .then(data => {
        // console.log(data);

        this.editForm.patchValue(data[0]);

        console.log("patched")
        // using editForm.setValue() will throw a console error
      })

  }

  onSubmit() {
    this.submitted = true;

    if (this.editForm.valid) {
      const jwt = this.storage.getItem('auth-token'); // Get JWT token from storage
      const httpOptions = { // Define http options with Authorization header
        headers: { 'Authorization': `Bearer ${jwt}` }
      };

      this.tripService.updateTrip(this.editForm.value, httpOptions)
        .then(data => {
          console.log(data);

          this.router.navigate(['list-trips']);
        });
    }
  }


  // get the form short name to access the form fields
  get f() {
    return this.editForm.controls;
  }

}
