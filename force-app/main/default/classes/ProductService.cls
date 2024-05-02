public with sharing class ProductService {
 
    public class ProductOrderWrapper {
        @AuraEnabled
        public String Id;
 
        @AuraEnabled
        public String productId;
 
        @AuraEnabled
        public String Name;
 
        @AuraEnabled
        public Decimal price;
 
        @AuraEnabled
        public Integer quantity;
 
        @AuraEnabled
        public Decimal totalPrice;
 
        //Vouchers
        @AuraEnabled
        public Integer voucherValue;
 
        @AuraEnabled
        public Integer numberOfVouchersPerBooklet;
 
        //Credit Cards
        @AuraEnabled
        public Integer recharcheValue;
 
        @AuraEnabled
        public List<String> beneficiaries;
 
    }

    
    /*
    public static Id getAccountId(){
		User user = [SELECT AccountId FROM User WHERE Id = :UserInfo.getUserId()];
		return user.AccountId;
	}
    */

    public static Id getAccountId(String name){
		return [select id FROM Account WHERE Name = :name];
	}
 
    public static Product2 getProduct2(String name){
		return [select id,Name from Product2 WHERE Name = 'etudiano'];
	}

 
    @AuraEnabled
    public static String createOrder(object data){
        List<ProductOrderWrapper> productData = (List<ProductOrderWrapper>) JSON.deserialize(JSON.serialize(data), List<ProductOrderWrapper>.class);
       
        Order ord = new Order();
        ord.EffectiveDate = System.today();
        ord.AccountId = ProductService.getAccountId();
        ord.Status = 'Draft';
        insert ord;
       
       
       
        List<OrderProducts__c> ordPros = new List<OrderProducts__c>();
 
        for(ProductOrderWrapper product : productData){

            Product2 pro = ProductService.getProduct2(product.Name);
 
            OrderProducts__c ordPro = new OrderProducts__c();
            ordPro.OrderId__c = ord.Id;
            ordPro.ProductId__c = pro.Id;
            ordPro.Unit_Price__c = product.price;
            ordPro.Quantity__c = product.quantity;
            ordPro.Total_Price__c = product.totalPrice;
            ordPros.add(ordPro);
        }
 
        insert ordPros;
       
        return ord.Id;
    }
}