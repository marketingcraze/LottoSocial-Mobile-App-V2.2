import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController,LoadingController } from 'ionic-angular';
import { CashModalPage } from '../chooseCash-modal/chooseCash-modal';
import { CreditModalPage } from '../chooseCredit-modal/chooseCredit-modal';
import { SyndicateService } from '../../providers/syndicate-service';
declare const $:any;
/*
  Generated class for the Leave2 page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-ChooseCreditcash',
  templateUrl: 'ChooseCreditcash.html'
})
export class ChooseCreditcashPage {

   deviceHeight: any;
   mless = 'less';
   mlBool =  true
   isCash = false;
   claimevent_id:any;
   cash:any;
   credit:any;
   loader:any
    topmar: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public modalCtrl: ModalController,
  public _syndSrvc:SyndicateService,public loadingCtrl:LoadingController) {
    this.loader = this.loadingCtrl.create({
      content:"Please wait..."
    });
    this.claimevent_id = navParams.get('cid');
    this.cash = navParams.get('cash');
    this.credit = navParams.get('credit');
  }

  ionViewDidLoad() {
    this.deviceHeight = window.screen.height;
    
      var h = $('.m-div').height();
      this.topmar = (this.deviceHeight - h)/2;
  }


 chooseCredit() {
    let data = {'foo':'bar'}
    this.viewCtrl.dismiss(data);
    let chooseCreditModal = this.modalCtrl.create(CreditModalPage);
      chooseCreditModal.onDidDismiss(data => {
        console.log(data);
      });
      chooseCreditModal.present();
 }
 chooseCash() {
    let data = {'foo':'bar'}
    this.viewCtrl.dismiss(data);
    let chooseCashModal = this.modalCtrl.create(CashModalPage);
      chooseCashModal.onDidDismiss(data => {
        console.log(data);
      });
      chooseCashModal.present();
 }
 readMore(){
     if(this.mlBool == true){
         this.mlBool = false;
         this.mless = 'more'
     }else {
         this.mlBool = true;
         this.mless = 'less';
     }
 }
 selectCC(n:any) {
   if(n==0 && this.isCash){
     this.isCash = !this.isCash
   }else if(n==1 && !this.isCash) {
     this.isCash = !this.isCash
   }
 }
 choose() {
    if(this.isCash) {
      this.loader.present();
      this._syndSrvc.convertCash(this.claimevent_id)
        .subscribe((res:any)=> {
          console.log(res);
          this.chooseCash();
          this.loader.dismiss();
        })
   }else {
     this.chooseCredit();
   }
 }
}