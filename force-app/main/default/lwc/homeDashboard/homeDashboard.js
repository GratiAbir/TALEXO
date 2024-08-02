import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
 
export default class HomeDashboard extends NavigationMixin(LightningElement) {
    stat() {
        // Incrémentez le nombre d'opportunités modifiées
   
        window.location.href = '/lightning/n/Jobs_Dashbords';//ouverture dans la meme fenetre
   }

   handleClickDashboardLeads(){
    this[NavigationMixin.Navigate]({
        type: 'standard__webPage',
        attributes: {
            url: 'https://talan104-dev-ed.develop.lightning.force.com/lightning/r/Dashboard/01ZWU000000IQg52AG/view?queryScope=userFolders'
        }
    });

    }

    handleClickDashboardOpportuinities(){
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://talan104-dev-ed.develop.lightning.force.com/lightning/r/Dashboard/01ZWU000000SdeL2AS/view?queryScope=userFolders'
            }
        });
 
    }

    handleClickDashboardClaims(){
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url:  'https://talan104-dev-ed.develop.lightning.force.com/lightning/r/Dashboard/01ZWU000000SdT32AK/view?queryScope=userFolders'
            }
        });
 
    }
}