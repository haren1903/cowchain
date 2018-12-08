import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace ch.cowchain{
   export class Cow extends Asset {
      cowId: string;
      birthdate: Date;
      breed: string;
      registrationDate: Date;
      isRegistered: boolean;
      isHealthy: boolean;
      isSlaughtered: boolean;
      weight: number;
      owner: Farmer;
      operator: Operator;
      vet: Vet;
      slaughter: Slaughter;
      father: Cow;
      mother: Cow;
   }
   export class Meat extends Asset {
      id: string;
      weight: number;
      type: MeatType;
      farmer: Farmer;
      operator: Operator;
      vet: Vet;
      slaughter: Slaughter;
   }
   export class Farmer extends Participant {
      TVDID: string;
   }
   export class Operator extends Participant {
      id: string;
   }
   export class Vet extends Participant {
      id: string;
   }
   export class Slaughter extends Participant {
      id: string;
   }
   export class RegisterCowByOperator extends Transaction {
      operator: Operator;
      cow: Cow;
   }
   export class CheckCowHealthByVet extends Transaction {
      vet: Vet;
      cow: Cow;
   }
   export class ToSlaughter extends Transaction {
      slaughter: Slaughter;
      cow: Cow;
   }
   export class Dismantling extends Transaction {
      meatType: MeatType;
      weight: number;
      cow: Cow;
   }
   export enum MeatType {
      RIB,
      FILLET,
   }
// }
