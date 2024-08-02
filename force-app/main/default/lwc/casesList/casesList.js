import { LightningElement, track, wire } from 'lwc';
import getCases from '@salesforce/apex/CaseController.getCases';
import { NavigationMixin } from 'lightning/navigation';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

const columns = [
    { label: 'Case Number', fieldName: 'CaseNumber' },
    { label: 'Subject', fieldName: 'Subject' },
    { label: 'Status', fieldName: 'Status' },
    { label: 'Date/Time Opened', fieldName: 'CreatedDate' },
    {
        type: "button", label: 'Actions', initialWidth: 120, typeAttributes: {
            label: 'Details',
            name: 'View',
            title: 'View',
            disabled: false,
            value: 'view',
            iconPosition: 'left',
            iconName: 'utility:preview',
            variant: 'Brand'
        }
    },
    {
        type: "button", label: '', initialWidth: 120, typeAttributes: {
            label: 'Edit',
            name: 'Edit',
            title: 'Edit',
            disabled: false,
            value: 'edit',
            iconPosition: 'left',
            iconName: 'utility:edit',
            variant: 'Brand'
        }
    },
    {
        type: "button", label: '', initialWidth: 120, typeAttributes: {
            label: 'Delete',
            name: 'Delete',
            title: 'Delete',
            disabled: false,
            value: 'delete',
            iconPosition: 'left',
            iconName: 'utility:delete',
            variant: 'destructive'
        }
    }
];

export default class CasesList extends NavigationMixin(LightningElement) {
    @track data;
    @track wireResult;
    @track error;
    columns = columns;
    visibleDatas = [];
    allDatas = [];
    @track searchKey = '';
    currentPage = 1;
    recordSize = 7;
    totalPage = 0;

    @wire(getCases)
    wiredCases(result) {
        this.wireResult = result;
        if (result.data) {
            this.data = result.data;
            this.allDatas = result.data;
            this.totalPage = Math.ceil(result.data.length / this.recordSize);
            this.updateVisibleData();
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
                objectApiName: 'Case',
                actionName: mode
            }
        });
    }

    handleDeleteRow(recordIdToDelete) {
        if (confirm('Are you sure you want to delete this case?')) {
            deleteRecord(recordIdToDelete)
                .then(result => {
                    this.showToast('Success', 'Record deleted successfully!', 'success', 'dismissable');
                    return refreshApex(this.wireResult);
                }).catch(error => {
                    this.error = error;
                });
        }
    }

    updateContactHandler(event) {
        this.visibleDatas = [...event.detail.records];
        console.log(event.detail.records);
    }

    handleCreateRecord() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Case',
                actionName: 'new'
            }
        });
    }

    updateVisibleData() {
        const start = (this.currentPage - 1) * this.recordSize;
        const end = start + this.recordSize;
        this.visibleDatas = this.allDatas.slice(start, end);
    }

    handlePreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage -= 1;
            this.updateVisibleData();
        }
    }

    handleNextPage() {
        if (this.currentPage < this.totalPage) {
            this.currentPage += 1;
            this.updateVisibleData();
        }
    }

    get disablePrevious() {
        return this.currentPage <= 1;
    }

    get disableNext() {
        return this.currentPage >= this.totalPage;
    }

    handleSearchKeyChange(event) {
        this.searchKey = event.target.value;
    }

    handleClickDashboard() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://talan104-dev-ed.develop.lightning.force.com/lightning/r/Dashboard/01ZWU000000SdT32AK/view?queryScope=userFolders'
            }
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
