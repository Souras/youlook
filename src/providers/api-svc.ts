import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { api, msg } from '../app/app.configuration';
import { AlertController, LoadingController } from 'ionic-angular';
declare var YUI: any;
/*
  Generated class for the ApiSvc provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/


@Injectable()
export class ApiSvc {
  data: any = null;
  loader: any = null;

  constructor(public http: Http, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {

  }


  load() {
    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      this.http.get('path/to/data.json')
        .map(res => res.json())
        .subscribe(
        data => {
          this.data = data;
          resolve(this.data);
        },
        err => {
          this.data = err;
        }

        );
    });
  }


  getData(svcPath, isLoaderShow, isMultiCall) {
    if (isLoaderShow && this.loader == null) {
      this.loader = this.loadingCtrl.create({
        content: "Get Please wait..."
      });
      this.loader.present();
    }
    return this.http.get(svcPath)
      .map(
      res => res.json(),
      isLoaderShow ? isMultiCall ? "" : this.loader.dismiss() : ""
      );
  }


  postData(svcName, parameters) {
    this.loader = null;
    this.loader = this.loadingCtrl.create({
      content: "Getting data Please wait..."
    });
    this.loader.present();

    let headers = new Headers({
      'Content-Type': 'application/json', //application/x-www-form-urlencoded
      'Accept': 'application/json' //application/x-www-form-urlencoded
    }); // ... Set content type to JSON
    let options = new RequestOptions({ headers: headers }); // Cre
    return this.http.post(api.base + api[svcName], parameters, options).map(
      res => res.json(),
      this.loader.dismiss()
    )
  }

  failure(err) {
    //this.loader.dismiss();
    console.error("Server Failed:-", err);
    if (err.status != "200") {
      console.log("Service Failed With:- ", err.status);
      // this.showAlert("Error" + err.status, "Service Not Found");
    }

    if (err.statusText.toUpperCase() === 'TIMEOUT') {
      this.showAlert("", msg.svcFailed.timeOut);
      msg.svcFailedMsg = msg.svcFailed.timeOut;
    }
    else
      if (err.statusText.toUpperCase() === "NOT FOUND") {
        this.showAlert("", msg.svcFailed.notFound);
        msg.svcFailedMsg = msg.svcFailed.notFound;
      }
      else
        if (err.statusText.toUpperCase() == "PARSERERROR") {
          this.showAlert("", msg.svcFailed.parserError);
          msg.svcFailedMsg = msg.svcFailed.parserError;
        }
        else
          if (err.statusText.toUpperCase() == "ABORT") {
            this.showAlert("", msg.svcFailed.abort);
            msg.svcFailedMsg = msg.svcFailed.abort;
          }
          else
            if (err.statusText.toUpperCase() == "ERROR") {
              this.showAlert("", msg.svcFailed.error);
              msg.svcFailedMsg = msg.svcFailed.error;
            }
            else
              if (err.statusText.toUpperCase() == "INTERNAL SERVER ERROR") {
                this.showAlert("", msg.svcFailed.internalServerError);
                msg.svcFailedMsg = msg.svcFailed.internalServerError;
              }
              else
                if (err.statusText.toUpperCase() == "BAD REQUEST") {
                  this.showAlert("", msg.svcFailed.badRequest);
                  msg.svcFailedMsg = msg.svcFailed.badRequest;
                }
                else {
                  this.showAlert("", msg.svcFailed.other);
                  msg.svcFailedMsg = msg.svcFailed.other;
                }
  }


  showAlert(title, subTitle) {
    let alert = this.alertCtrl.create({
      title: '<ion-icon ios="ios-alert" md="md-alert"></ion-icon>' + title,
      subTitle: "",
      message: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Loading ll Please wait...",
      duration: 3000
    });
    loader.present();
  }
  connectionHandle() {
    this.showAlert('No Internet', 'Please check your internet connection!');
  }

  getFeed(obj, searchTerm, startIndex, endIndex) {
    console.log("startIndex " + startIndex + " endIndex " + endIndex + " obj:- ", obj);
    var YUIFeedUrl = null;
    if ((obj.name).toUpperCase() != "HOME") {
      //var YUIFeedUrl = "http://query.yahooapis.com/v1/public/yql?format=json&q=select * from rss(" + startIndex + "," + endIndex + ") where url = '" + obj.url + "'";
      YUIFeedUrl = "http://query.yahooapis.com/v1/public/yql?format=json&q=select * from rss where url = '" + obj.url + "'| sort(field='pubDate', descending='true')";
    } else {
      YUIFeedUrl = obj.url;
    }

    console.log("YUIFeedUrl:- " + YUIFeedUrl);
    return this.http.get(YUIFeedUrl)
      .map(
      res => this.mapingSitesFeed(res.json(), searchTerm, obj),

    );
  }

  mapingSitesFeed(resObj, searchTerm, obj) {
    if (resObj.query.results) {
      let itemsObj;
      if (resObj.query.results.item.length) {
        itemsObj = resObj.query.results.item;
      }
      else {
        let tempObj = [];
        tempObj.push(resObj.query.results.item);
        itemsObj = tempObj;
      }
      console.log("res length:- " + resObj.query.count + " raw res:-", resObj);
      let filterObj = this.filterItems(searchTerm, itemsObj, obj);
      console.log("filterObj:- ", filterObj);
      return filterObj;
    } else
      return false;
  }

  filterItems(searchTerm, itemsObj, obj) {
    return itemsObj.filter((item) => {
      item.siteName = obj.name;
      item.isImgOpt = obj.imageOptimization;
      //*******To manage Author
      item.author = (item.author || item.creator || "").substring(0, 10);

      //*******To manage Author
      item.dateTime = item.updated || item.pubDate || "";

      //*******To manage the cover Image
      let $div = document.createElement("div");
      $div.innerHTML = item.description;
      if (!item.coverImg) {
        let imgs = $div.getElementsByTagName("img");
        // console.log("imgs:-", imgs);
        item.imgs = imgs;
        // console.log("Imgs:-", imgs);
        if (imgs[0]) {
          item.coverImg = imgs[0].src;
          item.isCoverImg = true;
        }
        else {
          // item.coverImg = "../../assets/img/default-title.png";
          item.coverImg = "";
          item.isCoverImg = false
        }

        //To remove all images form description   
        var imgsLenght = imgs.length;
        for (var i = 0; i < imgsLenght; i++) {
          if (typeof imgs[0] != "undefined")
            imgs[0].remove();
        }
      }

      if (item.thumbnail && !item.coverImg) {
        if (item.thumbnail.url) {
          item.coverImg = item.thumbnail.url;
          item.isCoverImg = true;
        }
      }

      //this.removeTags($div, ["br"])
      item.description = $div.innerHTML;
      //item.shortDescription = $div.textContent.substring(0, 160);
      item.shortDescription = this.limitToCountWords($div.textContent.trim(), 25);
      return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
  limitToCountWords(str, wordsCount) {
    var strArr = str.split(" ");
    var combineStr = "";
    var len = strArr.length > wordsCount ? wordsCount : strArr.length;
    for (var i = 0; i < len; i++) {
      combineStr += " " + strArr[i];
    }
    return combineStr + "...";
  }
  //to remove unwanted tags or elements from html string. ele must be array i.e ['br', b]
  removeTags(containerEle, ele) {
    for (var j = 0; j < ele.length; j++) {
      // let $ele = document.createElement("div");
      // $ele.innerHTML = htmkString;
      // var tags = $ele.getElementsByTagName(ele[j]);
      var tags = containerEle.getElementsByTagName(ele[j]);
      var tagsLength = tags.length;
      for (var i = 0; i < tagsLength; i++) {
        if (typeof tags[0] != "undefined")
          tags[0].remove();
      }
    }
  }

  get_filesize(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, true); // Notice "HEAD" instead of "GET",
    //  to get only the header
    xhr.onreadystatechange = function () {
      if (this.readyState == this.DONE) {
        callback(parseInt(xhr.getResponseHeader("Content-Length")));
      }
    };
    xhr.send();
  }

  reduceImageSize(imgUrl) {
    return this.http.get("http://api.resmush.it/ws.php?img=" + imgUrl + "&qlty=50").map(
      res => res.json()
    );
  }


}
