import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NuiService {
  private visible = new BehaviorSubject<boolean>(false);
  public visible$ = this.visible.asObservable();

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', this.onMessageReceived.bind(this));
    }
  }

  private onMessageReceived(event: MessageEvent) {
    const data = event.data;

    if (data.type === 'ui') {
      this.visible.next(data.status);
    }
  }

  public closeUI() {
    this.visible.next(false);
    this.postMessage('close', {});
  }

  public sendAction(action: string, data: any = {}) {
    this.postMessage('action', { action, ...data });
  }

  private postMessage(event: string, data: any = {}) {
    if (typeof window !== 'undefined') {
      this.http
        .post(`https://TruckerJob/${event}`, {
          ...data,
        })
        .subscribe();
    }
  }
}
