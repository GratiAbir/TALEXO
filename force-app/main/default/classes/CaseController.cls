public with sharing class CaseController {
    public CaseController() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Case> getCases(){
        try {
            return [SELECT id, CaseNumber, Subject, Status, CreatedDate   
                    FROM Case
                    ORDER BY id DESC];
           
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}