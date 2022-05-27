import { Component, OnInit } from '@angular/core';
import { CAROUSEL_DATA_ITEMS } from 'src/app/constants/carousel.const';
import { CarouselItem } from 'src/app/models/CarouselItem';

@Component({
  selector: 'app-download-desktop',
  templateUrl: './download-desktop.page.html',
  styleUrls: ['./download-desktop.page.scss'],
})
export class DownloadDesktopPage implements OnInit {

  public carouselData: CarouselItem[] = CAROUSEL_DATA_ITEMS;

  constructor() { }

  ngOnInit() {
  }

}
