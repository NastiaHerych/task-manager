import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ImportService } from 'src/app/shared/services/import.service';
import { TasksService } from 'src/app/shared/services/tasks.service';

@Component({
  selector: 'app-import-modal',
  templateUrl: './import-modal.component.html',
  styleUrls: ['./import-modal.component.scss'],
})
export class ImportModalComponent {
  isImportModalOpen = false;
  fileSelected = false;
  selectedFile: File | null = null;
  tasks: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<ImportModalComponent>,
    private importService: ImportService,
    private spinner: NgxSpinnerService
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  // Handle file selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileSelected = true;
    }
  }

  // Import tasks to backend
  importTasks() {
    if (!this.selectedFile) return;
    this.spinner.show();
    this.importService.importTasks(this.selectedFile).subscribe(
      (response: any) => {
        if (response.success) {
          this.tasks = response.tasks;
        } else {
          alert('Failed to import tasks');
        }
        this.spinner.hide();
        this.onCancel();
      },
      (error) => {
        console.error('Error importing tasks:', error);
        this.spinner.hide();
      }
    );
  }
}
