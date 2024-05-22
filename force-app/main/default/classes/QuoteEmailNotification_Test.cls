/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 * 
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
private class QuoteEmailNotification_Test {

    @isTest
    public static testmethod void QuoteEmailNotificationTest(){
        list<Account> Accounts = new list<Account>();
        
        Accounts.add(New Account(Name = 'Test Company'));
        insert Accounts;
        
        list<Contact> Contacts = new list<Contact>();
        for(Account acc : Accounts){
            Contact cont = new Contact();
            cont.LastName = 'Abir Grati';
            cont.AccountId = acc.Id;
            cont.Email = 'abirgrati23@gmail.com';            
            Contacts.add(cont);
        }
        insert Contacts;
        
        list<Opportunity> Opps = new list<Opportunity>();
        for(Account acc : Accounts){
            Opportunity opp = new Opportunity();
            opp.Name = acc.Name+'-Opp';
            opp.AccountId = acc.Id;
            opp.StageName = 'Qualification';
            opp.CloseDate = date.today().addDays(30);
            Opps.add(opp);
        }
        insert opps;
        
        list<Quote> Quotes = new list<Quote>();
        
        for(Opportunity opp : Opps){
            Quote q = new Quote();
            q.OpportunityId = opp.Id;
            q.Name = 'Quote-'+opp.Name;
            q.Status = 'Draft';
            q.ContactId = Contacts[0].Id;
            Quotes.add(q);
        }
        
        insert quotes;
        
        string body = 'Testing base 64 encode';
        QuoteDocument qdoc = New QuoteDocument();
        qdoc.QuoteId = quotes[0].Id;
        qdoc.Document = blob.toPdf(body);
        insert qdoc;
            
        EmailTemplate e = [SELECT Id FROM EmailTemplate WHERE DeveloperName = 'Quote_Approval_Email'];
        
        list<QuoteEmailNotification.Requests> Requests = new list<QuoteEmailNotification.Requests>();
        
        QuoteEmailNotification.Requests req = new QuoteEmailNotification.Requests();
        req.recordId = quotes[0].Id;
        req.EmailTemplateId = e.Id;
        Requests.add(req);
        
        test.startTest();
          QuoteEmailNotification.QuoteCreateAndEmail(Requests);
        test.stopTest();
    }
}