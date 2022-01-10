import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import videojs from 'video.js';
@Component({
  selector: 'app-vjs-player',
  templateUrl: './vjs-player.component.html',
  styleUrls: ['./vjs-player.component.css'],

  encapsulation: ViewEncapsulation.None,
})
export class VjsPlayerComponent implements OnInit {


  @ViewChild('target', { static: true })
  target!: ElementRef;

  @Input()
  options!: {
    fluid: boolean;
    aspectRatio: string;
    autoplay: boolean;
    breakpoints: {
      tiny: 300,
      xsmall: 400,
      small: 500,
      medium: 600,
      large: 700,
      xlarge: 800,
      huge: 900
    }
    sources: {
      src: string;
      type: string;
    }[];
  } | object;
  player!: videojs.Player;

  ngOnInit() {
    // instantiate Video.js
    this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady() {
      // console.log('onPlayerReady', this);
    });   
  }

  ngOnDestroy() {
    // destroy player
    if (this.player) {
      this.player.dispose();
    }
  }



}