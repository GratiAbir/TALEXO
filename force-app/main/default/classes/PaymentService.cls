public with sharing class PaymentService {
    public PaymentService() {

    }
    @AuraEnabled
    public static void pay(){
        Opportunity opp = ProductService.getOppById(ProductService.getAccountId());
        opp.Payment__c = 'Paid';
        opp.CloseDate = System.today();
        update opp;
    }

    @AuraEnabled
    public static String getPaymentStatus() {
        Opportunity opp = ProductService.getOppById(ProductService.getAccountId());
        return opp.Payment__c;
    }
}