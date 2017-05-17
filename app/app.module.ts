import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Network } from '@ionic-native/network';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { QuestionsPage } from '../pages/questions/questions';
import {
  NativeStorage
} from '@ionic-native/native-storage';




import { ExQuestService } from '../providers/exQuest.service';



import { SplashScreen } from '@ionic-native/splash-screen';
import { LoadingController } from 'ionic-angular';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    QuestionsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      backButtonText: ''
    }),
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    QuestionsPage
  ],
  providers: [
    Network,
    SplashScreen,
    ExQuestService,
    NativeStorage,
    LoadingController,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
