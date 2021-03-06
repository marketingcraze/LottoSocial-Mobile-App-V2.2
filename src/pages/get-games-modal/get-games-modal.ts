import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, ModalController, LoadingController } from 'ionic-angular';
import { RedeemGamesPage } from '../../pages/redeem-games/redeem-games'
import { paymentService } from '../../services/paymentService'
import { Storage } from '@ionic/storage';
import { PlayGamePage } from '../play-games/play-games';
import { AppSoundProvider } from '../../providers/app-sound/app-sound';


@Component({
  selector: 'page-get-games-modal',
  templateUrl: 'get-games-modal.html'
})
export class getGamesModal {
  fixedPrice: any;
  gameId: any;
  disable: any;
  creditBalance: any;
  awardID: any;
  visitorId: any;
  productDetail: any;
  productName: any;
  productCount: any;

  VoucherCode: any;
  title: any;
  price: any;
  price_after: any;
  pointsLive: any;
  status: any = "Passed";
  statusBuy: any = "Passed";
  value: boolean = false;
  counter = 1;

  constructor(public navCtrl: NavController,
    private viewctrl: ViewController,
    private paymentSrv: paymentService,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    public appSound: AppSoundProvider,
    private changeDetect: ChangeDetectorRef,
    private modalController: ModalController,
    private navprms: NavParams) {
    storage.get('firstTimeLoad').then((firstTimeLoad: any) => {
      this.visitorId = firstTimeLoad;
      console.log('firstTimeLoad storage', firstTimeLoad);
    });
    this.VoucherCode = this.navprms.get("VoucherCode")
    this.price = this.navprms.get("price")
    this.fixedPrice = this.navprms.get("price")
    this.pointsLive = this.price;
    this.title = this.navprms.get("title")
    this.price_after = this.navprms.get("price_after")
    this.status = this.navprms.get("p_staus")
    this.productName = this.navprms.get("p_name")
    this.productDetail = this.navprms.get("p_detail")
    this.awardID = this.navprms.get("p_award_id")
    this.creditBalance = this.navprms.get("cBalance");
    //this.creditBalance=60;
    console.log("status is " + this.status)

  }

  dismissPopUp(data: any = 1) {
    this.appSound.play('buttonClick');
    this.viewctrl.dismiss(data);
  }
  confirmpurchase() {
    this.appSound.play('buttonClick');
    this.productCount = this.counter;
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/vid/blue_bg2.gif" style="height:100px!important">`,
    });
    loading.present().then(() => {
      this.paymentSrv.redeemGame(this.visitorId, this.productCount, this.price, this.productName, this.productDetail, this.awardID).subscribe(data => {
        if (data) {
          loading.dismiss()
          var status = data.response[0].reward_payment_process.response.status;
          this.gameId = data.response[0].reward_payment_process.response.game_id;
          if (status === "SUCCESS") {
            this.value = true;
          }
          else {
            this.value = false;
            this.statusBuy = 'FAILED';
          }
        }
      }), (Err) => {
        loading.dismiss()
        this.appSound.play('Error');
        alert("Error occured")
      }
    })

  }
  closePopup() {
    this.appSound.play('buttonClick');
    this.navCtrl.popAll()
  }
  minusCounter() {
    this.appSound.play('buttonClick');
    if (this.counter != 1 && this.price <= this.creditBalance) {

      this.disable = document.getElementById("imgPlus");
      this.disable.style.filter = "opacity(1) drop-shadow(0 0 0 red)"
      this.counter--;
      this.price = this.pointsLive * this.counter;
      this.changeDetect.detectChanges();
    }
  }
  plusCounter() {
    this.appSound.play('buttonClick');
    if (this.counter < 5 && this.price != this.creditBalance) {

      this.counter++;
      this.price = this.pointsLive * this.counter;
      this.changeDetect.detectChanges();
    }
    else if (this.price >= this.creditBalance) {
      this.disable = document.getElementById("imgPlus");
      this.disable.style.filter = "opacity(0.5) drop-shadow(0 0 0 gray)"
      // this.disable="opacity(0.5) drop-shadow(0 0 0 gray)";
    }

  }
  moveToPlayGame() {
    this.appSound.play('buttonClick');
    this.navCtrl.popAll();
    this.navCtrl.push(PlayGamePage, { game: this.gameId })
  }
}






