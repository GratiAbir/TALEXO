public class Quoteconvcontract {
    @InvocableMethod(label='Create Contract on Quote Acceptance' description='Creates a contract when a quote is accepted.')
    public static void createContract(List<Id> quoteIds) {
        List<Contract> contractsToInsert = new List<Contract>();
        List<Opportunity> oppsToUpdate = new List<Opportunity>();
        List<Contact> contactsToUpdate = new List<Contact>();
 
        for (Id quoteId : quoteIds) {
            Quote newQuote = [SELECT Id, Status, Name, OpportunityId, Opportunity.AccountId, Order__c  FROM Quote WHERE Id = :quoteId AND Status = 'Accepted'];
 
            if (newQuote != null) {
                // Récupérer les informations nécessaires de l'opportunité
                Opportunity opp = [SELECT Id, AccountId FROM Opportunity WHERE Id = :newQuote.OpportunityId];
 
                // Créer le contrat
                Contract newContract = new Contract();
                newContract.AccountId = opp.AccountId;
                newContract.Quote__c = newQuote.ID;
                newContract.Order__c = newQuote.Order__c;
                newContract.ContractTerm = 1;
                newContract.Name = newQuote.Name;
                newContract.Status = 'In_Approval_Process';
                newContract.StartDate = Date.today();
                newContract.Opportunity__c = newQuote.OpportunityId;
                contractsToInsert.add(newContract);
            }
        }
 
        if (!contractsToInsert.isEmpty()) {
            insert contractsToInsert;
        }
    }
}