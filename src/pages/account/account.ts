import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import {
	App, NavController, NavParams, Platform, LoadingController, AlertController,
	ModalController, Content
} from 'ionic-angular';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { ActionSheetController } from 'ionic-angular'
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { Params } from '../../services/params';
import { HomeService } from '../../services/service.home';
import { DatabaseService } from '../../services/db.service';
import { CacheController } from '../../services/cache_controller';
import { AccountService } from '../../services/account.service';
import { CommonService } from '../../services/common.service';

import { badgesOs } from '../../services/badges.service';
import { AuthPage } from '../auth/auth';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { BadgesPage } from '../badges/badges';
import { SendBonusPage } from '../send-bonus/send-bonus'
import { OffersPage } from '../offers/offers'
import { GamesPage } from '../games/games'
import { BadgeViewPage } from '../badge-view/badge-view';
import { AppSoundProvider } from '../../providers/app-sound/app-sound';
import { Camera } from 'ionic-native'
import { File, FileEntry } from '@ionic-native/file';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { AuthService } from '../../services/auth.service';
declare var webengage: any;

@Component({
	selector: 'page-account',
	templateUrl: 'account.html'
})
export class AccountPage {
	@ViewChild(Content) content: Content;

	badgesLoaded: boolean = false;
	bonusCredit: number;
	rewardPoints: number;
	badgesForYou: any;
	waveShowingAccount: boolean = true;
	private cache: CacheController;
	private profileProgress: number = 50;
	private refreshCache: boolean = false;
	private unreadCount: number = 0;
	downShowing = 0;
	image_Data: any;
	down_arrow_showing = 0
	winning_balanceAPI;
	reward_pointsAPI;
	bonus_creditAPI;
	private homeMessage: any = {};
	options1: NativeTransitionOptions
	private accountDetails: any = {
		message: "",
		msn: "",
		nick_name: null,
		profile_image: "",
		reward_points: 0,
		winning_balance: 0.00,
		percentage: 0
	};
	buttonLabels = [];
	options: ActionSheetOptions = {
		subtitle: 'Are you sure you want to log out?',
		buttonLabels: this.buttonLabels,
		addCancelButtonWithLabel: 'Cancel',
		addDestructiveButtonWithLabel: 'Log Out',
		androidTheme: this.actionSheet.ANDROID_THEMES.THEME_HOLO_DARK,
		destructiveButtonLast: true
	};
	constructor(
		public app: App,
		private params: Params,
		private storage: Storage,
		public navParams: NavParams,
		public actionSheetCtrl: ActionSheetController,
		private iab: InAppBrowser,
		public authSrv: AuthService,
		public platform: Platform,
		private srvDb: DatabaseService,
		private _badgesOs: badgesOs,
		private srvHome: HomeService,
		private navCtrl: NavController,
		public appSound: AppSoundProvider,
		private srvAccount: AccountService,
		public modalCtrl: ModalController,
		private loadingCtrl: LoadingController,
		private alertCtrl: AlertController,
		public cdRef: ChangeDetectorRef,
		private file: File,
		private http: Http,
		public commonSrv: CommonService,
		private actionSheet: ActionSheet,
		private nativePageTransitions: NativePageTransitions) {
		console.log('AccountPage');
		this.cache = new CacheController(params, platform, srvDb, srvHome, alertCtrl);
		this._badgesOs.getBadgesData().subscribe(badgeData => {
			if (badgeData) {
				debugger
				this.badgesForYou = badgeData.response[0].badges
				this.badgesLoaded = true
			}
		})
		this.loadAccountData()
	}
	ionViewDidLoad() {
		console.log('ionViewDidLoad AccountPage');
		this.loadAccountData()
	}
	scrollHandlerAccount(event) {
		var scrollDiv = document.getElementById('accountContent').clientHeight;
		var innerDiv = document.getElementById('innerAccount').scrollHeight;
		var valu = scrollDiv + this.content.scrollTop
		console.log("data is ", valu, innerDiv, scrollDiv)
		if (valu > innerDiv) {
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
	//load accounts page data
	loadAccountData() {
		let loader = this.loadingCtrl.create({
			spinner: 'hide',
			content: `<img src="assets/vid/blue_bg2.gif" style="height:100px!important">`,
		});
		loader.present();
		this.cache.loadModules("home", "1", ["get_account_details"], this.refreshCache)
			.then(data => {
				loader.dismiss();
				this.waveShowingAccount = true
				this.refreshCache = false;
				console.log("AccountPage::ionViewDidLoad", data);
				for (var i = 0; i < data.length; i++) {
					if (data[i].get_account_details) {
						this.accountDetails = data[i].get_account_details.response;
						if (this.accountDetails.bonus_credit) {

							this.bonusCredit = parseInt(this.accountDetails.bonus_credit.slice(1));
							this.lastCalling()
						}
						else {
							this.bonusCredit = 0;
						}
						if (this.accountDetails.reward_points) {
							this.rewardPoints = parseInt(this.accountDetails.reward_points)
						}
						else {
							this.rewardPoints = 0;
						}
						if (this.accountDetails.profile_image && this.accountDetails.profile_image != "null") {
							var str = this.accountDetails.profile_image
							console.log("last character is ", str.charAt(str.length - 1))
							if (str.charAt(str.length - 1) == ".") {
								str = str.substring(0, str.length - 1);
								this.image_Data = str
							}
							else {
								if (localStorage.getItem("imageUrl")) {
									this.image_Data = localStorage.getItem("imageUrl")
								}
								else {
									this.image_Data = this.accountDetails.profile_image
								}
							}
						}
						else {
							if (localStorage.getItem("imageUrl")) {
								this.image_Data = localStorage.getItem("imageUrl")
							} else {
								this.image_Data = "assets/icon/user.svg"
							}
						}
					} else if (data[i].get_home_message) {
						this.homeMessage = data[i].get_home_message.response;
						this.unreadCount = this.homeMessage.unread;
					}
					this.content.enableScrollListener();
				}
				var a = localStorage.getItem("arrow_accountP")
				if (localStorage.getItem("arrow_accountP") == undefined || localStorage.getItem("arrow_accountP") == null) {
					this.down_arrow_showing = 1
				}
				else {
					this.down_arrow_showing = 0
				}
				localStorage.setItem("arrow_accountP", "1")

			}, err => {
				loader.dismiss();
				this.appSound.play('Error');
				this.params.setIsInternetAvailable(false);
				console.log("AccountPage::ionViewDidLoad", err);
			});
	}
	//Update nickname alert ctrl
	updateNickName() {
		this.appSound.play('buttonClick');
		let alert = this.alertCtrl.create({
			title: 'Login',
			inputs: [
				{
					name: 'nickname',
					placeholder: 'Nickname'
				}],
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel'
				},
				{
					text: 'Update',
					handler: data => {
						this.updateNickname(data.nickname);
						this.accountDetails.nick_name = data.nickname;
					}
				}
			]
		});
		alert.present();
	}
	//logout and removing all session to not show old data in new id
	logout() {
		console.log("AccountPage::logout");
		this.appSound.play('buttonClick');
		this.cache.clearDatabaseOnLogout();
		localStorage.removeItem("imageUrl")
		this.storage.remove('session_ID');
		localStorage.removeItem("arrow_accountP")
		localStorage.removeItem("affiliateP")
		localStorage.removeItem("affiliate2P")
		localStorage.removeItem("badgeP")
		localStorage.removeItem("chkWinningP")
		localStorage.removeItem("HelpP")
		localStorage.removeItem("redeemP")
		localStorage.removeItem("yourOffersP")
		localStorage.removeItem("yourGamesP")
		this.platform.ready().then((readySource) => {
			if (this.platform.is('cordova')) {
				webengage.engage();
				webengage.user.logout();
			}
		});
		this.storage.remove('session')
			.then(
			data => {
				console.log(data);
				let nav = this.app.getRootNav();
				nav.setRoot(AuthPage, { tab: 1 });
			},
			error => console.log(error)
			);
	}
	//Update details modal
	showUpdateDetailsModal() {
		this.appSound.play('buttonClick');
		console.log("AccountPage::showUpdateDetailsModal");
		if (this.platform.is('cordova')) {
			this.options1 = {
				direction: 'right',
				duration: 1000,
				slowdownfactor: 0,
				slidePixels: 0,
				iosdelay: 100,
				androiddelay: 150,
				fixedPixelsTop: 0,
				fixedPixelsBottom: 0
			};

			this.nativePageTransitions.slide(this.options1)
				.then()
				.catch();
			this.nativePageTransitions.slide(this.options1);
			this.navCtrl.push(EditProfilePage);
		}
		else {
			this.navCtrl.push(EditProfilePage);
		}
	}
	//open Webview
	openUrl(url: string) {
		this.appSound.play('buttonClick');
		let opt: string = "toolbarposition=top";
		this.iab.create(url, "_blank", opt);
	}
	//go to home page
	goHomePage() {
		this.appSound.play('buttonClick');
		this.params.goHomePage();
	}
	//open webview
	openWebView(str: string) {
		this.appSound.play('buttonClick');
		let opt: string = "toolbarposition=top";
		this.iab.create(CommonService.sitename + str, 'blank', opt);
	}
	//Update nick name
	updateNickname(nick) {
		console.log('AccountPage::updateNickname() ', nick);
		this.appSound.play('buttonClick');
		let loader = this.loadingCtrl.create({
			spinner: 'hide',
			content: `<img src="assets/vid/blue_bg2.gif" style="height:100px!important">`,
		});
		loader.present();
		this.srvAccount.updateNick(nick).take(1)
			.subscribe((success: any) => {
				loader.dismiss();
				if (success) {
					let res = success.response[0].update_nick_name.response;
					this.refreshCache = true;
					this.loadAccountData();
					let alert = this.alertCtrl.create({
						title: res.status,
						subTitle: res.message,
						buttons: ['Dismiss']
					});
					alert.present();
				}
			}, err => {
				loader.dismiss();
				this.appSound.play('Error');
				this.params.setIsInternetAvailable(false);
				console.log("AccountPage::updateNickname", err);
			});
	}
	//Go to badges
	moveToBadgeOs() {
		this.appSound.play('buttonClick');
		this.navCtrl.push(BadgesPage)
	}
	//Go to offers
	openCreditModule() {
		this.appSound.play('buttonClick');
		this.navCtrl.push(OffersPage, { "app": "outside" });
	}
	//Go to get games 
	openGetGamesModule() {
		this.appSound.play('buttonClick');
		this.navCtrl.push(GamesPage, { "app": "outside" });
	}
	private openGallery() {
		let cameraOptions = {
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
			destinationType: Camera.DestinationType.FILE_URI,
			quality: 80,
			targetWidth: 350,
			targetHeight: 120,
			encodingType: Camera.EncodingType.JPEG,
			correctOrientation: true
		}
		Camera.getPicture(cameraOptions).then((fileUri) => {
			this.image_Data = fileUri
			localStorage.setItem("imageUrl", fileUri)
			this.uploadPhoto(fileUri)

		}),
			err => {
				this.appSound.play('Error');
				console.log(err);
			}

	}
	//Loading balance
	lastCalling() {
		if (localStorage.getItem("imageUrl")) {
			this.image_Data = localStorage.getItem("imageUrl")
		}
		var dat = localStorage.getItem("imageUrl")
		this.commonSrv.getCreditPoints().subscribe(data => {
			console.log("at last data is ", data)
			if (data) {
				if (data.response[0].get_balance_details) {
					if (data.response[0].get_balance_details.response.bonus_credit) {
						this.bonus_creditAPI = data.response[0].get_balance_details.response.bonus_credit
					}
					else {
						this.bonus_creditAPI = 0
					}
					this.winning_balanceAPI = data.response[0].get_balance_details.response.winning_balance
					this.reward_pointsAPI = data.response[0].get_balance_details.response.reward_points
				}
				else {
					this.bonus_creditAPI = 0
					this.winning_balanceAPI = 0
					this.reward_pointsAPI = 0
				}

			}
			this.waveShowingAccount = false
		})
	}
	uploadImage() {
		this.appSound.play('buttonClick');
		let loader = this.loadingCtrl.create({
			spinner: 'hide',
			content: `<img src="assets/vid/blue_bg2.gif" style="height:100px!important">`,
		});
		loader.present();

		this.authSrv.uploadProfilePic(this.image_Data).subscribe(
			(data: any) => {
				loader.dismiss();
				console.log("image upload successful", data);
			},
			err => {
				loader.dismiss();
				this.appSound.play('Error');
				console.log("image upload error", err);
			},
			() => console.log("image upload complete")
		);

	}
	//#region Profile Upload
	selectProfileImage() {
		this.appSound.play('buttonClick');
		this.openGallery()
	}
	private error;
	private loading: any;
	private uploadPhoto(imageFileUri: any): void {
		this.error = null;
		this.loading = this.loadingCtrl.create({
			spinner: 'hide',
			content: `<img src="assets/vid/blue_bg2.gif" style="height:100px!important">`,
		});
		this.loading.present();

		this.file.resolveLocalFilesystemUrl(imageFileUri)
			.then(entry => (<FileEntry>entry).file(file => this.readFile(file)))
			.catch((err) => {
				this.appSound.play('Error');
				this.loading.dismiss()
			});
	}

