import { LightningElement } from 'lwc';
import { NavigationMixin } from "lightning/navigation";

export default class BoutonCatalogue extends NavigationMixin(LightningElement) {
    handleClick(){
        const pageReference = {
            type: 'standard__webPage',
            attributes: {
                url: '/information-page'
            }
        };
        this[NavigationMixin.Navigate](pageReference);
    }

}