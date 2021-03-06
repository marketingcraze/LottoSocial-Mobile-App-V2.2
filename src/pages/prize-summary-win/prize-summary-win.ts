import { Component } from '@angular/core';
import { NavController, NavParams, App, ViewController, LoadingController, ModalController, Tabs } from 'ionic-angular';
import { CheckWinningsNextPage } from '../check-winnings-next/check-winnings-next';
import { SyndicateService } from '../../providers/syndicate-service';
import { ChooseCreditcashPage } from '../ChooseCreditcash/ChooseCreditcash';
import { TabsPage } from '../tabs/tabs';
import { HomePage } from '../home/home';
import { YourGamesPage } from '../your-games/your-games';
import { AppSoundProvider } from '../../providers/app-sound/app-sound';
/*
  Generated class for the CheckWinnings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-prize-summary-win',
  templateUrl: 'prize-summary-win.html'
})
export class PrizeSummaryWinPage {
  loader: any;
  prizeData: any;
  allData: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public app: App,
    public viewCtrl: ViewController,
    public _syndService: SyndicateService,
    public loadingCtrl: LoadingController,
    public appSound: AppSoundProvider,
    public modalCtrl: ModalController,
    public _syndSrvc: SyndicateService
  ) {

  }

  // next() {
  //   this.app.getRootNav().push(CheckWinningsNextPage);
  // }
  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
    this.loadPrize();
  }
  chooseCreditcash() {
    this.appSound.play('buttonClick');
    let leave2Modal = this.modalCtrl.create(ChooseCreditcashPage, { cid: this.allData.claim_event_id, cash: this.prizeData.CashEquAmount, credit: this.prizeData.credit_win.value });
    leave2Modal.onDidDismiss(data => {
      this.viewCtrl.dismiss(data)
    });
    leave2Modal.present();
  }
  loadPrize() {
    this.loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/vid/blue_bg2.gif" style="height:100px!important">`,
    });
    this.loader.present();
    this._syndService.prizeBreakDown()
      .subscribe((res: any) => {
        this.loader.dismiss();
        debugger
        //res = { "response": { "winningdetails": { "title": "Congratulations! You have got...", "winning_value": { "value": "0", "color": "green", "sub_heading": "LOTTERY CASH WINS", "show": "0", "tab_text": "Test" }, "credit_win": { "value": "2.8", "color": "orange", "sub_heading": "LOTTERY BONUS CREDIT", "show": "1", "tab_text": "Test" }, "total_bonus_line": "6", "reward_points": { "value": "2100", "color": "blue", "sub_heading": "REWARD POINTS", "show": "1", "tab_text": "Test" }, "monthly_prize_draw": { "value": "0", "color": "red", "sub_heading": "MONTHLY PRIZE DRAW", "show": "0", "tab_text": "Test" }, "voucher": { "value": "0", "color": "yellow", "sub_heading": "VOUCHER", "show": "0", "tab_text": "Test" }, "CashEquAmount": "0.7", "lotto_lucky_dip": { "value": "0", "color": "orange", "sub_heading": "0x 2 LOTTO BALL MATCHES", "show": "0", "tab_text": "Test" }, "lotto_matches_count": "0" }, "response_type": "10.1", "claim_event_id": "149670", "claim_event_status": "1" } }
        this.prizeData = res.response.winningdetails
        this.allData = res.response;
        console.log(res);
      })
  }
  goto(value: any = 'game') {
    this.appSound.play('buttonClick');
    this.viewCtrl.dismiss(value)

  }
}
