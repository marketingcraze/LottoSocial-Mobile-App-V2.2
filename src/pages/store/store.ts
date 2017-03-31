import { Component, ViewChild } from '@angular/core';
import { App, Platform, NavController, NavParams, ActionSheetController, Slides } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { InviteFriendsPage } from '../invite_friends/invite_friends';
import { JoinSyndicatePage } from '../join-syndicate/join-syndicate';

@Component({
  selector: 'page-store',
  templateUrl: 'store.html'
})
export class StorePage {
    @ViewChild(Slides) home_slides: Slides;

    spaceBetween:number = -70;
    whatsOn:boolean = false;
    public nav:NavController;
    
    constructor(
        public app:App,
        public platform: Platform, 
        public navCtrl: NavController, 
      	public navParams: NavParams,
        private iab: InAppBrowser,
      	public actionSheetCtrl: ActionSheetController) {

        this.nav = this.app.getRootNav();

        this.spaceBetween = Math.floor( platform.width() * -0.10 );
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad StorePage');
    }

    loadLink(){
        let browser = this.iab.create('https://google.com');
        browser.show();
    }

    ngAfterViewInit() {
        console.log( "ngAfterViewInit()" );
        // this.home_slides.freeMode = true;
        this.home_slides.autoplayDisableOnInteraction = false;
    }

  showLottoSocial(){
  	console.log("showLottoSocial()");
  	let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your album',
      cssClass:'bottom-sheet',
      buttons: [
        {
          text: 'Destructive',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },{
          text: 'Archive',
          handler: () => {
            console.log('Archive clicked');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  handle(str:string){
      switch (str) {
          case 'join_syndicate':
              console.log('join_syndicate');
              
               this.nav.push(JoinSyndicatePage);
              break;
          
          default:
              // code...
              break;
      }

  }

  inviteFriends(){
    console.log("inviteFriends()");
    this.nav = this.app.getRootNav();
    this.nav.push(InviteFriendsPage);
  }



}
