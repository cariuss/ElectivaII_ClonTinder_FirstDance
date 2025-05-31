import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User, UserPreferences, UserLocation } from '../../../shared/models/user';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseApiResponse } from '../../../shared/models/base.api.response';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;

  // URLs de las fotos extras para el carrusel
  additionalPhotoUrls: string[] = [];

  // Archivos seleccionados para subir adicionales
  additionalPhotosFiles: File[] = [];

  // Archivos seleccionados para subir foto de perfil
  profilePhotoFile: File | null = null;

  // Mensajes e indicadores
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading: boolean = false;

  // Flag para mostrar/ocultar modal de perfil
  showProfilePhotoModal: boolean = false;

  // Referencia al input file oculto para fotos adicionales
  @ViewChild('additionalPhotosInput') additionalPhotosInputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.profileForm = this.fb.group({
      // Información Básica
      name: ['', Validators.required],
      age: [0, [Validators.required, Validators.min(18), Validators.max(100)]],
      gender: ['', Validators.required],
      bio: ['', [Validators.required, Validators.maxLength(500)]],

      // Preferencias de Búsqueda
      minAge: [0, [Validators.required, Validators.min(18)]],
      maxAge: [0, [Validators.required, Validators.min(18)]],
      interestedInGender: ['', Validators.required],
      maxDistance: [0, [Validators.required, Validators.min(1)]],

      // Ubicación
      city: ['', Validators.required],
      country: ['', Validators.required],

      // Preview de foto de perfil
      profilePhotoUrl: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.userService.getMe().subscribe({
      next: (userRes: BaseApiResponse<User>) => {
        this.currentUser = userRes.data!;
        // Patch de la información básica y preview
        this.profileForm.patchValue({
          name: userRes.data?.name,
          age: userRes.data?.age,
          gender: userRes.data?.gender,
          bio: userRes.data?.bio,
          minAge: userRes.data?.preferences?.minAge,
          maxAge: userRes.data?.preferences?.maxAge,
          interestedInGender: userRes.data?.preferences?.interestedInGender,
          maxDistance: userRes.data?.preferences?.maxDistance,
          city: userRes.data?.location?.city,
          country: userRes.data?.location?.country,
          profilePhotoUrl: userRes.data?.profilePhoto
        });
        // Carga del array de URLs de fotos extras (para el carrusel)
        this.additionalPhotoUrls = Array.isArray(userRes.data?.additionalPhotos)
          ? [...userRes.data.additionalPhotos!]
          : [];
        this.isLoading = false;
        this.successMessage = null;
        this.errorMessage = null;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar el perfil:', err);
        this.errorMessage = 'No se pudo cargar el perfil. Por favor, inténtalo de nuevo.';
        this.isLoading = false;
      }
    });
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
        next: (resp) => {
          this.currentUser = resp.data!;
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

  // ---------------------------
  // Métodos para abrir/cerrar modal foto de perfil
  openProfilePhotoModal(): void {
    this.showProfilePhotoModal = true;
    this.successMessage = this.errorMessage = null;
    this.profilePhotoFile = null;
  }

  closeProfilePhotoModal(): void {
    this.showProfilePhotoModal = false;
  }

  // ---------------------------
  // Lógica para selección de archivo y subida (perfil)
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

  onUploadProfilePhoto(): void {
    if (!this.profilePhotoFile) return;
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.userService.uploadProfilePhoto(this.profilePhotoFile).subscribe({
      next: () => {
        this.successMessage = 'Foto de perfil actualizada exitosamente.';
        this.profilePhotoFile = null;
        this.loadProfile();
        this.closeProfilePhotoModal();
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al subir la foto de perfil:', err);
        this.errorMessage = err.error?.message || 'Error al subir la foto de perfil.';
        this.isLoading = false;
      }
    });
  }

  // ---------------------------
  // Lógica para acumulación y subida de archivos (fotos adicionales)
  triggerAdditionalPhotosInput(): void {
    this.additionalPhotosInputRef.nativeElement.value = '';
    this.additionalPhotosInputRef.nativeElement.click();
  }

  onAdditionalPhotosSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // Convertimos FileList a Array<File>
      const nuevos: File[] = Array.from(input.files);
      // Concatenamos los nuevos archivos con los que ya existían en la lista
      this.additionalPhotosFiles = this.additionalPhotosFiles.concat(nuevos);
      // Llamamos a la función que sube todos en un solo request
      this.uploadAdditionalPhotos();
    }
  }

  uploadAdditionalPhotos(): void {
    if (this.additionalPhotosFiles.length === 0) return;
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    // Aquí se asume que userService.uploadAdditionalPhotos acepta un arreglo de File[]
    this.userService.uploadAdditionalPhotos(this.additionalPhotosFiles).subscribe({
      next: () => {
        this.successMessage = 'Fotos adicionales subidas exitosamente.';
        // Limpiamos el arreglo local para nuevas selecciones
        this.additionalPhotosFiles = [];
        // Recargamos el perfil para obtener las URLs actualizadas del servidor
        this.loadProfile();
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al subir fotos adicionales:', err);
        this.errorMessage = err.error?.message || 'Error al subir fotos adicionales.';
        this.isLoading = false;
      }
    });
  }
}
