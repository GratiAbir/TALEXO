public with sharing class ProductService {

    public class Beneficiary {
		public String fullName;
		public String cin;
	}

    public static String formatBeneficiaries(List<Beneficiary> beneficiaries) {
        List<String> formattedBeneficiaries = new List<String>();
        for (Beneficiary beneficiary : beneficiaries) {
            formattedBeneficiaries.add('Full Name: ' + beneficiary.fullName + ', CIN: ' + beneficiary.cin);
        }
        return String.join(formattedBeneficiaries, '\n');
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

    public static Id getOppIdByName(String name){ 
        Opportunity opp = [SELECT Id,Name FROM Opportunity WHERE Name = :name];
        return opp.Id; 
    }

    public static Opportunity getOppByName(String name){ 
        Opportunity opp = [SELECT Id,Name FROM Opportunity WHERE Name = :name];
        return opp;
 
    }

	public static Id getAccountId(){
		User user = [SELECT AccountId FROM User WHERE Id = :UserInfo.getUserId()];
		return user.AccountId;
	}

    public static Id getOppId(Id a){
		Opportunity opp = [SELECT Id FROM Opportunity WHERE  AccountId = :a ];
		return opp.Id;
	}

	public static Opportunity getOppById(Id a){
		Opportunity opp = [SELECT Id, Name, Payment__c FROM Opportunity WHERE  AccountId = :a ];
		return opp;
	}

	public static Product2 getProduct2(String name){
		return [select id,Name,Family from Product2 WHERE Name = :name];
	}

    public static Contact getContact(Id a){
		return [SELECT Id, Name, Phone, Email FROM Contact WHERE AccountId = :a LIMIT 1];
	}

    public class CustomAddress {
        public String street;
        public String city;
        public String state;
        public String postalCode;
        public String country;
    }

    public static String getAddressAccount(Id accountId) {
        Account acc = [SELECT BillingCity, BillingState, BillingPostalCode, BillingCountry FROM Account WHERE Id = :accountId LIMIT 1];
        
        String address;
        address = acc.BillingCountry + ' ' + acc.BillingCity ;
        return address;
    }
    
    

 
    @AuraEnabled
    public static String createOrder(object data){

        List<ProductOrderWrapper> productData = (List<ProductOrderWrapper>) JSON.deserialize(JSON.serialize(data), List<ProductOrderWrapper>.class);
        
        // Retrieve the Opportunity
        //Opportunity opp = ProductService.getOppByName('etudiano-');
        Opportunity opp = ProductService.getOppById(ProductService.getAccountId());

        // Create the Order
        Order ord = new Order();
        ord.EffectiveDate = System.today();
        ord.AccountId = ProductService.getAccountId();
        //ord.AccountId = ProductService.getAccountIdByName('etudiano'); 
        ord.OpportunityId = ProductService.getOppId(ProductService.getAccountId());
        //ord.OpportunityId = ProductService.getOppIdByName('etudiano-');       
        ord.Status = 'Draft';
        insert ord;
       
        
        // Calculate total amount
        Decimal totalAmount = 0;
       
        List<OrderProducts__c> ordPros = new List<OrderProducts__c>();
 
        for(ProductOrderWrapper product : productData){

            Product2 pro = ProductService.getProduct2(product.Name);
 
            OrderProducts__c ordPro = new OrderProducts__c();
            ordPro.OrderId__c = ord.Id;
            ordPro.Product__c = pro.Id;
            //ordPro.Opportunity__c = ProductService.getOppIdByName('etudiano-');
            ordPro.Opportunity__c = ProductService.getOppId(ProductService.getAccountId());
            ordPro.Unit_Price__c = product.price;
            ordPro.Quantity__c = product.quantity;
            ordPro.Total_Price__c = product.totalPrice;

            //System.debug('aaaaa  '+product.beneficiaries.toString());

			if (pro.Family == 'Credit_Cards') {
				ordPro.recharcheValue__c = product.recharcheValue;
				//ordPro.beneficiaries__c = product.beneficiaries.toString();
                ordPro.beneficiaries__c = formatBeneficiaries(product.beneficiaries);
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

        opp.Amount = totalAmount;
        opp.Payment__c = 'Unpaid';
        update opp;


        
    //create quote related to the order
    Quote newQuote = new Quote();
    Contact contact = ProductService.getContact(ProductService.getAccountId());
    String addressAccount = getAddressAccount(ProductService.getAccountId());
    newQuote.Name = opp.Name+'Quote';
    newQuote.OpportunityId = opp.id;
    newQuote.Order__c = ord.Id;
    newQuote.ExpirationDate = System.today()+6;
    newQuote.ContactId = contact.Id;
    newQuote.Phone = contact.Phone;
    newQuote.Email = contact.Email;
    newQuote.AccountAddress__c = addressAccount;

    insert newQuote;

       
        return ord.Id;
    }
}