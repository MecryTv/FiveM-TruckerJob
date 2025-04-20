import {
  Component,
  HostListener,
  OnInit,
  WritableSignal,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuildComponent } from './components/build/build.component';
import { UiService } from './services/ui.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, BuildComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ui';

  visible: WritableSignal<boolean> = signal(false);

  constructor(private ui: UiService) {}

  ngOnInit(): void {
    // This listens for the "setVisible" message
    this.ui.fromMessageAction<boolean>('setVisible').subscribe({
      next: (value) => {
        this.visible.set(value);
      },
    });

    // This will set the NUI to visible if we are developing in browser
    this.ui.dispatchDebugMessages([
      {
        action: 'setVisible',
        data: true,
      },
    ]);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (['Backspace', 'Escape'].includes(event.code)) {
      if (!this.ui.isEnvBrowser()) this.ui.fetchNui('truckerjob:hideUI');
      this.visible.set(false);
    }
  }
}
