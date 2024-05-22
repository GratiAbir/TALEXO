// Importez les classes nécessaires
import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import createOrder from '@salesforce/apex/ProductService.createOrder';


export default class CartData extends NavigationMixin(LightningElement) {
    // Déclarez les variables de suivi
    @track showModal = false;
    @track showLoading = false;
    @track products;
    @track totalPrice = 0;

    // Ouvrir le modal avec les produits passés en paramètre
    @api openModal(products) {
        this.totalPrice = 0;
        products.forEach(currentItem => {
            this.totalPrice += currentItem.totalPrice;
        });
        this.products = products;
        this.showModal = true;        
    }

    // Fermer le modal
    closeModal(){
        this.showModal = false;
    }

    // Vérifier si le bouton "Create Order" doit être désactivé
    get isDisable(){
        return !(this.products.length > 0) || this.showLoading;
    }

    // Gérer la création de la commande
    handleOrder(){
        this.showLoading = true;
        createOrder({ data:this.products})
        .then(result => {
            let title = 'Ordre créé avec succès!!';
            this.showToast('Succès!', title, 'success', 'dismissable');
            this.navigateToOrderPage(result);
        }).catch(err => {
            this.showToast('Error!!', err.body.message, 'error', 'dismissable');
        }).finally(() => {
            this.showLoading = false;
        });
    }

    // Naviguer vers la page de commande
    navigateToOrderPage(recordId) {
        const pageReference = {
            type: 'standard__webPage',
            attributes: {
                url: '/felicitation-passage-commande'
            }
        };
        this[NavigationMixin.Navigate](pageReference);
        /*
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Order',
                actionName: 'view'
            },
        });
        */
    }

    // Afficher ou masquer le spinner
    showHideSpinner() {
        this.showLoading = !this.showLoading;
    }

    // Afficher un toast
    showToast(title, message, variant, mode) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    } 

}
