import {
  Component,
  ViewChild
} from '@angular/core';
import {
  Platform,
  NavController,
  AlertController
} from 'ionic-angular';
import {
  SplashScreen
} from '@ionic-native/splash-screen';
import {
  NativeStorage
} from '@ionic-native/native-storage';
import {
  HomePage
} from '../pages/home/home';

import {
  LoginPage
} from '../pages/login/login';
import {
  ExQuestService
} from '../providers/exQuest.service';

import 'rxjs/add/operator/take';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('nav') nav: NavController
  rootPage: any;
  questProgress: number;
  firstQuestion: any

  constructor(
    private platform: Platform,
    splashScreen: SplashScreen,
    private nativeStorage: NativeStorage,
    private exQuestService: ExQuestService,
    private alertCtrl: AlertController
  ) {

    platform.ready().then(() => {

      nativeStorage.getItem('questProgress')
        .then(
          data => {
            //console.log('game progress saved')
            this.exQuestService.getQuest(Number(data), 10).subscribe(
              x => {
                this.exQuestService.consume(x);
         },
              e => {
                this.handleError(e)
              }
            )
          },
          error => {
            //console.log('game progress saved')
            this.exQuestService.getQuest(0, 10).subscribe(
              x => {
                this.exQuestService.consume(x);
              },
              e => {
                this.handleError(e)
              }
            )
          }
        )

        this.introShown();

      splashScreen.hide();
      //setTimeout(this.exQuestService.request(), 3000)

    });

  }

  handleError(e) {
    if (e.status == 0) {
      let alert = this.alertCtrl.create({
        subTitle: 'لطفا اتصال اینترنت خود را بررسی نمایید',
        buttons: [{
          text: 'تایید',
          handler: () => this.platform.exitApp()
        }]
      });
      alert.present();
    } else if (e.status < 500 && e.status >= 400) {
      let alert = this.alertCtrl.create({
        subTitle: 'مشکل در برقراری ارتباط با سرور، لطفا مجددا امتحان کنید',
        buttons: [{
          text: 'تایید',
          handler: () => this.platform.exitApp()
        }]
      });
      alert.present();
    }
  }

  introShown() {
          this.nativeStorage.getItem('intro').then((result) => {
          this.rootPage = HomePage;
        },
        error => {
          this.rootPage = LoginPage;
        }
      );
  }

}
