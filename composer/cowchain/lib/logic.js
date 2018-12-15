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

/* global getAssetRegistry getFactory emit */

/**
 * @param {ch.cowchain.RegisterCowByOperator} tx The transaction instance.
 * @transaction
 */
async function registerCowByOperator(tx) {
    tx.cow.operator = tx.operator;
    tx.cow.isRegistered = true;
    tx.cow.registrationDate = new Date();
    let assetRegistry = await getAssetRegistry('ch.cowchain.Cow');
    await assetRegistry.update(tx.cow);
}

/**
* @param {ch.cowchain.CheckCowHealthByVet} tx The transaction instance.
* @transaction
*/
async function checkCowHealthByVet(tx) {
if(tx.cow.isRegistered) {
  tx.cow.vet = tx.vet;
    tx.cow.isHealthy = true;
    tx.cow.healthCheckDate = new Date();
    let assetRegistry = await getAssetRegistry('ch.cowchain.Cow');
    await assetRegistry.update(tx.cow);
} else {
    throw new Error('Cow must be registered');
}
}

/**
* @param {ch.cowchain.ToSlaughter} tx The transaction instance.
* @transaction
*/
async function toSlaughter(tx) {
if(tx.cow.isHealthy) {
  tx.cow.slaughter = tx.slaughter;
    tx.cow.isSlaughtered = true;
    tx.cow.slaughterDate = new Date();
    let assetRegistry = await getAssetRegistry('ch.cowchain.Cow');
    await assetRegistry.update(tx.cow);
} else {
    throw new Error('Cow is not healthy');
}
}

/**
* @param {ch.cowchain.Dismantling} tx The transaction instance.
* @transaction
*/
async function dismantling(tx) {
    if (tx.cow.isSlaughtered) {
    // update dismantlingDate
    var dismantlingDate = tx.cow.dismantlingDate;
    dismantlingDate = new Date();
    // current timestamp as string
    let date = String(Date.now());
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    let random1 = Math.random().toString(36).substr(2, 9);
    let random2 = Math.random().toString(36).substr(2, 9);
    meatId = random1.concat(date.concat(random2));
    
    meat = getFactory().newResource('ch.cowchain', 'Meat', meatId);
    
    meat.weight = tx.weight;
    meat.type = tx.meatType;
    meat.cow = tx.cow;
    meat.dismantlingDate = dismantlingDate;
    meat.farmer = tx.cow.owner;
    meat.operator = tx.cow.operator;
    meat.vet = tx.cow.vet;
    meat.slaughter = tx.cow.slaughter;  
    
    let assetRegistry = await getAssetRegistry('ch.cowchain.Meat');
    await assetRegistry.add(meat);
    
  } else {
        throw new Error('Cow must be slaughtered');
  }
}

