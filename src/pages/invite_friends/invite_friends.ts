import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Platform, LoadingController } from 'ionic-angular';
import { ElementRef, ViewChild } from '@angular/core';
import { Contacts, Contact, ContactFieldType, ContactFindOptions } from '@ionic-native/contacts';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FormControl } from '@angular/forms';
import { SyndicateService } from '../../providers/syndicate-service';
import { HomePage } from '../home/home';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { AppSoundProvider } from '../../providers/app-sound/app-sound';



@Component({
  selector: 'page-invite_friends',
  templateUrl: 'invite_friends.html'
})

export class InviteFriendsPage {
  public close = 'close'
  public cclose = 'cclose'
  public blured = 'transparent'
  public searchTerm: string = '';
  public items: any;
  public fItems: any;
  public searchControl: FormControl;
  public searching: any = false;
  public clistheight: number
  public cfoothide: boolean = true
  public listPadding: number = 0
  public sid: any;
  private mDeatils: any;
  private loader: any
  private loader2: any
  private sharedata: any;

  @ViewChild('contactListHeader') elementView: ElementRef;

  constructor(public navCtrl: NavController, public appSound: AppSoundProvider, public navParams: NavParams, private toastCtrl: ToastController, private contacts: Contacts, public platform: Platform, public _syndService: SyndicateService,
    public loadingCtrl: LoadingController, private socialSharing: SocialSharing) {
    this.items = []
    this.fItems = []
    this.sid = this.navParams.get('sid');
    console.log(this.sid);
    this.loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/vid/blue_bg2.gif" style="height:100px!important">`,
    });
    this.loader2 = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/vid/blue_bg2.gif" style="height:100px!important">`,
    });
    this.searchControl = new FormControl();
    this.searchControl.valueChanges.debounceTime(100).subscribe(search => {

      this.searching = false;
      this.setFilteredItems();

    });
  }

  onSearchInput() {
    this.searching = true;
  }

  ionViewDidLoad() {
    this.clistheight = window.innerHeight - this.elementView.nativeElement.offsetHeight;
    this.getSyndicateMeembers();
    this.setFilteredItems();
    this.getContentToBeShared()
  }
  setFilteredItems() {
    if (this.items) {
      this.fItems = this.items.filter((item) => {
        return item.displayName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
      });
    }

  }

  toggle() {
    this.close = '';
    setTimeout(() => {
      this.blured = 'blured';
    }, 1000);

  }
  closed() {
    this.blured = 'transparent';
    this.close = 'close';
  }
  openContacts() {
    this.appSound.play('buttonClick');
    this.cclose = ''
    this.loader2.present()
    this.platform.ready().then(() => {
      this.contacts.find(['displayName', 'phoneNumbers'], { multiple: true }).then((gcontacts: Array<Contact>) => {
        var len = gcontacts.length;
        for (var i = 0; i < len; i++) {
          var name = '';
          if (gcontacts[i].displayName != null) {
            name = gcontacts[i].displayName;
          } else {
            name = gcontacts[i].name.formatted;
          }
          if (gcontacts[i].phoneNumbers) {
            this.items.push({
              displayName: name,
              phoneNumbers: [{ value: gcontacts[i].phoneNumbers[0].value }],
              selected: false
            })
          }
        }
        //  this.fItems = this.items;
        this.loader2.dismiss();
      })
        .catch((err) => {
          console.log('cordova is not available');
          this.loader2.dismiss();
        });
    })
  }
  cCancle() {
    // this.cclose = 'cclose'
    // this.cfoothide = true;
    // this.listPadding = 0;
    // if(this.items){
    // var arrlen = this.items.length;
    //   for(var j = 0; j < arrlen; j++){
    //     this.items[j].selected = false
    //   }
    // }
    this.navCtrl.pop();
  }

  addContact(item, i) {
    for (var j = 0; j < this.items.length; j++) {
      if (this.items[j].displayName == item.displayName) {
        if (this.items[j].selected == true) {
          this.items[j].selected = false
        } else {
          this.items[j].selected = true
        }
      }
    }


    var count: number = 0;
    var arrlen = this.items.length;
    for (var j = 0; j < arrlen; j++) {
      if (this.items[j].selected == true) {
        count++;
      }
    }

    if (count >= 1) {
      this.cfoothide = false;
      this.listPadding = 125
    } else {
      this.cfoothide = true;
      this.listPadding = 0;
    }

  }

  removeContact(item, i) {
    var count: number = 0;
    for (var j = 0; j < this.items.length; j++) {
      if (this.items[j].displayName == item.displayName) {
        this.items[j].selected = false
      }
      if (this.items[j].selected == true) {
        count++;
      }
    }
    if (count >= 1) {
      this.cfoothide = false;
      this.listPadding = 125
    } else {
      this.cfoothide = true;
      this.listPadding = 0;
    }

  }

  inviteSelected() {
    this.loader.present();
    var arr: any = [];
    for (var i = 0; i < this.fItems.length; i++) {
      var inv = "0";
      if (this.fItems[i].selected) {
        inv = "1";
      } else {
        inv = "0";
      }
      arr.push({
        "member_invited": inv,
        "first_name": this.fItems[i].displayName,
        "surname": "nn",
        "msn": this.fItems[i].phoneNumbers[0].value,
        "gender": "nn",
        "title": "Mr",
        "email": "nn",
        "address": "nn",
        "town": "nn",
        "postal_code": "nn",
        "date_of_birth": "nn",
        "company_name": "nn",
        "work_phone": "nn",
        "home_phone": "nn",
        "notes": "nn",
        "birthday": "nn",
        "url": "nn",
        "additional_msn": "nn",
        "company": "nn"

      })
    }

    this._syndService.insertContact(arr, this.sid)
      .subscribe((res: any) => {
        console.log('inisde api response')
        console.log(JSON.stringify(res));
        this.loader.dismiss();
        this.getSyndicateMeembers()
        this.cCancle()
        this.closed()
        this.presentToast()
      })

  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Invite successfully texted',
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'GOT IT'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  getSyndicateMeembers() {
    this.loader.present();
    this._syndService.getSyndicateMeembers(this.sid)
      .subscribe((res) => {
        this.loader.dismiss();
        console.log(res);
        this.mDeatils = res.response["0"].get_private_syndicate_members.response;
        console.log(this.mDeatils);
      })

  }

  shareInfo() {
    this.platform.ready().then(() => {
      this.socialSharing.share(this.sharedata.mgm_description, this.sharedata.mgm_title, this.sharedata.mgm_image, this.sharedata.mgm_referurl)
        .then((data) => {
          console.log('Shared via SharePicker');
        })
        .catch((err) => {
          console.log('Was not shared via SharePicker');
        });

    });
  }

  getContentToBeShared() {
    this._syndService.socialsharing()
      .subscribe((res) => {
        console.log(res);
        this.sharedata = res.response["0"].get_social_sharing.response.refer_friend_data["0"];
      })
  }

  viewTicket() {
    this.navCtrl.pop()
  }
}