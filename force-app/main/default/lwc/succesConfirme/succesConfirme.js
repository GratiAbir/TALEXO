import { LightningElement, track, wire } from 'lwc';
import stepImage from '@salesforce/resourceUrl/stepSix';
import getPaymentStatus from '@salesforce/apex/PaymentService.getPaymentStatus';

export default class SuccesConfirme extends LightningElement {
    @track paymentStatus = 'unpaid'; // Initialize with 'unpaid'
    image = stepImage;

    connectedCallback() {
        this.fetchPaymentStatus();
        this.template.addEventListener('paymentstatuschange', this.handlePaymentStatusChange.bind(this));
    }

    fetchPaymentStatus() {
        getPaymentStatus()
            .then(status => {
                this.paymentStatus = status;
            })
            .catch(error => {
                console.error('Error fetching payment status:', error.body.message); // Capture detailed error
            });
    }

    handleOpenPayment() {
        let child = this.template.querySelector('c-payment-modal');
        child.openPaymentModal();
    }

    handlePaymentStatusChange() {
        this.fetchPaymentStatus();
    }

    get isPaymentPaid() {
        return this.paymentStatus === 'Paid';
    }

    get isPaymentUnpaid() {
        return this.paymentStatus === 'Unpaid';
    }
}
