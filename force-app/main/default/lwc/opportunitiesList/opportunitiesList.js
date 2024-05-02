import { LightningElement, track, wire } from 'lwc';
import getOpportunityWithContactInfo from '@salesforce/apex/OpportunityController.getOpportunityWithContactInfo';

const columns = [
    /*
    { label: 'Opportunity Name', fieldName: 'Name' },
    { label: 'Account Name', fieldName: 'Account.Name' },
    { label: 'Contact Name', fieldName: 'ContractId' },
    { label: 'Contact Phone', fieldName: 'ContractId' },
    { label: 'Stage', fieldName: 'StageName' },
    */
    { label: 'Opportunity Name', fieldName: 'OpportunityName' },
    { label: 'Account Name', fieldName: 'AccountName' },
    { label: 'Contact Name', fieldName: 'ContactName' },
    { label: 'Contact Phone', fieldName: 'ContactPhone' },
    { label: 'Stage', fieldName: 'StageName' },

    {
        type: "button", label: 'Actions', initialWidth: 100, typeAttributes: {
            label: 'View',
            name: 'View',
            title: 'View',
            disabled: false,
            value: 'view',
            iconPosition: 'left',
            iconName:'utility:preview',
            variant:'Brand'
        }
    },
    {
        type: "button", label: '', initialWidth: 100, typeAttributes: {
            label: 'Edit',
            name: 'Edit',
            title: 'Edit',
            disabled: false,
            value: 'edit',
            iconPosition: 'left',
            iconName:'utility:edit',
            variant:'Brand'
        }
    },
    {
        type: "button", label: '', initialWidth: 110, typeAttributes: {
            label: 'Delete',
            name: 'Delete',
            title: 'Delete',
            disabled: false,
            value: 'delete',
            iconPosition: 'left',
            iconName:'utility:delete',
            variant:'destructive'
        }
    }
];

export default class OpportunitiesList extends NavigationMixin(LightningElement) {
    @track data;
    @track wireResult;
    @track error;
    columns = columns;
    visibleDatas;
    @track searchKey = '';

    @wire(getOpportunityWithContactInfo)
    wiredOpportunities(result) {
        this.wireResult = result;
        if (result.data) {
            this.data = result.data;
            this.filterData(); // Call filter method after data is loaded
        } else if (result.error) {
            this.error = result.error;
        }
    }

    callRowAction(event) {
        const recId = event.detail.row.Id;
        const actionName = event.detail.action.name;
        if (actionName === 'Edit') {
            this.handleAction(recId, 'edit');
        } else if (actionName === 'Delete') {
            this.handleDeleteRow(recId);
        } else if (actionName === 'View') {
            this.handleAction(recId, 'view');
        }
    }

    handleAction(recordId, mode) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Opportunity',
                actionName: mode
            }
        })
    }

    handleDeleteRow(recordIdToDelete) {
        // Display confirmation dialog
        if (confirm('Are you sure you want to delete this opportunity?')) {
            deleteRecord(recordIdToDelete)
                .then(result => {
                    this.showToast('Success', 'Record deleted successfully', 'success', 'dismissable');
                    return refreshApex(this.wireResult);
                }).catch(error => {
                    this.error = error;
                });
        }
    }

    updateContactHandler(event){
        this.visibleDatas=[...event.detail.records];
        console.log(event.detail.records);
    }

     //New
     handleCreateRecord() {
        // Navigate to the record creation page for the desired object
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Opportunity',
                actionName: 'new'
            }
        });
    }

    //Search
    handleSearchKeyChange(event) {
        this.searchKey = event.target.value;
        // Call a method to filter data based on the search key
        this.filterData();
    }
    filterData() {
        if (this.data) {
            this.visibleDatas = this.data.filter(opportunity =>
                opportunity.Name.toLowerCase().includes(this.searchKey.toLowerCase())
            );
        }
    }

    /* handleDownloadCSV() est une méthode appelée pour télécharger les données de la liste au format CSV. */
    handleDownloadCSV() {
        const csvData = this.data.map(opportunity => ({
            'Opportunity Name': opportunity.Name,
            'Account Name': opportunity.AccountId,
            'Stage': opportunity.StageName
        }));
 
        exportCSV(this.columns, csvData, 'OpportunitiesList');
    }

     /* downloadCSV() est une méthode asynchrone utilisée pour générer et télécharger le fichier CSV. */
     async downloadCSV() {
        const data = this.data;
        if (!data || data.length === 0) {
            this.showToast('Error', 'No data to download', 'error');
            return;
        }
    
        const csvContent = this.convertArrayOfObjectsToCSV(data);
        this.downloadCSVFile(csvContent, 'OpportunitiesList.csv');
    }

     /* convertArrayOfObjectsToCSV(data) convertit les données des prospects en une chaîne CSV. */
     convertArrayOfObjectsToCSV(data) {
        const csvHeader = Object.keys(data[0]).join(',');
        const csvRows = data.map(row => Object.values(row).join(','));
        return csvHeader + '\n' + csvRows.join('\n');
    }

     /* downloadCSVFile(csvContent, fileName) télécharge le fichier CSV généré en utilisant l'élément <a> caché. */
     downloadCSVFile(csvContent, fileName) {
        const hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
        hiddenElement.setAttribute('download', fileName); // Use setAttribute to set the download attribute
        hiddenElement.style.display = 'none';
        document.body.appendChild(hiddenElement);
        hiddenElement.click();
        document.body.removeChild(hiddenElement);
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