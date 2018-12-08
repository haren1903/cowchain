/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CowService } from './Cow.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-cow',
  templateUrl: './Cow.component.html',
  styleUrls: ['./Cow.component.css'],
  providers: [CowService]
})
export class CowComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  cowId = new FormControl('', Validators.required);
  birthdate = new FormControl('', Validators.required);
  breed = new FormControl('', Validators.required);
  registrationDate = new FormControl('', Validators.required);
  isRegistered = new FormControl('', Validators.required);
  isHealthy = new FormControl('', Validators.required);
  isSlaughtered = new FormControl('', Validators.required);
  weight = new FormControl('', Validators.required);
  owner = new FormControl('', Validators.required);
  operator = new FormControl('', Validators.required);
  vet = new FormControl('', Validators.required);
  slaughter = new FormControl('', Validators.required);
  father = new FormControl('', Validators.required);
  mother = new FormControl('', Validators.required);

  constructor(public serviceCow: CowService, fb: FormBuilder) {
    this.myForm = fb.group({
      cowId: this.cowId,
      birthdate: this.birthdate,
      breed: this.breed,
      registrationDate: this.registrationDate,
      isRegistered: this.isRegistered,
      isHealthy: this.isHealthy,
      isSlaughtered: this.isSlaughtered,
      weight: this.weight,
      owner: this.owner,
      operator: this.operator,
      vet: this.vet,
      slaughter: this.slaughter,
      father: this.father,
      mother: this.mother
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceCow.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'ch.cowchain.Cow',
      'cowId': this.cowId.value,
      'birthdate': this.birthdate.value,
      'breed': this.breed.value,
      'registrationDate': this.registrationDate.value,
      'isRegistered': this.isRegistered.value,
      'isHealthy': this.isHealthy.value,
      'isSlaughtered': this.isSlaughtered.value,
      'weight': this.weight.value,
      'owner': 'resource:ch.cowchain.Farmer#' + this.owner.value
    };

    this.myForm.setValue({
      'cowId': null,
      'birthdate': null,
      'breed': null,
      'registrationDate': null,
      'isRegistered': null,
      'isHealthy': null,
      'isSlaughtered': null,
      'weight': null,
      'owner': null,
      'operator': null,
      'vet': null,
      'slaughter': null,
      'father': null,
      'mother': null
    });

    return this.serviceCow.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'cowId': null,
        'birthdate': null,
        'breed': null,
        'registrationDate': null,
        'isRegistered': null,
        'isHealthy': null,
        'isSlaughtered': null,
        'weight': null,
        'owner': null,
        'operator': null,
        'vet': null,
        'slaughter': null,
        'father': null,
        'mother': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'ch.cowchain.Cow',
      'birthdate': this.birthdate.value,
      'breed': this.breed.value,
      'registrationDate': this.registrationDate.value,
      'isRegistered': this.isRegistered.value,
      'isHealthy': this.isHealthy.value,
      'isSlaughtered': this.isSlaughtered.value,
      'weight': this.weight.value,
      'owner': this.owner.value,
      'operator': this.operator.value,
      'vet': this.vet.value,
      'slaughter': this.slaughter.value,
      'father': this.father.value,
      'mother': this.mother.value
    };

    return this.serviceCow.updateAsset(form.get('cowId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceCow.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceCow.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'cowId': null,
        'birthdate': null,
        'breed': null,
        'registrationDate': null,
        'isRegistered': null,
        'isHealthy': null,
        'isSlaughtered': null,
        'weight': null,
        'owner': null,
        'operator': null,
        'vet': null,
        'slaughter': null,
        'father': null,
        'mother': null
      };

      if (result.cowId) {
        formObject.cowId = result.cowId;
      } else {
        formObject.cowId = null;
      }

      if (result.birthdate) {
        formObject.birthdate = result.birthdate;
      } else {
        formObject.birthdate = null;
      }

      if (result.breed) {
        formObject.breed = result.breed;
      } else {
        formObject.breed = null;
      }

      if (result.registrationDate) {
        formObject.registrationDate = result.registrationDate;
      } else {
        formObject.registrationDate = null;
      }

      if (result.isRegistered) {
        formObject.isRegistered = result.isRegistered;
      } else {
        formObject.isRegistered = null;
      }

      if (result.isHealthy) {
        formObject.isHealthy = result.isHealthy;
      } else {
        formObject.isHealthy = null;
      }

      if (result.isSlaughtered) {
        formObject.isSlaughtered = result.isSlaughtered;
      } else {
        formObject.isSlaughtered = null;
      }

      if (result.weight) {
        formObject.weight = result.weight;
      } else {
        formObject.weight = null;
      }

      if (result.owner) {
        formObject.owner = result.owner;
      } else {
        formObject.owner = null;
      }

      if (result.operator) {
        formObject.operator = result.operator;
      } else {
        formObject.operator = null;
      }

      if (result.vet) {
        formObject.vet = result.vet;
      } else {
        formObject.vet = null;
      }

      if (result.slaughter) {
        formObject.slaughter = result.slaughter;
      } else {
        formObject.slaughter = null;
      }

      if (result.father) {
        formObject.father = result.father;
      } else {
        formObject.father = null;
      }

      if (result.mother) {
        formObject.mother = result.mother;
      } else {
        formObject.mother = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'cowId': null,
      'birthdate': null,
      'breed': null,
      'registrationDate': null,
      'isRegistered': null,
      'isHealthy': null,
      'isSlaughtered': null,
      'weight': null,
      'owner': null,
      'operator': null,
      'vet': null,
      'slaughter': null,
      'father': null,
      'mother': null
      });
  }

}
