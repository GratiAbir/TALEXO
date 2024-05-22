import { LightningElement, wire } from 'lwc';
import getProducts from '@salesforce/apex/productController.getProducts';
import { NavigationMixin } from "lightning/navigation";

export default class ProductList extends NavigationMixin(LightningElement) {
    products;

    @wire(getProducts)
    wiredProducts({ error, data }) {
        if (data) {
            this.products = data;
            console.log(JSON.stringify(data));
        } else if (error) {
            console.error(error);
        }
    }

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