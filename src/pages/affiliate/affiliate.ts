import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, LoadingController, ViewController, ModalController } from 'ionic-angular';
import { AffiliateServices } from '../../services/affliate.service';
import { Observable } from "rxjs/Rx";
import { AffiliatePopup } from '../affiliate_popups/affiliate_popups'
import { Content } from 'ionic-angular'
import { OfferService } from '../../services/offer.service';

@Component({
    selector: 'page-affliate',
    templateUrl: 'affiliate.html'
})
export class AffiliatePage implements OnInit {
    userCards: any;
    tabbarElement: any;
    @ViewChild("confirmPayment") confirmPayment;
    @ViewChild(Content) content: Content;

    tabBarElement: any;
    constructor(
        private _affiliateServices: AffiliateServices, private loadingCtrl: LoadingController,
        private viewctrl: ViewController,
        private navCtrl: NavController,
        private offerService: OfferService,
        private modalController: ModalController,
        public cdRef: ChangeDetectorRef
    ) {
        this.tabbarElement = document.querySelector('.tabbar');
    }
    affilateModel: any = [];
    affilateModelBinding: any = [];
    day: any = [];
    hrs: any = [];
    mins: any = [];
    down_arrow_showing = 0;
    sec: any = [];
    TimeLeft: string = ""
    //NewTimeLeft: any;
    result: any = [];
    tDate: any = []
    sliceData: any = []
    lineNumber: any = []
    luckyDips: any = [];
    luckyDipDate: any;
    luckyDipMonth: any;
    luckyDipDay: any;
    regular_from: any;
    regular_to: any;
    bonus_from: any;
    bonus_to: any;
    regular_duplicate: any;
    bonus_duplicate: any;
    dummy: any;
    downShowing = 0;
    scrollContent: any;

    ngOnInit() {
        this.getRanMethod();
        this.getAffiliateData();
    }

