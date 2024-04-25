public with sharing class LeadController {
    public LeadController() {

    }
     
    @AuraEnabled(cacheable=true)
    public static List<Lead> getLead(){
        try {
            return [SELECT id, name, Title, Company, Email, Phone, Status   
                    FROM Lead
                    ORDER BY id DESC];
           
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}