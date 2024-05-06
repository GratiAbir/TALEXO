public with sharing class ProductService {

    public class Beneficiary {
		public String fullName;
		public String cin;
	}
 
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
        public List<Beneficiary> beneficiaries;
 
    }

    
    

    public static Id getAccountIdByName(String name){
		Account acc = [SELECT Id,Name FROM Account WHERE Name = :name];
		return acc.Id;
	}

	public static Id getAccountId(){
		User user = [SELECT AccountId FROM User WHERE Id = :UserInfo.getUserId()];
		return user.AccountId;
	}

	public static Product2 getProduct2(String name){
		return [select id,Name,Family from Product2 WHERE Name = :name];
	}

 
    @AuraEnabled
    public static String createOrder(object data){
        List<ProductOrderWrapper> productData = (List<ProductOrderWrapper>) JSON.deserialize(JSON.serialize(data), List<ProductOrderWrapper>.class);
       
        Order ord = new Order();
        ord.EffectiveDate = System.today();
        //ord.AccountId = ProductService.getAccountId();
        ord.AccountId = ProductService.getAccountIdByName('etudiano');
        ord.Status = 'Draft';
        insert ord;
       
        Decimal totalAmount = 0;
       
        List<OrderProducts__c> ordPros = new List<OrderProducts__c>();
 
        for(ProductOrderWrapper product : productData){

            Product2 pro = ProductService.getProduct2(product.Name);
 
            OrderProducts__c ordPro = new OrderProducts__c();
            ordPro.OrderId__c = ord.Id;
            ordPro.Product__c = pro.Id;
            ordPro.Unit_Price__c = product.price;
            ordPro.Quantity__c = product.quantity;
            ordPro.Total_Price__c = product.totalPrice;

            //System.debug('aaaaa  '+product.beneficiaries.toString());

			if (pro.Family == 'Credit_Cards') {
				ordPro.recharcheValue__c = product.recharcheValue;
				ordPro.beneficiaries__c = product.beneficiaries.toString();
			}else {
				ordPro.voucherValue__c = product.voucherValue;
				ordPro.numberOfVouchersPerBooklet__c = product.numberOfVouchersPerBooklet;
			}

            ordPros.add(ordPro);
            totalAmount += product.totalPrice;	
        }
        System.debug('traah ayy');

        ord.Amount__c = totalAmount;
		update ord;
        insert ordPros;
       
        return ord.Id;
    }
}