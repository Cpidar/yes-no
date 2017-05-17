import {
  Component,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import {
  NavController,
  NavParams
} from 'ionic-angular';

import {
  ExQuestService
} from '../../providers/exQuest.service';
// import {
//   QuestionModel
// } from '../../model/question.model';
import {
  Chart
} from 'chart.js';
import {
  NativeStorage
} from '@ionic-native/native-storage';
import {
  Subscription
} from 'rxjs/Subscription';
import {
  LoadingController,
} from 'ionic-angular';

import 'rxjs/add/operator/switchMap';



/*
  Generated class for the Questions page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-questions',
  templateUrl: 'questions.html',
  animations: [
    trigger('questOpt', [
     state('false', style({transform: 'translateX(0)'})),
    transition('void => *', [
      style({transform: 'translateX(100%)'}),
      animate(1000)
    ]),
    transition('* => void', [
      style({transform: 'translateX(-100%)'}),
      animate(1000)
    ])
  ])
  ]
})
export class QuestionsPage implements OnDestroy {

  @ViewChild('doughnutCanvas1') doughnutCanvas1;
  @ViewChild('doughnutCanvas2') doughnutCanvas2;
  doughnutChart1: any;
  doughnutChart2: any;
  questProgress: number;
  hidden: boolean = false;
  currentQuest: any;
  boy: boolean = this.navParams.get('boy');
  subscription: Subscription;
  questNo: number = 1;
  loader = this.loadingCtrl.create({
    // content: "اندکی صبر...",
    //duration: 100
  });

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private exQuestService: ExQuestService,
    private nativeStorage: NativeStorage,
    public loadingCtrl: LoadingController
  ) {}

  ionViewDidLoad() {
    this.loader.present().then(() => {
      this.subscription = this.exQuestService.questionConsumed$.subscribe(x => this.currentQuest = x, e => console.log(e));
      this.exQuestService.request();
      this.loader.dismiss();
      this.drawChart();
    });


    //for loading the next readed questions: consuming on ngOnDestroy
    this.nativeStorage.getItem('questProgress').then(
      data => this.questProgress = data
    ).catch(
      error => console.log(error)
    )
  }

  nextQuest() {
    this.exQuestService.request();

    if (this.questNo % 10 == 8) {
      //console.log("in if " + this.questNo)
      this.exQuestService.getQuest(this.questNo + 9, 10).subscribe(
        x => {
          this.exQuestService.consume(x);
          //console.log(x)
        },
      )
    }
    // var randomnumber = Math.ceil(Math.random()*this.arr.length);
    this.hidden = false;
    this.questNo++;
    //console.log('current question: ' + this.currentQuest);

  }

  onyes() {
    this.hidden = true;
    if (this.boy) {
      this.currentQuest.byes = this.currentQuest.byes + 1;
    } else {
      this.currentQuest.gyes = this.currentQuest.gyes + 1;
    }
    var byes = parseInt((this.currentQuest.byes * 100 / (this.currentQuest.bno + this.currentQuest.byes)).toPrecision()) || 0;
    var gyes = parseInt((this.currentQuest.gyes * 100 / (this.currentQuest.gno + this.currentQuest.gyes)).toPrecision()) || 0;
    this.doughnutChart1.data.datasets[0].data[0] = byes;
    this.doughnutChart1.data.datasets[0].data[1] = 100 - byes;
    this.doughnutChart1.config.options.elements.center.text = `${byes}%`
    this.doughnutChart2.data.datasets[0].data[0] = gyes;
    this.doughnutChart2.data.datasets[0].data[1] = 100 - gyes;
    this.doughnutChart2.config.options.elements.center.text = `${gyes}%`
    this.doughnutChart1.update();
    this.doughnutChart2.update();
    //console.log(this.currentQuest);
    this.exQuestService.updateQuest(this.currentQuest).subscribe();
    //console.log("yes touched!")
  }

  onno() {
    this.hidden = true;
    if (this.boy) {
      this.currentQuest.bno = this.currentQuest.bno + 1;
    } else {
      this.currentQuest.gno = this.currentQuest.gno + 1;
    }
    var bno = parseInt((this.currentQuest.bno * 100 / (this.currentQuest.bno + this.currentQuest.byes)).toPrecision()) || 0;
    var gno = parseInt((this.currentQuest.gno * 100 / (this.currentQuest.gno + this.currentQuest.gyes)).toPrecision()) || 0;
    this.doughnutChart1.data.datasets[0].data[0] = bno;
    this.doughnutChart1.data.datasets[0].data[1] = 100 - bno;
    this.doughnutChart2.data.datasets[0].data[0] = gno;
    this.doughnutChart2.data.datasets[0].data[1] = 100 - gno;
    this.doughnutChart1.config.options.elements.center.text = `${bno}%`
    this.doughnutChart2.config.options.elements.center.text = `${gno}%`
    this.doughnutChart1.update();
    this.doughnutChart2.update();
    //console.log(this.currentQuest);
    this.exQuestService.updateQuest(this.currentQuest).subscribe();
    //console.log("yes touched!");
  }

  drawChart() {

    var yesColor = '#3FB8AF';
    var noColor = '#e7667b';
    var borderColor = '#F5F7FA';
    var yesLabel = 'بله';
    var noLabel = 'نه';

    Chart.pluginService.register({
      beforeDraw: function (chart) {
        if (chart.config.options.elements.center) {
          //Get ctx from string
          var ctx = chart.chart.ctx;

          //Get options from the center object in options
          var centerConfig = chart.config.options.elements.center;
          var fontStyle = centerConfig.fontStyle || 'BYekan';
          var txt = centerConfig.text;
          var color = centerConfig.color || '#000';
          var sidePadding = centerConfig.sidePadding || 20;
          var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
          //Start with a base font of 30px
          ctx.font = "30px " + fontStyle;

          //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
          var stringWidth = ctx.measureText(txt).width;
          var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

          // Find out how much the font can grow in width.
          var widthRatio = elementWidth / stringWidth;
          var newFontSize = Math.floor(30 * widthRatio);
          var elementHeight = (chart.innerRadius * 2);

          // Pick a new font size so it will not be larger than the height of label.
          var fontSizeToUse = Math.min(newFontSize, elementHeight);

          //Set font settings to draw it correctly.
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
          var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
          ctx.font = fontSizeToUse + "px " + fontStyle;
          ctx.fillStyle = color;

          //Draw text in center
          ctx.fillText(txt, centerX, centerY);
        }
      }
    });

    this.doughnutChart1 = new Chart(this.doughnutCanvas1.nativeElement, {
      type: 'doughnut',
      data: {
        labels: [yesLabel, noLabel],
        datasets: [{
          data: [50, 50],
          backgroundColor: [
            yesColor,
            noColor,
          ],
          borderColor: [
            borderColor,
            borderColor
          ],
          borderWidth: 5,
          label: 'Dataset 1'
        }]
      },
      options: {
        //if responsive: true => for animation must responsiveAnimationDuration set for example 1000, 
        //the default value for this is 0.
        responsive: true,
        responsiveAnimationDuration: 0,
        legend: {
          display: false,
          position: 'top',
        },
        title: {
          display: true,
          text: 'مردان',
          position: 'top',
          fontFamily: "BYekan",
        },
        animation: {
          animateScale: false,
          animateRotate: false
        },
        tooltips: {
          enabled: false
        },
        elements: {
          center: {
            text: "",
            color: yesColor, // Default is #000000
            fontStyle: 'Arial', // Default is Arial
            sidePadding: 20 // Defualt is 20 (as a percentage)
          }
        }
      }
    });

    this.doughnutChart2 = new Chart(this.doughnutCanvas2.nativeElement, {
      type: 'doughnut',
      data: {
        labels: [yesLabel, noLabel],
        datasets: [{
          data: [50, 50],
          backgroundColor: [
            yesColor,
            noColor,
          ],
          borderColor: [
            borderColor,
            borderColor
          ],
          borderWidth: 5,
        }]
      },
      options: {
        responsive: true,
        responsiveAnimationDuration: 0,
        legend: {
          display: false,
          position: 'top',
        },
        title: {
          display: true,
          text: 'زنان',
          position: 'top',
          fontFamily: "BYekan"
        },
        animation: {
          animateScale: false,
          animateRotate: false
        },
        tooltips: {
          enabled: false
        },
        elements: {
          center: {
            text: "",
            color: yesColor, // Default is #000000
            fontStyle: 'Arial', // Default is Arial
            sidePadding: 20 // Defualt is 20 (as a percentage)
          }
        }
      }
    });
  }

  handleError() {


  }
  ngOnDestroy() {
    //for saving the readed questions
    this.nativeStorage.setItem('questProgress', this.questProgress + this.questNo)
      .then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      );
    this.subscription.unsubscribe();
    this.doughnutChart1.destroy();
    this.doughnutChart2.destroy();
  }
}
