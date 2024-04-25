import { LightningElement } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import productImagePage from '@salesforce/resourceUrl/productImagePage';

export default class TextCatalogue extends NavigationMixin(LightningElement) {
    image = productImagePage;
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