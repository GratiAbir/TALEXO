public with sharing class ProductService {
    public ProductService() {

    }

    @AuraEnabled
	public static String createOrder(object data){
		List<ProductOrderWrapper> productData = (List<ProductOrderWrapper>) JSON.deserialize(JSON.serialize(data), List<ProductOrderWrapper>.class);

		Order__c ord = new Order__c();
		insert ord;

		List<Order_Line_Item__c> oliList = new List<Order_Line_Item__c>();

		for(ProductOrderWrapper product : productData){
			Order_Line_Item__c oli = new Order_Line_Item__c();
			oli.Order__c = ord.Id;
			oli.Product__c = product.Id;
			oli.Price__c = product.price;
			oli.Quantity__c = product.quantity;
			oliList.add(oli);
		}

		insert oliList;
		
		return ord.Id;
	}

	public class ProductOrderWrapper {
		@AuraEnabled
		public String Id;

		@AuraEnabled
		public Decimal price;

		@AuraEnabled
		public Decimal totalPrice;

		@AuraEnabled
		public Integer quantity;

		@AuraEnabled
		public String Name;
	}
}