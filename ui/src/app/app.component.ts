import { Component, OnInit, OnDestroy } from '@angular/core';
import { NuiService } from './services/nui.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ui';

  visible = false;
  private destroy$ = new Subject<void>();

  constructor(private nuiService: NuiService) {}

  ngOnInit() {
    this.nuiService.visible$
      .pipe(takeUntil(this.destroy$))
      .subscribe((visible) => {
        this.visible = visible;
      });
  }

  closeUI() {
    this.nuiService.closeUI();
  }

  executeAction(action: string) {
    this.nuiService.sendAction(action);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
