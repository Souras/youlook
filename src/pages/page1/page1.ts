import { Page2 } from '../page2/page2';
import { Component, Renderer } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ApiSvc } from '../../providers/api-svc';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html',
  providers: [ApiSvc]
})
export class Page1 {
  feedData: any;
  siteModal: any = null;
  startIndex: number = 0;
  indexIncrement: number = 100;
  endIndex = this.startIndex + this.indexIncrement;
  currentSite: any = null;
  searchTerm: string = "";
  feedSites: any = [
    {
      url: "http://codekeen.blogspot.com/feeds/posts/default?alt=rss",
      name: "Code Keen",
      imageOptimization: false,
      id: 1
    },
    {
      url: "http://www.glamourmagazine.co.uk/rss/article/",
      name: "Glamour",
      imageOptimization: false,
      id: 2
    },
    {
      url: "http://www.allure.com/rss",
      name: "allure",
      imageOptimization: true,
      id: 3
    },
    {
      url: "http://www.beautyinsider.ru/feed/",
      name: "Beauty Insider",
      imageOptimization: true,
      id: 3
    },
    {
      url: "http://192.168.43.81:3000/homefeed",
      name: "Home",
      imageOptimization: true,
      id: 3
    }
  ]


  constructor(public navCtrl: NavController, private apisvc: ApiSvc, private renderer: Renderer) {
    this.callYUI(this.feedSites[0]);
    this.currentSite = this.feedSites[0];
    this.renderer.listenGlobal('window', 'scroll', (evt) => { console.log('scroll'); });
  }


  bindFeedForaSite(obj) {
    console.log("Selected URL", obj);
    this.startIndex = 0;
    this.endIndex = this.startIndex + this.indexIncrement;
    this.callYUI(obj);
    this.currentSite = obj;
  }

  callYUI(obj) {
    this.apisvc.getFeed(obj, this.searchTerm, this.startIndex, this.endIndex).subscribe(data => {
      // this.feedData = data.query.results.item;
      this.feedData = data;
     // console.log("Data:- ", this.feedData.length);
      // console.log("Data:- ", data);
    },
      err => {
        console.log("Error:- ", err);
        this.apisvc.failure(err);
      }
    )
  }

  goToDetails(item, index) {
    console.info("Second Page Item:- ", item);
    this.navCtrl.push(Page2, { currentItem: item, itemIndex: index, totalItem: this.feedData });
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.startIndex = this.startIndex + this.indexIncrement;
      this.endIndex = this.endIndex + this.indexIncrement;
      this.apisvc.getFeed(this.currentSite, this.searchTerm, this.startIndex, this.endIndex).subscribe(data => {
        if (data != false) {
          // let res = data.query.results.item;
          console.log(" before feedData:- ", this.feedData);
          let res = data;
          console.log("Infinite res:-", res);
          for (let i = 0; i < res.length; i++) {
            this.feedData.push(res[i]);
          }
          console.log('Async operation has ended', this.feedData.length, this.feedData);
          infiniteScroll.complete();
        }
        else {
          this.apisvc.showAlert("Feed End", "No more feed");
          infiniteScroll.complete();
        }
      },
        err => {
          console.log("Error:- ", err);
          this.apisvc.failure(err);
        }
      )
    }, 500);
  }

  ionViewDidEnter() {
    // this.apisvc.getData("imgCompressor", true, true).subscribe(data => {
    //   var response = data;
    //   console.log("Response Data: ", data);
    // },
    //   err => {
    //     this.apisvc.failure(err)
    //   });
    // this.apisvc.get_filesize('https://hc.weebly.com/hc/en-us/article_attachments/203665048/widget_done.png', function (size) {
    //   alert("The size of foo.exe is: " + size + " bytes.");
    // });
  }

}
