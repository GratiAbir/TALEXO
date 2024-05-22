import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import pay from '@salesforce/apex/PaymentService.pay'; 


export default class PaymentModal extends LightningElement {
    @track showModal = false;

  
    @api openPaymentModal() {
        this.showModal = true;
    }

    closeModal(){
        this.showModal = false;
    }

    handlePay(){
        pay();
        this.showModal = false;
        let title = 'Votre paiement a été reçu avec succès.';
        this.showToast('Succès!', title, 'success', 'dismissable');
        
    }

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