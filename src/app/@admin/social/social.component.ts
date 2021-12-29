import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { SocialService } from 'src/app/@servicios/admin/social.service';
import { closeAlert, loadData } from 'src/app/function/cargando';
import { ToastSuccess } from 'src/app/function/validarpost';
import { ResultModelo } from 'src/app/interface/modelo.interface';
import { ResultSocial, ResultSocialInd, Social } from 'src/app/interface/social.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css']
})
export class SocialComponent implements OnInit {
  listSocial: Social[] = [];
  titulo: string = 'Crear';
  id: string = '';
  cargar?: boolean = true;
  unblock: boolean = true;
  socialForm: FormGroup;
  imgdefault: string = "https://res.cloudinary.com/dertftoym/image/upload/v1638987062/no-image_tvywlm.jpg";
  imagenPri?: string;
  uploadFiles?: File;
  @ViewChild('fileInput', { static: false }) fileInput?: ElementRef;
  constructor(private fb: FormBuilder, private socialService: SocialService, private sanitizer: DomSanitizer) { 
    this.socialForm = this.fb.group({
      title: ['', Validators.required],
      enlace: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.mostrarSocial();
  }
  mostrarSocial() {
    if (this.cargar) {
      loadData('Cargando', 'Espere mientras carga la informacion')
    }
    this.socialService.getSocials(this.unblock).subscribe(
      (data: ResultSocial) => {
        this.listSocial = data.social;
        if (this.cargar) {
          closeAlert();
        }
        this.cargar = false;
      }
    )
  }
  crearEditarSocial(){
    if (this.id === '') {
      const data = new FormData();
      data.append('title', this.socialForm.get('title')?.value);
      data.append('enlace', this.socialForm.get('enlace')?.value);
      this.socialService.postSocial(data).subscribe(
        (data: ResultSocialInd) => {
          ToastSuccess('success', data.msg);
          this.socialForm.setValue({
            title: '',
            enlace: '',
          });
          this.mostrarSocial();
        },
        (error) => {
          console.log(error);
          ToastSuccess('warning', error.error.errors[0].msg.toLowerCase())
        }
      )
    }
    if (this.id !== '') {
      const data = new FormData();
      data.append('title', this.socialForm.get('title')?.value);
      data.append('enlace', this.socialForm.get('enlace')?.value);
      this.socialService.putSocial(data, this.id).subscribe(
        (data: ResultSocialInd) => {
          ToastSuccess('success', data.msg);
          this.mostrarSocial();
        },
        (error) => {
          console.log(error);
          ToastSuccess('warning', error.error.errors[0].msg.toLowerCase())
        })
    }
  }
  capturarFile(event:any){
    this.uploadFiles = event.target.files[0];
    if (this.uploadFiles!.size > 4072383) {
      ToastSuccess('warning', 'El tamaño maximo es de 4MB, Archivo excede lo estimado');
    } else {
      this.extraserBase64(this.uploadFiles).then((imagen: any) => {
        this.imagenPri = imagen.base;
        if (this.id !== undefined) {
          console.log('hola');
          const formData = new FormData();
          const imageBlob = this.fileInput!.nativeElement.files[0];
          formData.set('archivo',imageBlob);
          this.cargar =true
          if (this.cargar) {
            loadData('Cargando', 'Espere mientras carga la imagen a la base de datos')
          }
          this.socialService.putImagen( this.id, formData).subscribe(
            (data:ResultModelo)=>{
              if (this.cargar) {
                closeAlert();
              }
              this.cargar = false;
              if (!data.ok) {
                ToastSuccess('warning', data.msg);
                
              }
              else{
                ToastSuccess('success', data.msg)
                this.mostrarSocial();
              }
          }, error=>{
            console.log(error);
            
          });
        }
      });
    }
  }
  verImagen(ids:any){
    this.id = ids;
    this.socialService.getSocial(ids).subscribe(
      (data: ResultSocialInd) => {
        if (!data.social.img) {
          this.imagenPri = "https://res.cloudinary.com/dertftoym/image/upload/v1638987062/no-image_tvywlm.jpg"
        } else {
          this.imagenPri = data.social.img
        }
        this.titulo = 'Editar'
      },
      (error) => {
        console.log(error);
      }
    )
  }
  editarSocial(ids:any){
    this.id = ids;
    this.socialService.getSocial(ids).subscribe(
      (data: ResultSocialInd) => {

        this.socialForm.setValue({
          title: data.social.title,
          enlace: data.social.enlace,
        })

        this.titulo = 'Editar'
      },
      (error) => {
        console.log(error);

      }
    )
  }
  borrarSocial(ids:any, unblock:boolean){
    Swal.fire({
      title: 'Estas seguro?',
      text: unblock ? 'Este social sera desbloqueado!!!' :'Este social sera bloqueado!!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: unblock ? 'Si, desbloquear!' :'Si, bloquear!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.socialService.deleteSocial(ids, unblock).subscribe(
          (data: ResultSocialInd)=>{
            this.mostrarSocial();
            Swal.fire(
              unblock ? 'Desbloqueado' : 'Bloqueado',
              data.msg,
              'success'
            )
          },
          (error)=>{
            console.log(error);
            
          }
        )
        
      }
    }) 
  }
  extraserBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        })
      };
      reader.onerror = error => {
        resolve({
          base: null
        })
      }
    } catch (e) {
      reject(e)
    }
  });
  ShowSelected($event: any) {
    if ($event.target.value === '1') {
      this.unblock = true;
      this.cargar = true;
      this.mostrarSocial();
    }
    if ($event.target.value === '2') {
      this.unblock = false;
      this.cargar = true;
      this.mostrarSocial();
    }
  }

  cancelar() {
    this.id = '',
    this.titulo = 'Crear';
    this.imagenPri = '';
    this.socialForm.setValue({
      title: '',
      enlace: '',
    });
    //this.mostrarUsuario();
  }
}
