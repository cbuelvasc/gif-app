import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private _url: string = 'https://api.giphy.com/v1/gifs';
  private _apiKey: string = 'IqeusGqaHlJOwhc3ejLFvfjam4flgHYW';
  private _limit: string = '10';
  private _history: string[] = [];
  private _results: Gif[] = [];

  get history(): string[] {
    return [...this._history];
  }

  get results(): Gif[] {
    return [...this._results];
  }

  constructor(private http: HttpClient) {
    if (localStorage.getItem('history')) {
      this._history = JSON.parse(localStorage.getItem('history')!) || [];
      this._results = JSON.parse(localStorage.getItem('results')!) || [];
    }
  }

  searchGifs(query: string = ''): void {
    query = query.trim().toLowerCase();
    if (!this._history.includes(query)) {
      this._history.unshift(query);
      this._history = this._history.splice(0, 10);
      localStorage.setItem('history', JSON.stringify(this._history));
    }

    const params = new HttpParams()
      .set('api_key', this._apiKey)
      .set('q', query)
      .set('limit', this._limit);

    this.http
      .get<SearchGifsResponse>(`${this._url}/search`, { params })
      .subscribe((response) => {
        this._results = response.data;
        localStorage.setItem('results', JSON.stringify(this._results));
      });
  }
}
