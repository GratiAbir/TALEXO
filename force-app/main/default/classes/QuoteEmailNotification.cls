public with sharing class QuoteEmailNotification {
    public QuoteEmailNotification() {

    }
    public class Requests {
        @InvocableVariable(label='Quote Record Id' required=true)
        public String recordId;
        
        @InvocableVariable(label='Email Template Id' required=true)
        public String EmailTemplateId;
    }  

    //La méthode principale, QuoteCreateAndEmail, est annotée avec @InvocableMethod. Cela signifie qu'elle peut être invoquée par Process Builder, Flow ou Apex. 
    @InvocableMethod(label='Send Quote Email with PDF' iconName='slds:standard:quotes')
    public static void QuoteCreateAndEmail(List < Requests > Reqs) {
        for(Requests req : Reqs){
            SendEmail(req.recordId, req.EmailTemplateId);
        }
    }

    //Cette méthode est responsable de la création et de l'envoi effectif de l'e-mail.
    public static void SendEmail(Id quoteID, String emailTemplateID){
        list<Quote> Quotes = new list<Quote>([SELECT Id, Owner.Name, Owner.Email, ContactId, Contact.Email FROM Quote WHERE ID = :quoteID]);

        Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage(); //créer un nouvel objet SingleEmailMessage qui représente un e-mail individuel à envoyer.
        message.setTargetObjectId(Quotes[0].ContactID); //définit l'ID de l'objet cible de l'e-mail
        message.setSenderDisplayName(Quotes[0].Owner.Name); //spécifie le nom qui apparaîtra comme l'expéditeur de l'e-mail
        message.setReplyTo(Quotes[0].Owner.Email); //définit l'adresse e-mail à laquelle les réponses à cet e-mail seront envoyées
        message.setUseSignature(false);
        message.setBccSender(false);
        message.setSaveAsActivity(true); // ce qui signifie que l'e-mail sera enregistré en tant qu'activité dans l'historique de l'objet.
        message.setTemplateID(emailTemplateID); //définit l'ID du modèle d'e-mail à utiliser pour composer le contenu de l'e-mail.
        message.setWhatId(quoteID); //définit l'ID de l'objet associé à l'e-mail.
        message.toAddresses = new String[]{Quotes[0].Contact.Email}; //définit les adresses e-mail des destinataires de l'e-mail

        //Récupère le dernier document de devis associé à l'ID du devis et l'attache à l'e-mail en tant que pièce jointe.
        List<QuoteDocument> QDs = new list<QuoteDocument>([SELECT Name, Document, ContentVersionDocumentId FROM QuoteDocument WHERE QuoteId = :quoteID Order By CreatedDate DESC limit 1]);
        
        List<Messaging.EmailFileAttachment> attachments = new List<Messaging.EmailFileAttachment>();
        for (QuoteDocument QD: QDs) {
            Messaging.EmailFileAttachment efa = new Messaging.EmailFileAttachment();
            efa.setFileName(QD.Name);
            efa.setBody(QD.Document);
            attachments.add(efa);
        }
        message.setFileAttachments(attachments);
        
        
        Messaging.SingleEmailMessage[] messages = new List < Messaging.SingleEmailMessage > { message };
        Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
        
        if (results[0].success) {
            System.debug('The email was sent successfully.');
        } else {
            System.debug('The email failed to send: '+results[0].errors[0].message);
        }
    }
}