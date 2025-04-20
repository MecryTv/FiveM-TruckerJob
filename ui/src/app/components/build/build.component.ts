import { Component, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiService } from '../../services/ui.service';
import { ReturnData } from '../../interfaces/ReturnData';

@Component({
  selector: 'app-build',
  imports: [CommonModule],
  templateUrl: './build.component.html',
  styleUrl: './build.component.css',
})
export class BuildComponent {
  clientData: WritableSignal<ReturnData | null> = signal(null);

  constructor(private ui: UiService) {}

  handleGetClientData() {
    this.ui
      .fetchNui<ReturnData>('getClientData')
      .then((retData) => {
        console.log('Got return data from client scripts:');
        console.dir(retData);
        this.clientData.set(retData);
      })
      .catch((e) => {
        console.error('Setting mock data due to error', e);
        this.clientData.set({ x: 500, y: 300, z: 200 });
      });
  }
}