    getAffiliateData() {

        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: `<img src="assets/vid/blue_bg.gif" style="height:100px!important">`,
        });
        console.log('ionViewDidLoad PlayGamePage');
        loading.present().then(() => {
            this._affiliateServices.loadAffiliateData()
                .subscribe(data => {
                    this.affilateModelBinding = data.response[0].get_affiliate_page_details.response.product_group[0];
                    this.getDateAndMonth(this.affilateModelBinding.countdown);
                    this.regular_from = this.affilateModelBinding.regular_from
                    this.regular_to = this.affilateModelBinding.regular_to;
                    this.bonus_from = this.affilateModelBinding.bonus_from;
                    this.bonus_to = this.affilateModelBinding.bonus_to;
                    this.regular_duplicate = this.affilateModelBinding.regular_duplicate;
                    this.bonus_duplicate = this.affilateModelBinding.bonus_duplicate;
                    Observable.interval(1000).takeWhile(() => true).subscribe(() => this.calTime(this.affilateModelBinding.countdown));
                    this.dummy = (String(this.affilateModelBinding.offer_jackpot).substr(0, 4))
                    var a = localStorage.getItem("affiliateP")
                    if (localStorage.getItem("affiliateP") == undefined || localStorage.getItem("affiliateP") == null) {
                        this.down_arrow_showing = 1
                    }
                    else {
                        this.down_arrow_showing = 0
                    }
                    localStorage.setItem("affiliateP", "1")
                    loading.dismiss();
                })
        })
    }
    ionViewWillEnter() {
        this.tabbarElement.style.display = 'none';
        this.delay(4000);
        this.content.enableScrollListener();
    }
    ionViewWillLeave() {
        this.tabbarElement.style.display = 'flex';
    }
    scrollHandlerAffiliate(event) {

        var innerDiv = document.getElementById('innerAffiliate').scrollHeight;
        var scrollDiv = document.getElementById('affiliateContent').clientHeight;

        var valu = scrollDiv + this.content.scrollTop
        if (valu > innerDiv - 60) {
            this.downShowing = 1
            this.cdRef.detectChanges();
        }
        else {
            this.downShowing = 0
            this.down_arrow_showing = 0
            this.cdRef.detectChanges();
        }
    }
    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    getDateAndMonth(date: any) {

        var dates = new Date(date);
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var months = ["January ", "February", "March", "April", "May", "June ", "July", "August ", "September", "October", "November", "December",];
        this.luckyDipDay = days[dates.getDay()];
        this.luckyDipMonth = months[dates.getMonth()];
        this.luckyDipDate = dates.getDate();
    }
    dismissPopUp(data) {
        this.scrollContent = document.querySelector('.scroll-content');
        this.scrollContent.style['overflow'] = 'hidden';
        let modal = this.modalController.create(AffiliatePopup);
        modal.present();
        modal.onDidDismiss((data: any[]) => {
            this.tabbarElement.style.display = 'flex';
            this.scrollContent = document.querySelector('.scroll-content');
            this.scrollContent.style['overflow'] = 'none';
            this.viewctrl.dismiss();
        })

    }
    openPurchage() {

        this.userCards  
        this.confirmPayment.togglePopup()
        // let loader = this.loadingCtrl.create({
        //     spinner: 'hide',
        //     content: `<img src="assets/vid/blue_bg.gif" style="height:100px!important">`,
        // });
        // loader.present().then(() => {
        //     this.offerService.buyCurrentOfferOnHomeCard("").subscribe((data) => {
        //         let token_exists = 0;
        //         for (var i = 0; i < data.response.length; ++i) {
        //             if (data.response[i].get_customer_paymill_card_details) {
        //                 token_exists = data.response[i].get_customer_paymill_card_details.response.token_exists
        //             }
        //         }
        //         if (token_exists > 0) {
        //             debugger

        //             this.userCards = data.response;


        //             loader.dismiss();
        //             this.confirmPayment.togglePopup()
        //         } else {
        //             loader.dismiss()
        //         }
        //     }, (err) => {
        //         loader.dismiss()
        //         console.log("StorePage::showPaymentOptions() error", err);
        //     });
        // })
    }

    genrateRanNumberUpdate(luckyDips: any, index: any) {

        let j = 0;
        let d: any = [];
        d[j++] = this.getRandomInt(this.regular_from, this.regular_to);
        d[j++] = this.getRandomInt(this.regular_from, this.regular_to);
        d[j++] = this.getRandomInt(this.regular_from, this.regular_to);
        d[j++] = this.getRandomInt(this.regular_from, this.regular_to);
        d[j++] = this.getRandomInt(this.regular_from, this.regular_to);
        d[j++] = this.getRandomInt(this.bonus_from, this.bonus_to);
        d[j++] = this.getRandomInt(this.bonus_from, this.bonus_to);
        this.luckyDips[index] = d;
    }

    genrateRanNumber(index: any) {
        this.getRanMethod();
    }

    getRanMethod() {

        for (let i = 0; i < 10; i++) {
            let j = 0;
            let d: any = [];
            d[j++] = this.getRandomInt(10, 99);
            d[j++] = this.getRandomInt(10, 99);
            d[j++] = this.getRandomInt(10, 99);
            d[j++] = this.getRandomInt(10, 99);
            d[j++] = this.getRandomInt(10, 99);
            d[j++] = this.getRandomInt(1, 9);
            d[j++] = this.getRandomInt(1, 9);
            this.luckyDips.push(d)
        }
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // openPopUp() {
    //     let modal = this.modalController.create(AffiliatePopup, {
    //     })
    //     modal.present();
    // }

    calTime(date: any) {

        let now = new Date().getTime();
        if (!date) {
            return this.result;
        }
        if (typeof (date) === "string") {
            date = new Date(date);
        }

        let delta = Math.floor((now - date.getTime()) / 1000);
        if (delta < 0) {
            this.result = "-"
            delta = Math.abs(delta);
        }

        let dayCal = Math.floor(delta / 86400);
        delta %= 86400
        let hourCal = Math.floor(delta / 3600);
        delta %= 3600
        let minuteCal = Math.floor(delta / 60);
        delta %= 60
        let secondsCal = Math.floor(delta)

        this.day = (dayCal <= 9) ? '0' + dayCal : dayCal;
        this.hrs = (hourCal <= 9) ? '0' + hourCal : hourCal;
        this.mins = (minuteCal <= 9) ? '0' + minuteCal : minuteCal;
        this.sec = (secondsCal <= 9) ? '0' + secondsCal : secondsCal;
    }
}