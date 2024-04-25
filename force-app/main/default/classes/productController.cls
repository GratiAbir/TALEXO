public with sharing class productController {
    public productController() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Product2> getProducts() { 
        try {
            List<Product2> lstProducts = [
                    SELECT Id, Name, Description, Product_Image__c, Product_Slogan__c 
                    FROM Product2
                ];
                  return lstProducts;
        }
        catch (Exception e) {
           throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Product2> getProductsBesoinsPage() { 
        try {
            List<Product2> lstProducts = [
                    SELECT Id, Name, Summary__c, Icon__c, Product_Image__c, Family 
                    FROM Product2
                ];
                  return lstProducts;
        }
        catch (Exception e) {
           throw new AuraHandledException(e.getMessage());
        }
    }
}