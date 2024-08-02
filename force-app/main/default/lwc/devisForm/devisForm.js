import { LightningElement, track } from 'lwc';
import AcceptedQuote from '@salesforce/apex/QuoteService.AcceptedQuote';
import RejectedQuote from '@salesforce/apex/QuoteService.RejectedQuote';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class DevisForm extends NavigationMixin(LightningElement) {
    @track isRejectionVisible = false;
    @track rejectionReason = '';
    handleAcceptedQuote(){
        AcceptedQuote()
        .then(result => {
            let title = 'Votre réponse a été soumise avec succès !';
            this.showToast('Succès!', title, 'success', 'dismissable');
            this.navigateToSuivicommandePage();
        }).catch(err => {
            this.showToast('Error!!', err.body.message, 'error', 'dismissable');
        })
    }

    handleRejectedQuote() {
        this.isRejectionVisible = true;
    }

    handleReasonChange(event) {
        this.rejectionReason = event.target.value;
    }

    submitRejection() {
        RejectedQuote({ reason: this.rejectionReason })
        .then(result => {
            let title = 'Votre réponse a été soumise avec succès !';
            this.showToast('Succès!', title, 'success', 'dismissable');
            this.isRejectionVisible = false;
            this.navigateToSuivicommandePage();
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

    navigateToSuivicommandePage() {
        const pageReference = {
            type: 'standard__webPage',
            attributes: {
                url: '/suivi-commnade'
            }
        };
        this[NavigationMixin.Navigate](pageReference);
    }
}