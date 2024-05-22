public with sharing class PaymentService {
    public PaymentService() {

    }
    @AuraEnabled
    public static void pay(){
   
 
    Opportunity opp = ProductService.getOppById(ProductService.getAccountId());
    opp.Payment__c = 'Paid';
    update opp;
    }
}