import {
  Component,
  OnDestroy
} from '@angular/core';
import {
  NavController,
  NavParams
} from 'ionic-angular';
import {
  HomePage
} from '../home/home';
import {
  NativeStorage
} from '@ionic-native/native-storage';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnDestroy {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private nativeStorage: NativeStorage) {}

  ionViewDidLoad() {
  }

  onyes() {
    this.navCtrl.setRoot(HomePage, {
      boy: true
    });
  }

  onno() {
    this.navCtrl.setRoot(HomePage, {
      boy: false
    });
  }
  ngOnDestroy() {
    this.nativeStorage.setItem('intro', true);
  }
}
