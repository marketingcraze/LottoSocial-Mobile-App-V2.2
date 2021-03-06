

import { Component, Input, Output, EventEmitter, SimpleChange, OnChanges } from '@angular/core';
import { LoadingController, AlertController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { OfferService } from '../../services/offer.service';
import { Params } from '../../services/params';

import { AppSoundProvider } from '../../providers/app-sound/app-sound';
@Component({
  selector: 'page-confirm-offer-purchase',
  templateUrl: 'confirm-offer-purchase.html'
})
export class confirmOfferPurchasePage implements OnChanges{
    slideInUp:boolean = false;
    confirmPayment:boolean = false;
    showBuyNowView:boolean = false;
    confirmPaymentSuccess:boolean = true;

    public cardSelected:any
    public cardsValue:any
    public cardsList:any[]

    public customerDetails
    public syndicate = {
        syndicate_name: "",
        total_cost:0.00
    }
    public offer = {
        syndicate_name: "",
        total_cost:0.00
    }

    @Output() onPaymentComplete = new EventEmitter();

    @Input('existing-cards') existingPaymilCards;  
    
    ngOnChanges(changes: {[ propName: string]: SimpleChange}) {
        // console.log('Change detected:', changes["existingPaymilCards"]);
        
        if (changes["existingPaymilCards"] && changes["existingPaymilCards"].currentValue) {
            this.cardsValue = changes["existingPaymilCards"].currentValue;
            
            console.log("existingPaymilCards", this.cardsValue);

            for (var i = 0; i < this.cardsValue.length; ++i) {
                
                console.log("existingPaymilCards", this.cardsValue[i]);

                if (this.cardsValue[i].get_customer_paymill_card_details) {
                    this.cardsList = this.cardsValue[i].get_customer_paymill_card_details.response.cards
                }else if (this.cardsValue[i].get_customer_details) {
                    this.customerDetails = this.cardsValue[i].get_customer_details.response
                }else if (this.cardsValue[i].offer) {
                    this.syndicate = this.cardsValue[i].offer
                }else if (this.cardsValue[i].syndicate) {
                    this.syndicate = this.cardsValue[i].syndicate

                }
            }

            // console.log("cardsList", this.cardsList );
            // console.log("customerDetails", this.customerDetails );
            
        }
    }
    
    constructor(
        private params:Params,
        private iab: InAppBrowser,
        public srvOffer: OfferService,
        public alertCtrl:AlertController,
        public appSound:AppSoundProvider,
        public loadingCtrl: LoadingController) {
        console.log('Hello PopupConfirmPaymentComponent Component');
    }

    buyNow(){
        console.log("PopupConfirmPaymentComponent::buyNow", this.cardSelected);
        this.appSound.play('buttonClick');

        if (this.cardSelected == '-1') {
            let opt:string = "toolbarposition=top";
            let str = 'https://nima.lottosocial.com/webview-auth/?redirect_to=free_reg&customer_id=1970400&customer_token=818113679640&Offer_ID=1188'

            // this.showBuyNowView = !this.showBuyNowView
            this.iab.create( str, 'blank', opt);
        }else{
            this.makeCardPayment(this.cardSelected);
        }
    }

    makeCardPayment(selectedCardIndex){
        this.appSound.play('buttonClick');
        let loader = this._showLoader();
        if (!selectedCardIndex) {
            let alert = this.alertCtrl.create({
                title: "Error!",
                subTitle: "Please select any option to make a payment",
                buttons: ['Dismiss']
            });
            alert.present();
        }

        let card = this.cardsList[parseInt(selectedCardIndex)]

        console.log("PopupConfirmPaymentComponent::makeCardPayment", selectedCardIndex, card)

        if (card) {
            this.srvOffer.processPaymillCardPayment(this.syndicate, this.customerDetails, card).subscribe((data) => {
                console.log("PopupConfirmPaymentComponent::checkCardExists() success", data);
                loader.dismiss();
                
                this.showBuyNowView = true;
                data = data.response[0];
                if (data.process_paymill_card_payment) {
                    data = data.process_paymill_card_payment.response
                    this.confirmPaymentSuccess = (data.status == "SUCCESS")
                }

                if (this.onPaymentComplete) {
                    this.onPaymentComplete.emit();
                }
            }, (err) => {
                console.log("PopupConfirmPaymentComponent::checkCardExists() error", err);
                this.confirmPaymentSuccess = false
                this.appSound.play('Error');
                this.params.setIsInternetAvailable(false)
            })
        }
    }

    private try_again(){
        this.appSound.play('buttonClick');
        this.togglePopup();
        this.confirmPaymentSuccess = true
        this.showBuyNowView = false;
    }

    viewTickets(){
        this.appSound.play('buttonClick');
        this.togglePopup();
        this.params.goTab(1);
        this.showBuyNowView = false;
    }

    viewOffers(){
        this.appSound.play('buttonClick');
        this.togglePopup();
        this.params.goTab(4);
        this.showBuyNowView = false;
    }


    public togglePopup(){
        console.log("showWhatsOn: " + this.slideInUp);

        if (this.slideInUp) {
            let timeoutId = setTimeout(() => {
                this.confirmPayment = !this.confirmPayment;
                clearTimeout(timeoutId);
            }, 500);
            this.slideInUp = !this.slideInUp;
        }else{
            this.confirmPayment = !this.confirmPayment;
            let timeoutId = setTimeout(() => {
                
                this.slideInUp = !this.slideInUp;
                clearTimeout(timeoutId);

            }, 10);
        }
    }

    private _showLoader() {
        let loader = this.loadingCtrl.create({
            content: "Saving data..."
        });
        loader.present()
        return loader;
    }


}







