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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { CowComponent } from './Cow/Cow.component';
import { MeatComponent } from './Meat/Meat.component';

import { FarmerComponent } from './Farmer/Farmer.component';
import { OperatorComponent } from './Operator/Operator.component';
import { VetComponent } from './Vet/Vet.component';
import { SlaughterComponent } from './Slaughter/Slaughter.component';

import { RegisterCowByOperatorComponent } from './RegisterCowByOperator/RegisterCowByOperator.component';
import { CheckCowHealthByVetComponent } from './CheckCowHealthByVet/CheckCowHealthByVet.component';
import { ToSlaughterComponent } from './ToSlaughter/ToSlaughter.component';
import { DismantlingComponent } from './Dismantling/Dismantling.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Cow', component: CowComponent },
  { path: 'Meat', component: MeatComponent },
  { path: 'Farmer', component: FarmerComponent },
  { path: 'Operator', component: OperatorComponent },
  { path: 'Vet', component: VetComponent },
  { path: 'Slaughter', component: SlaughterComponent },
  { path: 'RegisterCowByOperator', component: RegisterCowByOperatorComponent },
  { path: 'CheckCowHealthByVet', component: CheckCowHealthByVetComponent },
  { path: 'ToSlaughter', component: ToSlaughterComponent },
  { path: 'Dismantling', component: DismantlingComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
