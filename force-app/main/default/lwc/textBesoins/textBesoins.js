import { LightningElement } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import passageEtape from '@salesforce/resourceUrl/passageEtape';

export default class TextBesoins extends NavigationMixin(LightningElement) {
    image = passageEtape;
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