	private readFile(file: any) {
		this.loading.dismiss();
		var reader;
		reader = new FileReader();
		reader.onloadend = (e) => {
			const imgBlob = new Blob([reader.result], { type: 'image/jpg' });
			var p = reader.response
			var m = reader.result
			this.postData(imgBlob, file.name);
		};
		reader.readAsArrayBuffer(file);
	}

	postData(blob: any, fileName: string) {
		let server = 'https://nima.lottosocial.com/wp-json/mobi/v2/upload/?process=profile'
		var extension = fileName.substr(fileName.lastIndexOf('.') + 1);
		let myHeaders: Headers = new Headers();
		myHeaders.set('Authorization',
			'Oauth oauth_consumer_key = "NDes1FKC0Kkg",' +
			'oauth_token="djKnEJjJ7TYw0VJEsxGEtlfg",' +
			'oauth_signature_method="HMAC-SHA1",' +
			'oauth_timestamp="1490087533",' +
			'oauth_nonce="dWL9pr",' +
			'oauth_version="1.0",' +
			'oauth_signature="mQF41gSF7KIuVqzqcI0nSX1UklE%3D"'
		);
		let options = {
			fileKey: fileName,
			fileName: fileName,
			mimeType: "image/" + extension,
			headers: myHeaders
		};
		this.loading.dismiss();
		console.log("SignupPage:: upload image options:", options);
		this.http.post(server, blob, options)
			.catch(err => this.handleError(err))
			.map(response => response.json())
			.subscribe((ok) => {
				debugger
				this.loading.dismiss();
				console.log("uploadPhoto:");
				console.log(ok);
				this.uploadAPI_Image(ok.response.image_name);
			}), (Err) => {
				this.appSound.play('Error');
				this.loading.dismiss();
			}

	}
	private customerId: string = "";
	uploadAPI_Image(image_url: any) {
		this.srvAccount.saveImageUrl(image_url).subscribe(data => {
			if (data) {
				alert("Uploaded");
			}

		})
	}

	//#endregion profile pic upload

	//Error handling
	private handleError(error: Response | any) {
		this.loading.dismiss();
		this.appSound.play('Error');
		let errMsg: string;
		if (error instanceof Response) {
			const body = error.json() || '';
			const err = body.error || JSON.stringify(body);
			errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}
		this.error = errMsg;
		return Observable.throw(errMsg);
	}
	//Move to badges
	goToBadgesView(badge: any) {
		this.appSound.play('buttonClick');
		this.navCtrl.push(BadgeViewPage, { badge: badge });
	}
	//Action sheet
	presentActionSheet() {
		if (this.platform.is('cordova')) {
			this.actionSheet.show(this.options).then((buttonIndex: number) => {
				console.log('Button pressed: ' + buttonIndex);
				if (buttonIndex == 1) {
					this.logout()
				}
			});
		}
		else {
			this.logout()
		}
	}


}
