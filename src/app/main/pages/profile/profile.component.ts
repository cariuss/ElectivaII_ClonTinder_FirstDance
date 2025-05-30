import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User, UserPreferences, UserLocation } from '../../../shared/models/user';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BaseApiResponse } from '../../../shared/models/base.api.response';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;
  profilePhotoFile: File | null = null;
  additionalPhotosFiles: File[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      age: [0, [Validators.required, Validators.min(18), Validators.max(100)]],
      gender: ['', Validators.required],
      bio: ['', [Validators.required, Validators.maxLength(500)]],

      minAge: [0, [Validators.required, Validators.min(18)]],
      maxAge: [0, [Validators.required, Validators.min(18)]],
      interestedInGender: ['', Validators.required],
      maxDistance: [0, [Validators.required, Validators.min(1)]],

      city: ['', Validators.required],
      country: ['', Validators.required],
      profilePhotoUrl: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.userService.getMe().subscribe({
      next: (user: BaseApiResponse<User>) => {
        this.currentUser = user.data!;
        this.profileForm.patchValue({
          name: user.data?.name,
          age: user.data?.age,
          gender: user.data?.gender,
          bio: user.data?.bio,
          minAge: user.data?.preferences?.minAge,
          maxAge: user.data?.preferences?.maxAge,
          interestedInGender: user.data?.preferences?.interestedInGender,
          maxDistance: user.data?.preferences?.maxDistance,
          city: user.data?.location?.city,
          country: user.data?.location?.country,
          profilePhotoUrl: user.data?.profilePhoto
        });
        this.isLoading = false;
        this.successMessage = null;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar el perfil:', err);
        this.errorMessage = 'No se pudo cargar el perfil. Por favor, inténtalo de nuevo.';
        this.isLoading = false;
      }
    });
  }

  onProfilePhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profilePhotoFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.profileForm.patchValue({ profilePhotoUrl: reader.result });
      };
      reader.readAsDataURL(this.profilePhotoFile);
    } else {
      this.profilePhotoFile = null;
    }
  }

  onAdditionalPhotosSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.additionalPhotosFiles = Array.from(input.files);
    } else {
      this.additionalPhotosFiles = [];
    }
  }

  onSubmitProfile(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;

      const formValues = this.profileForm.value;

      const updatedUser: Partial<User> = {
        name: formValues.name,
        age: formValues.age,
        gender: formValues.gender,
        bio: formValues.bio,
        preferences: {
          minAge: formValues.minAge,
          maxAge: formValues.maxAge,
          interestedInGender: formValues.interestedInGender,
          maxDistance: formValues.maxDistance,
        } as UserPreferences,
        location: {
          city: formValues.city,
          country: formValues.country,
        } as UserLocation,

      };

      this.userService.updateProfile(updatedUser).subscribe({
        next: (response) => {
          this.currentUser = response.data!;
          this.successMessage = 'Perfil actualizado exitosamente.';
          this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al actualizar el perfil:', err);
          this.errorMessage = err.error?.message || 'Error al actualizar el perfil. Inténtalo de nuevo.';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Por favor, corrige los errores en el formulario.';

      this.profileForm.markAllAsTouched();
    }
  }

  onUploadProfilePhoto(): void {
    if (this.profilePhotoFile) {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;
      this.userService.uploadProfilePhoto(this.profilePhotoFile).subscribe({
        next: () => {
          this.successMessage = 'Foto de perfil actualizada exitosamente.';
          this.profilePhotoFile = null;
          this.loadProfile();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al subir la foto de perfil:', err);
          this.errorMessage = err.error?.message || 'Error al subir la foto de perfil.';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Por favor, selecciona una foto de perfil para subir.';
    }
  }

  onUploadAdditionalPhotos(): void {
    if (this.additionalPhotosFiles.length > 0) {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;
      this.userService.uploadAdditionalPhotos(this.additionalPhotosFiles).subscribe({
        next: () => {
          this.successMessage = 'Fotos adicionales subidas exitosamente.';
          this.additionalPhotosFiles = [];
          this.loadProfile();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al subir fotos adicionales:', err);
          this.errorMessage = err.error?.message || 'Error al subir fotos adicionales.';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Por favor, selecciona fotos adicionales para subir.';
    }
  }
}
