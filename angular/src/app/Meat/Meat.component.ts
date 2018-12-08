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
import { MeatService } from './Meat.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-meat',
  templateUrl: './Meat.component.html',
  styleUrls: ['./Meat.component.css'],
  providers: [MeatService]
})
export class MeatComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  id = new FormControl('', Validators.required);
  weight = new FormControl('', Validators.required);
  type = new FormControl('', Validators.required);
  cow = new FormControl('', Validators.required);
  farmer = new FormControl('', Validators.required);
  operator = new FormControl('', Validators.required);
  vet = new FormControl('', Validators.required);
  slaughter = new FormControl('', Validators.required);

  constructor(public serviceMeat: MeatService, fb: FormBuilder) {
    this.myForm = fb.group({
      id: this.id,
      weight: this.weight,
      type: this.type,
      cow: this.cow,
      farmer: this.farmer,
      operator: this.operator,
      vet: this.vet,
      slaughter: this.slaughter
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceMeat.getAll()
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
      $class: 'ch.cowchain.Meat',
      'id': this.id.value,
      'weight': this.weight.value,
      'type': this.type.value,
      'cow': 'resource:ch.cowchain.Cow#' + this.cow.value,
    };

    this.myForm.setValue({
      'id': null,
      'weight': null,
      'type': null,
      'cow': null,
      'farmer': null,
      'operator': null,
      'vet': null,
      'slaughter': null
    });

    return this.serviceMeat.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'id': null,
        'weight': null,
        'type': null,
        'cow': null,
        'farmer': null,
        'operator': null,
        'vet': null,
        'slaughter': null
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
      $class: 'ch.cowchain.Meat',
      'weight': this.weight.value,
      'type': this.type.value,
      'cow': this.cow.value,
      'farmer': this.farmer.value,
      'operator': this.operator.value,
      'vet': this.vet.value,
      'slaughter': this.slaughter.value
    };

    return this.serviceMeat.updateAsset(form.get('id').value, this.asset)
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

    return this.serviceMeat.deleteAsset(this.currentId)
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

    return this.serviceMeat.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'id': null,
        'weight': null,
        'type': null,
        'cow': null,
        'farmer': null,
        'operator': null,
        'vet': null,
        'slaughter': null
      };

      if (result.id) {
        formObject.id = result.id;
      } else {
        formObject.id = null;
      }

      if (result.weight) {
        formObject.weight = result.weight;
      } else {
        formObject.weight = null;
      }

      if (result.type) {
        formObject.type = result.type;
      } else {
        formObject.type = null;
      }

      if (result.cow) {
        formObject.cow = result.cow;
      } else {
        formObject.cow = null;
      }

      if (result.farmer) {
        formObject.farmer = result.farmer;
      } else {
        formObject.farmer = null;
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
      'id': null,
      'weight': null,
      'type': null,
      'cow': null,
      'farmer': null,
      'operator': null,
      'vet': null,
      'slaughter': null
      });
  }

}
