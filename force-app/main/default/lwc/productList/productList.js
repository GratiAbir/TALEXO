import { LightningElement, wire } from 'lwc';
import getProducts from '@salesforce/apex/productController.getProducts';

export default class ProductList extends LightningElement {
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
}