import { Directive, HostListener, ElementRef, Renderer, Input } from '@angular/core';
import { ApiSvc } from '../providers/api-svc';

@Directive({
  selector: '[appConfirm]'
})
export class ConfirmDirective {
  @HostListener('click', ['$event'])
  confirmFirst(event: Event) {
    const confirmed = window.confirm('Are you sure you want to do this?');
    console.log('confirmed as', confirmed);
    return confirmed;
  }
}

@Directive({
  selector: '[chcolor]'
})

export class ChangeColorDirective {
  @Input('chcolor') highlightColor: string;
  private _defaultColor = 'black';
  constructor(private el: ElementRef, private render: Renderer, private apisvc: ApiSvc) {
    el.nativeElement.style.color = 'yellow';
  }

  @HostListener('mouseenter') methodToHandleMouseEnterAction(this) {
    this.changecolor(this.highlightColor || this._defaultColor);
  }

  @HostListener('mouseleave') methodToHandleMouseExitAction() {
    this.changecolor(null);
  }

  private changecolor(color: string) {
    this.render.setElementStyle(this.el.nativeElement, 'color', color);
    this.el.nativeElement.src = "http://whatthehello.cob";
  }
}

@Directive({
  selector: '[scrolltracker]'
})
export class ScrollTrackerDirective {


  @HostListener('scroll', ['$event'])
  onScroll(event) {
    console.log("In Tracker");
    // do tracking
    // console.log('scrolled', event.target.scrollTop);
    // Listen to click events in the component
    let tracker = event.target;

    let limit = tracker.scrollHeight - tracker.clientHeight;
    console.log(event.target.scrollTop, limit);
    if (event.target.scrollTop > (limit - 1)) {
      alert('end reached');
    }

    var parentEle = event.target.parentElement;
    var parentHeight = parentEle.clientHeight;
    var parentScrollheigth = parentEle.scrollHeight;



  }

  constructor() {
    console.log("asdf");
  }
}


@Directive({
  selector: '[ImgItemCreate]'
})
export class onItemCreateDirective {
  @Input('bgImg') bgImg: string;
  @Input('isImageOpt') isImageOptVal: string;
  
  constructor(private el: ElementRef, private render: Renderer, private apisvc: ApiSvc) {
  }

  ngOnInit() {
    let bgImg = this.bgImg || "http://wfarm1.dataknet.com/static/resources/icons/set95/5076c9d9.png";
    console.log("isImageOpt", this.isImageOptVal);
    if (bgImg && (this.isImageOptVal === "true")) {
      this.apisvc.reduceImageSize(bgImg).subscribe(data => {
        //console.log("ImageResizer Data:- ", data);
        if (data.dist)
          bgImg = data.dist;
        this.render.setElementStyle(this.el.nativeElement, 'background-image', 'url("' + bgImg + '")');
      },
        err => {
          console.log("ImageResizer Error:- ", err);
        });
    }
    else{
      this.render.setElementStyle(this.el.nativeElement, 'background-image', 'url("' + bgImg + '")');
    }
  }
} 