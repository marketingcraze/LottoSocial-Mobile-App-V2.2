import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CheckWinningsPage } from '../check-winnings/check-winnings';
import { MySyndicatePage } from '../my-syndicate/my-syndicate';

@Component({
	selector: 'page-syndicates',
	templateUrl: 'syndicates.html'
})
export class SyndicatesPage {
  tab2child = CheckWinningsPage
  tab1child = MySyndicatePage
  indexSelected: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SyndicatePage');
  }

  ionViewWillEnter() {
    this.indexSelected = this.navParams.data.tabIndex || 0;
  }

}
