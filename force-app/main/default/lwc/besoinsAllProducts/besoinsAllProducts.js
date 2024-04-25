import { LightningElement, wire, track } from 'lwc';
import getProductsBesoinsPage from '@salesforce/apex/productController.getProductsBesoinsPage';


export default class BesoinsAllProducts extends LightningElement {
    products;
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

    handleOpenCommande(event) {
        let productId = event.target.dataset.product; // Récupérer l'ID du produit
        let productName = event.target.dataset.productname; // Récupérer le nom du produit
        let productFamily = event.target.dataset.productfamily;
        let productImage = event.target.dataset.productimage;
        let child = this.template.querySelector('c-click-commander');
        child.openModal(productId, productName, productFamily, productImage);
    }
    
    
}