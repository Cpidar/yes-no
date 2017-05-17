import {
  Injectable
} from '@angular/core';
import {
  Http,
  Response,
  Headers,
  RequestOptions
} from '@angular/http';
import {
  Observable
} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/retry';

import {
  Subject
} from 'rxjs/Subject';
import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';
import {
  QuestionModel
} from '../model/question.model';

import {
  NativeStorage
} from '@ionic-native/native-storage';

@Injectable()
export class ExQuestService {

  firstQuestion: any;

  //for controlling of question consume
  controller = new Subject();

  //for transfer of data from app.component to question page
  questionSource = new BehaviorSubject([{
    question: "کمی صبر کنید ..."
  }]);

  connected: boolean;
  questionConsumed$ = this.questionSource.asObservable()

  constructor(private http: Http, private nativeStorage: NativeStorage) {}

  // loadData(limit) {
  //   console.log("load started ...")
  //   return Observable.fromPromise(this.nativeStorage.getItem('questProgress').then(x => x, e => 0))
  //     .map(x => this.getQuest(x, limit))

  //   // .subscribe(x => console.log("das: " + x))
  // }

  //get data from internet but  beacause of using zip, data dont emit until we invoked request()
  getQuest(sk, limit): Observable < QuestionModel[] > {
    //console.log('loading from ex ...')
    return this.http.get(`https://api.mlab.com/api/1/databases/cpidarstudent/collections/questions?sk=${sk}&l=${limit}&apiKey=pvtM8mfWs5SkNLp0w0ObBrnphB4ns7lI`)
      .retry(5)
      .map(this.extractData)
      .flatMap(x => Observable.from(x))
      .zip(this.controller, (x, _) => x)
  }

  private extractData(res: Response) {
    let body = res.json();
    //console.log(body);
    return body;
  }

  consume(question) {
    //console.log(question)
    this.questionSource.next(question)
  }

  request() {
    //console.log('request')
    this.controller.next();
  }

  updateQuest(quest): Observable < void > {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.put(`https://api.mlab.com/api/1/databases/cpidarstudent/collections/questions/${quest._id.$oid}?apiKey=pvtM8mfWs5SkNLp0w0ObBrnphB4ns7lI`,
      JSON.stringify(quest), options).map(res => console.log(res))
  }

}
