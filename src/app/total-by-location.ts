import { CreditModel } from './credit-model';

export interface TotalByLocation {
 
    location?: string;

    debitTotal?: number;
 
    creditTotal?: number;

    purchaseList?: CreditModel[];
}