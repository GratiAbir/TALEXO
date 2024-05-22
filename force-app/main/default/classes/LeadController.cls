public with sharing class LeadController {
    public LeadController() {

    }
     
    @AuraEnabled(cacheable=true)
    public static List<Lead> getLeads(){
        try {
            return [SELECT id, name, Company, Email, Phone, Status   
                    FROM Lead
                    ORDER BY id DESC];
           
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Lead> searchLead(String searchKey) {
        // Effectuez la recherche de leads en utilisant le paramètre searchKey
        searchKey = '%' + searchKey + '%';
        return [SELECT id, name, Company, Email, Phone, Status 
                FROM Lead 
                WHERE Name LIKE :searchKey
                ORDER BY id DESC];
    }


}