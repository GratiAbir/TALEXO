import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import pay from '@salesforce/apex/PaymentService.pay';

export default class PaymentModal extends LightningElement {
    @track showModal = false;

    @api openPaymentModal() {
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }

    handlePay() {
        pay()
            .then(() => {
                this.showModal = false;
                this.dispatchEvent(new CustomEvent('paymentstatuschange', { bubbles: true, composed: true }));
                this.showToast('Succès!', 'Votre paiement a été reçu avec succès.', 'success', 'dismissable');
            })
            .catch(error => {
                this.showToast('Error!', error.body.message, 'error', 'dismissable');
            });
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
