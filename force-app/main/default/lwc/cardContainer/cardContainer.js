import { LightningElement } from 'lwc';
import croissanceAnnuelle from '@salesforce/resourceUrl/croissanceAnnuelle';
import employes from '@salesforce/resourceUrl/employes';
import entreprisesPartenaires from '@salesforce/resourceUrl/entreprisesPartenaires';
import Carte from '@salesforce/resourceUrl/Carte';
import ServiceClientele from '@salesforce/resourceUrl/ServiceClientele';
import automatise from '@salesforce/resourceUrl/automatise';

export default class CardContainer extends LightningElement {
    cards = [
        { 
            id: '1', 
            imageSrc: ServiceClientele, 
            cardText: "Service clientèle d'excellence", 
            soustext: "Notre équipe dévouée est là pour vous offrir un service clientèle exceptionnel, répondant à vos besoins avec rapidité et efficacité." 
        },

        { 
            id: '2', 
            imageSrc: automatise, 
            cardText: "Pas de paperasserie, 100% automatisé", 
            soustext: "Oubliez la paperasserie ! Avec TALEXO, tout est entièrement automatisé, simplifiant ainsi vos processus administratifs pour une expérience sans tracas." 
        },
        
        { 
            id: '3', 
            imageSrc: Carte, 
            cardText: "Carte TALEXO 3 en 1", 
            soustext: "Tous vos avantages réunis sur une seule carte ! Profitez de la commodité ultime avec notre carte TALEXO tout-en-un, offrant un accès facile à tous vos avantages en un seul endroit." 
        },
        
        { 
            id: '4', 
            imageSrc: entreprisesPartenaires, 
            cardText: "Plus de 10,000 entreprises partenaires", 
            soustext: "Nous travaillons avec un vaste réseau d'entreprises de toutes tailles, offrant des solutions sur mesure pour répondre à leurs besoins spécifiques." 
        },
        
        { 
            id: '5', 
            imageSrc: employes, 
            cardText: "Plus de 5 millions d'employés bénéficiaires", 
            soustext: "Chaque jour, nos services touchent la vie de millions de salariés, en leur offrant des avantages et des opportunités pour mieux vivre leur expérience professionnelle." 
        },

        { 
            id: '6', 
            imageSrc: croissanceAnnuelle, 
            cardText: "Une croissance annuelle de 20%", 
            soustext: "Notre engagement envers l'innovation et l'excellence nous a permis de maintenir une croissance soutenue, enrichissant continuellement notre offre pour nos partenaires." 
        },
    ];
}
