import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class FelicitationPassageCommande extends NavigationMixin(LightningElement) {
    handleSuiviCommande() {
        const pageReference = {
            type: 'standard__webPage',
            attributes: {
                url: '/suivi-commnade'
            }
        };
        this[NavigationMixin.Navigate](pageReference);
    }
}