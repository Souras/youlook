import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Slides } from 'ionic-angular';

@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html'
})
export class Page2 {
  @ViewChild(Slides) slides: Slides;

  selectedItem: any;
  currentItemIndex: number;
  totalItems: any;
  itemsLength: string;
  icons: string[];
  items: Array<{ title: string, note: string, icon: string }>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('currentItem');
    this.currentItemIndex = navParams.get('itemIndex');
    this.totalItems = navParams.get('totalItem');
    this.itemsLength = (this.totalItems.length * 180).toString() + "px";

    console.log("Page2>Total Item", this.totalItems);


    //   // Let's populate this page with some filler content for funzies
    //   this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    //   'american-football', 'boat', 'bluetooth', 'build'];

    //   this.items = [];
    //   for (let i = 1; i < 11; i++) {
    //     this.items.push({
    //       title: 'Item ' + i,
    //       note: 'This is item #' + i,
    //       icon: this.icons[Math.floor(Math.random() * this.icons.length)]
    //     });
    //   }
    // }

    // itemTapped(event, item) {
    //   // That's right, we're pushing to ourselves!
    //   this.navCtrl.push(Page2, {
    //     item: item
    //   });
  }

  goToDetails(item, index) {
    console.info("Second Page Item:- ", item);
    //his.navCtrl.push(Page2, { currentItem: item, itemIndex: index, totalItem: this.totalItems });
    this.slides.slideTo(index, 500);
  }
  ionViewDidEnter() {
    this.slides.slideTo(this.currentItemIndex, 1000);
    var ele = document.getElementById("relativePostContainer2").getElementsByClassName("scroll-content")[0];
    console.log("Relative Items:- ", ele);
    ele.scrollLeft = 220 * this.currentItemIndex;
  }
}
