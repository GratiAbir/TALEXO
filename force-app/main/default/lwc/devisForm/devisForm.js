import { LightningElement } from 'lwc';
import AcceptedQuote from '@salesforce/apex/QuoteService.AcceptedQuote';
import RejectedQuote from '@salesforce/apex/QuoteService.RejectedQuote';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class DevisForm extends LightningElement {
    handleAcceptedQuote(){
        AcceptedQuote()
        .then(result => {
            let title = 'Votre réponse a été soumise avec succès !';
            this.showToast('Succès!', title, 'success', 'dismissable');
        }).catch(err => {
            this.showToast('Error!!', err.body.message, 'error', 'dismissable');
        })
    }

    handleRejectedQuote(){
        RejectedQuote()
        .then(result => {
            let title = 'Votre réponse a été soumise avec succès !';
            this.showToast('Succès!', title, 'success', 'dismissable');
        }).catch(err => {
            this.showToast('Error!!', err.body.message, 'error', 'dismissable');
        })
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