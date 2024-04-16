public with sharing class LeadController {
    public LeadController() {

    }
     
    @AuraEnabled(cacheable=true)
    public static List<Lead> getLead(){
        try {
            return [SELECT id, name, Title, Company, Phone, Email, Status  FROM Lead];
           
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}