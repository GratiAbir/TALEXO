public with sharing class OpportunityController {
    public OpportunityController() {

    }
    
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunity(){ 
        try {
            System.debug('aaaa');
            return [SELECT id, Name, Account.Name, StageName    
                    FROM Opportunity
                    ORDER BY id DESC];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
 
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getOpportunityWithContactInfo(){
        try {
            // Récupérer les opportunités avec les IDs des comptes associés
            List<Opportunity> opportunities = [SELECT Id, Name, AccountId, Account.Name, StageName FROM Opportunity ORDER BY Id DESC];

            // Liste pour stocker les informations finales
            List<Map<String, Object>> opportunityListWithContact = new List<Map<String, Object>>();

            // Parcourir les opportunités
            for(Opportunity opp : opportunities) {
                // Récupérer l'ID du compte associé à l'opportunité
                Id accountId = opp.AccountId;
                
                // Appeler une méthode pour récupérer les informations du contact associé au compte
                Map<String, Object> contactInfo = getContactInfo(accountId);

                // Ajouter les informations de l'opportunité et du contact à la liste finale
                Map<String, Object> opportunityWithContact = new Map<String, Object>{
                    'OpportunityName' => opp.Name,
                    'StageName' => opp.StageName,
                    'AccountName' => opp.Account.Name,
                    'ContactName' => contactInfo.get('ContactName'),
                    'ContactPhone' => contactInfo.get('ContactPhone')
                };
                opportunityListWithContact.add(opportunityWithContact);
            }

            return opportunityListWithContact;           
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // Méthode pour récupérer les informations du contact associé au compte
    private static Map<String, Object> getContactInfo(Id accountId) {
        Map<String, Object> contactInfo = new Map<String, Object>();

        Contact contact = [SELECT Id, Name, Phone FROM Contact WHERE AccountId = :accountId LIMIT 1];

        // Vérifier si un contact a été trouvé
        if (contact != null) {
            // Stocker les informations du contact dans une carte
            contactInfo.put('ContactName', contact.Name);
            contactInfo.put('ContactPhone', contact.Phone);
        } else {
            // Si aucun contact n'est trouvé, définir des valeurs par défaut ou laisser les valeurs vides
            contactInfo.put('ContactName', ''); 
            contactInfo.put('ContactPhone', ''); 
        }

        return contactInfo;
    }

    
}