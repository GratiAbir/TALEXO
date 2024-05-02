@isTest
private class ProductServiceTest {
 
    @isTest
    static void testCreateOrder() {
        // Create test data
        ProductService.ProductOrderWrapper product = new ProductService.ProductOrderWrapper();
        //product.productId = 'Qy0000064AmvIAE';
        product.price = 10;
        product.quantity = 5;
        product.totalPrice = 50;
        product.Name = 'Clothing vouchers';
 
        // Create test Account
        Account testAccount = new Account(Name = 'CIA');
        insert testAccount;
 
        Product2 testProduct = new Product2(Name = 'Clothing vouchers');
        insert testProduct;
 
        List<ProductService.ProductOrderWrapper> testData = new List<ProductService.ProductOrderWrapper>();
        testData.add(product);
 
        // Call the ProductService.createOrder method
        Test.startTest();
        String orderId = ProductService.createOrder(testData);
        Test.stopTest();
 
        // Verify that the order was created successfully
        System.assertNotEquals(null, orderId, 'Order Id should not be null');
 
        // Optionally, add more assertions to verify the created order or other logic
    }
 
    // Add more test methods to cover additional scenarios
}