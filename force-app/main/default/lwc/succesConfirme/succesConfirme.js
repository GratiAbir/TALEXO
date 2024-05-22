import { LightningElement } from 'lwc';
import stepImage from '@salesforce/resourceUrl/stepSix';

export default class SuccesConfirme extends LightningElement {
    image = stepImage;

    handleOpenPayment(){
        let child = this.template.querySelector('c-payment-modal');
        child.openPaymentModal();
 
    }
}