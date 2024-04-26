import {LightningElement, api, wire, track} from "lwc";
import { publish, MessageContext } from "lightning/messageService"; // messageChannels
import CART_CHANNEL from "@salesforce/messageChannel/productAddRemoveCartChannel__c";

export default class ClickCommander extends LightningElement {
	@track showModal = false;
	@track additionalInputs = [];
    inputCounter = 1;

	@api openModal(productId, productName, productFamily, productImage) {
        this.showModal = true;
        this.productId = productId;
        this.productName = productName; 
        this.productFamily = productFamily;
        this.productImage = productImage;
    }

	get showVoucherForm() {
        return this.productFamily === 'Vouchers';
    }

    get showCreditCardForm() {
        return this.productFamily === 'Credit_Cards';
    } 

	closeModal(){
        this.showModal = false;
    }

    @api
	get addedToCart() {
		return this.isAddedToCart;
	}
	set addedToCart(value) {
		this.isAddedToCart = value;
	}

	isAddedToCart; 


    @api product;
    
	@wire(MessageContext)
	messageContext;
    
	publishChange(cartData, cartAction) {
		const message = {
			cartData: cartData,
			action:{
				cartAction : cartAction
			}
		};
		publish(this.messageContext, CART_CHANNEL, message);
	}
    
	handleAddToCart() {
		this.isAddedToCart = true;
		let cartData = {
            productId: this.productId,
			Id : this.productId,
			quantity: this.Quantity,
			Name : this.productName,
			price : this.voucherValue,
			totalPrice : this.totalPrice,
		}
		this.publishChange(cartData, 'Add');
	}
    
	handleRemoveFromCart() {
		this.isAddedToCart = false;
		let cartData = {
			productId: this.productId,
		}
		this.publishChange(cartData, 'Remove');
		
	}
    
    voucherValue = 8;
    HandelvoucherValueChange(event){
        this.voucherValue = event.target.value;
    }

    @api
	get defaultvoucherValue() {
		return this.voucherValue;
	}

	set defaultvoucherValue(value) {
		this.voucherValue = value;
	}
    //******************************************************** */
    NumberOfVouchersPerBooklet = 22;
    HandelNumberOfVouchersPerBookletChange(event){
        this.NumberOfVouchersPerBooklet = event.target.value;
    }

    @api
	get defaultNumberOfVouchersPerBooklet() {
		return this.NumberOfVouchersPerBooklet;
	}

	set defaultNumberOfVouchersPerBooklet(value) {
		this.NumberOfVouchersPerBooklet = value;
	}
    //******************************************************** */
    Quantity = 1;
    HandelQuantityChange(event){
        this.Quantity = event.target.value;
    }

    @api
	get defaultQuantity() {
		return this.Quantity;
	}

	set defaultQuantity(value) {
		this.Quantity = value;
	}

    totalPrice;
	get returnTotalPrice() {
        this.totalPrice = this.Quantity * this.NumberOfVouchersPerBooklet * this.voucherValue;
        console.log(this.totalPrice);
		return this.totalPrice; 
	}

	addInput() {
        this.inputCounter++;
        const newInput = {
            key: `input${this.inputCounter}`
        };
        this.additionalInputs = [...this.additionalInputs, newInput];
    }

}