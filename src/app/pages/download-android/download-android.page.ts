import { Component, OnInit } from '@angular/core';
import { CAROUSEL_DATA_ITEMS } from 'src/app/constants/carousel.const';
import { CarouselItem } from 'src/app/models/CarouselItem';

@Component({
  selector: 'app-download-android',
  templateUrl: './download-android.page.html',
  styleUrls: ['./download-android.page.scss'],
})
export class DownloadAndroidPage implements OnInit {

  public carouselData: CarouselItem[] = CAROUSEL_DATA_ITEMS;

  constructor() { }

  ngOnInit() {
  }

}
