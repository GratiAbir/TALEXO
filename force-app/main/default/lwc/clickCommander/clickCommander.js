import { LightningElement, track, api, wire } from 'lwc';
import { publish, MessageContext } from "lightning/messageService";

export default class ClickCommander extends LightningElement {
    @track showModal = false;
    isAddedToCart;   

	@api openModal(productId, productName, productFamily, productImage) {
        this.showModal = true;
        this.productId = productId; // Assigner l'ID du produit
        this.productName = productName; // Assigner le nom du produit
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
            /*
			productId: 33,
			Id : 33,
			quantity: this.Quantity,
			Name : "this.product.Name",
			price : this.voucherValue,
			totalPrice : this.totalPrice,
            */
		}
		this.publishChange(cartData, 'Add');
	}
    
	handleRemoveFromCart() {
		this.isAddedToCart = false;
		let cartData = {
            /*
			productId: 33,
            */
		}
		this.publishChange(cartData, 'Remove');
		
	}
}