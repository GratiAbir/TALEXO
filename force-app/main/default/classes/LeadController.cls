public with sharing class LeadController {
    public LeadController() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Lead> getLead(){
        try {
            return [select id, name, Title, Company, Phone, Email, Status from lead];
           
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}