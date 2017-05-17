// import {
//   Injectable
// } from '@angular/core';
// import {
//   Subject
// } from 'rxjs/Subject';
// import {
//   NativeStorage
// } from '@ionic-native/native-storage';

// import { QuestionModel } from '../model/question.model';
// import { ExQuestService } from './exQuest.service'


// @Injectable()
// export class InQuestService {
//   buffer: QuestionModel[] = [];
//   counter: number = 0;
//   questStart: number;

//   constructor(nativeStorage: NativeStorage, public exQuestService: ExQuestService){}

//   private questionSource = new Subject();
//   private questionBuffer = new Subject();

//   questionLoaded$ = this.questionSource.asObservable();
//   questionConsumed$ = this.questionBuffer.asObservable();

//   loadQuestion(limit) {

//             this.exQuestService.getQuest(this.questStart + this.counter, limit)
//               .subscribe(
//                 data => {
//                   this.buffer.push(...data as QuestionModel[]);
//                   console.log(this.buffer)
//                 },
//               //   error => {
//               //     let alert = this.alertCtrl.create({
//               //       subTitle: 'لطفا اتصال اینترنت خود را بررسی نمایید',
//               //       buttons: [{
//               //         text: 'تایید',
//               //         handler: () => platform.exitApp()
//               //       }]
//               //     });
//               //     alert.present();
//               //   }
//               );

//     // this.questionLoaded$.subscribe(
//     //   quest => {
//     //     console.log(quest);
//     //     this.buffer = quest as QuestionModel[];
//     //     //console.log(this.questionLoaded$);
//     //   }
//     //)
//     //this.questionSource.next(quest);
//   }

//   consumeQuest() {
//     //var counter = counter || this.counter++;
//       this.questionBuffer.next(this.buffer[this.counter++])

//   }

// }
