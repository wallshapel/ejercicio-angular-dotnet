import { Component, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroupDirective,
  FormControl,
  NgForm
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher } from '@angular/material/core';

// Custom matcher: show errors only when control is dirty OR form is submitted
class SubmitOrDirtyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = !!(form && form.submitted);
    return !!(control && control.invalid && (control.dirty || isSubmitted));
  }
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskFormComponent {
  private readonly fb = inject(FormBuilder);

  @Output() create = new EventEmitter<{ title: string }>();
  @ViewChild(FormGroupDirective) private formDir?: FormGroupDirective;

  // Reactive form with simple validation aligned to backend (max 200)
  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]]
  });

  // Error state matcher to control when errors appear
  readonly errorMatcher = new SubmitOrDirtyErrorStateMatcher();

  get title() {
    return this.form.controls.title;
  }

  // Helper for safe character count in template
  charCount(): number {
    const v = this.title.value;
    return v ? v.length : 0;
  }

  submit(): void {
    if (this.form.invalid) {
      // Trigger error display only on submit
      this.form.markAllAsTouched();
      return;
    }

    const title = this.title.value.trim();
    if (!title) return;

    this.create.emit({ title });

    // Reset form and submitted state to avoid flashing red after success
    this.formDir?.resetForm();
  }
}
