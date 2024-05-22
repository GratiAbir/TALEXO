import {LightningElement, api, wire, track} from "lwc";
import { publish, MessageContext } from "lightning/messageService"; // messageChannels
import CART_CHANNEL from "@salesforce/messageChannel/productAddRemoveCartChannel__c";


export default class ClickCommander extends LightningElement {
	@track showModal = false;
	
    

	@api openModal(productId, productName, productFamily, productImage) {
        this.showModal = true;
        this.productId = productId;
        this.productName = productName; 
        this.productFamily = productFamily;
        this.productImage = productImage;
    }

	closeModal(){
        this.showModal = false;
    }

	get showVoucherForm() {
        return this.productFamily === 'Vouchers';
    }

    get showCreditCardForm() {
        return this.productFamily === 'Credit_Cards';
    } 

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
    
	handleAddVoucherToCart() {
		this.isAddedToCart = true;
		let cartData = {
            productId: this.productId,
			id : this.productId,
			name : this.productName,
			quantity : this.Quantity,			
			price : this.voucherValue*this.NumberOfVouchersPerBooklet,
			totalPrice : this.totalPriceVouchers,
			voucherValue : this.voucherValue,
			numberOfVouchersPerBooklet : this.NumberOfVouchersPerBooklet,
		}
		this.publishChange(cartData, 'Add');
		this.showModal = false;
	}

	handleAddCardToCart(){
		this.isAddedToCart = true;
		/*beneficiariesData = [];

		// Parcourir la liste des bénéficiaires et ajouter chaque bénéficiaire à la liste
		for (let beneficiary of this.beneficiaries) {
			beneficiariesData.push({
				fullName: beneficiary.fullName,
				cin: beneficiary.cin
			});
		}
		*/

		let cartData = {
			productId: this.productId,
			id : this.productId,
			name : this.productName,
			quantity : this.inputCounter,
			price : this.recharcheValue,
			totalPrice : this.totalPriceCards,
			voucherValue : this.recharcheValue,			
			beneficiaries: this.additionalInputs,
		};

		// Publier le changement
		this.publishChange(cartData, 'Add');
		this.showModal = false;
	}
    
	handleRemoveFromCart() {
		this.isAddedToCart = false;
		let cartData = {
			productId: this.productId,
			Id : this.productId
		}
		this.publishChange(cartData, 'Remove');
	}
    
	//******************************************************** */
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

	//******************************************************** */
    totalPriceVouchers;
	get returnTotalPriceVouchers() {
        this.totalPriceVouchers = this.Quantity * this.NumberOfVouchersPerBooklet * this.voucherValue;
		return this.totalPriceVouchers; 
	}


	//******************************************************** */
	recharcheValue = 176; 
	HandleRechargeValueChange(event) {
        this.recharcheValue = event.target.value;
    }

	@api
	get defaultrecharcheValue() {
		return this.recharcheValue;
	}

	set defaultrecharcheValue(value) {
		this.recharcheValue = value;
	}

	//******************************************************** */
	@track additionalInputs = [];
	inputCounter = 0;

	addInput() {
        this.inputCounter++;
        const newInput = {
            key: `input${this.inputCounter}`,
			fullName: '',
			cin: ''
        };
        this.additionalInputs = [...this.additionalInputs, newInput];
		console.log('additionalInputs',this.additionalInputs );
    }

	HandelFullNameChange(event) {
        // Get the key of the input that triggered the event
        const key = event.target.id;
		
        // Get the value of the full name input
        const fullName = event.target.value;

        // Find the input in the additionalInputs array and update its fullName property
        const inputIndex = this.additionalInputs.findIndex(input => event.target.id.startsWith(input.key));

        if (inputIndex !== -1) {
            this.additionalInputs[inputIndex].fullName = fullName;
        }
    }

	HandelCINChange(event) {
        // Get the key of the input that triggered the event
        const key = event.target.id;

        // Get the value of the CIN input
        const cin = event.target.value;

        // Find the input in the additionalInputs array and update its cin property
        const inputIndex = this.additionalInputs.findIndex(input => event.target.id.startsWith(input.key));

        if (inputIndex !== -1) {
            this.additionalInputs[inputIndex].cin = cin;
        }
    }

	deleteInput(event) {
		event.preventDefault(); // Prevent the default anchor behavior
		const key = event.target.getAttribute('data-key');
		
		// Filter out the input with the matching key
		this.additionalInputs = this.additionalInputs.filter(input => input.key !== key);
	}
	
	/*
	@track beneficiaries = [];
	inputCounter = 0;
	addInput() {
		this.inputCounter++;
		const newInput = {
			key: `input${this.inputCounter}`,
			fullName: '',
			cin: ''
		};
		this.beneficiaries = [...this.beneficiaries, newInput];
	}

	handleBeneficiaryChange(event) {
		const index = event.target.dataset.index;
		const field = event.target.name;
		const value = event.target.value;

		// Mettre à jour les données du bénéficiaire dans la liste beneficiaries
		this.beneficiaries[index][field] = value;
		
		// Affiche les données des bénéficiaires dans la console
		console.log("Données des bénéficiaires après modification :", this.beneficiaries);
	}
	*/	

	//******************************************************** */
	totalPriceCards; 
	get returnTotalPriceCards() {
		this.totalPriceCards = this.recharcheValue * this.additionalInputs.length;
		return this.totalPriceCards;
	}
/***************************** increase-decrease */
increaseVoucherValue() {
    this.voucherValue++;
}

decreaseVoucherValue() {
    if (this.voucherValue > 0) {
        this.voucherValue--;
    }
}

increaseNumberOfVouchersPerBooklet() {
    this.NumberOfVouchersPerBooklet++;
}

decreaseNumberOfVouchersPerBooklet() {
    if (this.NumberOfVouchersPerBooklet > 0) {
        this.NumberOfVouchersPerBooklet--;
    }
}

increaseQuantity() {
    this.Quantity++;
}

decreaseQuantity() {
    if (this.Quantity > 0) {
        this.Quantity--;
    }
}

increaseRecharcheValue(){
	this.recharcheValue++;
}

decreaseRecharcheValue(){
	if (this.recharcheValue > 0) {
        this.recharcheValue--;
    }
}
}