import {LightningElement, api, wire} from "lwc";
// messageChannels
import { publish, MessageContext } from "lightning/messageService";
import CART_CHANNEL from "@salesforce/messageChannel/productAddRemoveCartChannel__c";
import talexoResources from '@salesforce/resourceUrl/logo';

export default class ProductCommande extends LightningElement {

    get appResources() {
        return {
            ProductImage: `${talexoResources}/talexo_black.png`,
        };
    }

    handleImageError(event) {
        // Set the default image URL when the specified image cannot be loaded
        event.target.src = `${talexoResources}/talexo_black.png`; // Adjust the default image path as necessary
    }

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
    
	@api
	get addedToCart() {
		return this.isAddedToCart;
	}
	set addedToCart(value) {
		this.isAddedToCart = value;
	}

	isAddedToCart;
    
	handleAddToCart() {
		this.isAddedToCart = true;
		let cartData = {
			productId: this.product.Id,
			Id : this.product.Id,
			quantity: this.Quantity,
			Name : this.product.Name,
			price : this.voucherValue,
			totalPrice : this.totalPrice,
		}
		this.publishChange(cartData, 'Add');
	}
    
	handleRemoveFromCart() {
		this.isAddedToCart = false;
		let cartData = {
			productId: this.product.Id,
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

    NameontheVoucher;
    HandelNameontheVoucherChange(event){
        this.NameontheVoucher = event.target.value;
    }

    @api
	get defaultNameontheVoucher() {
		return this.NameontheVoucher;
	}

	set defaultNameontheVoucher(value) {
		this.NameontheVoucher = value;
	}

    totalPrice;
	get returnTotalPrice() {
        this.totalPrice = this.Quantity * this.NumberOfVouchersPerBooklet * this.voucherValue;
        console.log(this.totalPrice);
		return this.totalPrice; 
	}

}