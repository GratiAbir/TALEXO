import { LightningElement, wire, track, api } from 'lwc';
import getProductsBesoinsPage from '@salesforce/apex/productController.getProductsBesoinsPage';


export default class BesoinsAllProducts extends LightningElement {
    @api products;
    @track dialogVisible = false;

    @wire(getProductsBesoinsPage)
    wiredProducts({ error, data }) {
        if (data) {
            this.products = data;
            console.log(JSON.stringify(data));
        } else if (error) {
            console.error(error);
        }
    }
    
    
}