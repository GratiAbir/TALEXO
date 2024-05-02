import { LightningElement, wire, track, api } from 'lwc';

export default class BesoinsProductTile extends LightningElement {
    @api product;
    @track dialogVisible = false;

    handleOpenCommande(event) {
        let productId = event.target.dataset.productid; 
        let productName = event.target.dataset.productname; 
        let productFamily = event.target.dataset.productfamily;
        let productImage = event.target.dataset.productimage;
        let child = this.template.querySelector('c-click-commander');
        child.openModal(productId, productName, productFamily, productImage);
    }
    
    
}