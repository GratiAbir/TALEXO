import { LightningElement } from 'lwc';
import { NavigationMixin } from "lightning/navigation";

export default class BoutonAPropos extends NavigationMixin(LightningElement) {
    handleClick(){
        const pageReference = {
            type: 'standard__webPage',
            attributes: {
                url: '/passer-commande'
            }
        };
        this[NavigationMixin.Navigate](pageReference);
    }

}