import { LightningElement, api } from 'lwc';

export default class Card extends LightningElement {
    @api imageSrc;
    @api cardText;
    @api soustext;
}