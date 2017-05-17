import {
  Component,
  OnDestroy
} from '@angular/core';

import {
  NavController,
  NavParams
} from 'ionic-angular';

import {
  QuestionsPage
} from '../questions/questions';
import {
  NativeStorage
} from '@ionic-native/native-storage';
import {
  ExQuestService
} from '../../providers/exQuest.service';
import {
  Subscription
} from 'rxjs/Subscription';
import {
  ToastController
} from 'ionic-angular';
import {
  Network
} from '@ionic-native/network';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnDestroy {
  disconnectSubscription: Subscription;
  progress: any;
  boy: boolean;
  firstQuestion: any;
  connected: boolean = true;

  constructor(public navCtrl: NavController,
    private navParams: NavParams,
    nativeStorage: NativeStorage,
    private exQuestService: ExQuestService,
    public toastCtrl: ToastController,
    private network: Network) {

  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'عجله نکن ... یه بار دیگه امتحان کن',
      duration: 3000
    });
    toast.present();
  }

  play() {
      this.navCtrl.push(QuestionsPage, {
        boy: this.navParams.get('boy'),
      });
  }

  ngOnDestroy() {
    this.disconnectSubscription.unsubscribe()
  }

}
