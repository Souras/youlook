import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiSvc } from '../../providers/api-svc';
import { api, msg } from '../../app/app.configuration';
import { Gesture } from 'ionic-angular';
/*
  Generated class for the Main page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
  providers: [ApiSvc]
})
export class MainPage {
  sitesFeeds: any = [];
  feeds: any = [];
  //get elementRef for DOM element we want to assign to
  //@ViewChild('myTouchElement') element;
  gesture: Gesture

  constructor(public navCtrl: NavController, public navParams: NavParams, private apisvc: ApiSvc) {

  }

  ionViewDidEnter() {
    this.ViewOnLoad();
  }
  bindResData() {
    for (var index in this.sitesFeeds) {
      this.feeds = this.feeds.concat(this.sitesFeeds[index].items);
      // this.feeds.push(this.sitesFeeds[index].items);
    }
  }
  ViewOnLoad() {

    this.apisvc.getData(api.base + api.homefeed, false, false).subscribe(data => {
      if (typeof data.query != "undefined") {
        this.sitesFeeds = data.query.results.item;
        //this.bindResData();
      }
      else {
        this.sitesFeeds = [{
          items: [
            {
              coverImg: "",
              isCoverImg: true,
              title: "no Data found"
            }]
        }]
      }
      this.bindResData();


    },
      err => {
        console.log("Home Feed Err", err);
      });

  }

  pinchEvent(e) {
    console.log("pinchEvent", e);
    // this.width = this.pinchW * e.scale;
    // this.height = this.pinchH * e.scale;
    // if (this.timeout == null) {
    //   this.timeout = setTimeout(() => {
    //     this.timeout = null;
    //     this.updateWidthHeightPinch();
    //   }, 1000);
    // } else {
    //   clearTimeout(this.timeout);
    //   this.timeout = setTimeout(() => {
    //     this.timeout = null;
    //     this.updateWidthHeightPinch();
    //   }, 1000);
    // }
  }
  updateWidthHeightPinch() {
    // this.pinchW = this.width;
    // this.pinchH = this.height;
  }

  tapEvent(e) {
    console.log("Tap Event:- ", e);
  }

  swipeEvent(e) {
    console.log("Swipe Event:- ", e);
  }
  pressEvent(e) {
    console.log("press Event:- ", e);
  }
  doubleTapEvent(e) {
    console.log("double Tap Event:- ", e);
  }


  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad MainPage');
  //   //create gesture obj w/ ref to DOM element
  //   this.gesture = new Gesture(this.element.nativeElement);

  //   //listen for the gesture
  //   this.gesture.listen();

  //   //turn on listening for pinch or rotate events
  //   this.gesture.on('pinch', e => console.log(e));

  //   //add event listener
  //   this.gesture.on('pinch', () => console.log('pinch end event'));
  // }
}
