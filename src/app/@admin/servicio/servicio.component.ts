import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicioService } from 'src/app/@servicios/admin/servicio.service';
import { closeAlert, loadData } from 'src/app/function/cargando';
import { ToastSuccess } from 'src/app/function/validarpost';
import { ResultServiceInd, Servicio } from 'src/app/interface/servicio.interface';
import Swal from 'sweetalert2';
import { ResultService } from '../../interface/servicio.interface';
import { ResultModelo } from '../../interface/modelo.interface';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent implements OnInit {
  listServicio: Servicio[] = [];
  titulo: string = 'Crear';
  id: string = '';
  cargar?: boolean = true;
  unblock: boolean = true;
  servicioForm: FormGroup;
  imgdefault: string = "https://res.cloudinary.com/dertftoym/image/upload/v1638987062/no-image_tvywlm.jpg";
  imagenPri?: string;
  imagenLogo?: string;
  uploadFilesLogo?: File;
  uploadFilesPri?: File;
  @ViewChild('fileInputLogo', { static: false }) fileInputLogo?: ElementRef;
  @ViewChild('fileInputPri', { static: false }) fileInputPri?: ElementRef;
  constructor(private fb: FormBuilder, private servicioService: ServicioService,private sanitizer: DomSanitizer) {
    this.servicioForm = this.fb.group({
      title: ['', Validators.required],
      descripcion: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.mostrarServicio();
  }
  mostrarServicio() {
    if (this.cargar) {
      loadData('Cargando', 'Espere mientras carga la informacion')
    }
    this.servicioService.getServicios(this.unblock).subscribe(
      (data: ResultService) => {
        this.listServicio = data.servicio;
        if (this.cargar) {
          closeAlert();
        }
        this.cargar = false;
      }
    )
  }
  crearEditarServicio(){
    if (this.id === '') {
      const data = new FormData();
      data.append('title', this.servicioForm.get('title')?.value);
      data.append('descripcion', this.servicioForm.get('descripcion')?.value);
      this.servicioService.postServicio(data).subscribe(
        (data: ResultServiceInd) => {
          ToastSuccess('success', data.msg);
          this.servicioForm.setValue({
            title: '',
            descripcion: '',
          });
          this.mostrarServicio();
        },
        (error) => {
          console.log(error);
          ToastSuccess('warning', error.error.errors[0].msg.toLowerCase())
        }
      );
    }
    if (this.id !== '') {
      const data = new FormData();
      data.append('title', this.servicioForm.get('title')?.value);
      data.append('descripcion', this.servicioForm.get('descripcion')?.value);
      this.servicioService.putServicio(data, this.id).subscribe(
        (data: ResultServiceInd) => {
          ToastSuccess('success', data.msg);
          this.mostrarServicio();
        },
        (error) => {
          console.log(error);
          ToastSuccess('warning', error.error.errors[0].msg.toLowerCase())
        });
    }
  }
  capturarFileLogo(event:any){
    this.uploadFilesLogo = event.target.files[0];
    if (this.uploadFilesLogo!.size > 4072383) {
      ToastSuccess('warning', 'El tamaño maximo es de 4MB, Archivo excede lo estimado');
    } else {
      this.extraserBase64(this.uploadFilesLogo).then((imagen: any) => {
        this.imagenLogo = imagen.base;
        if (this.id !== undefined) {
          console.log('hola');
          const formData = new FormData();
          const imageBlob = this.fileInputLogo!.nativeElement.files[0];
          formData.set('archivo',imageBlob);
          this.cargar =true
          if (this.cargar) {
            loadData('Cargando', 'Espere mientras carga la imagen a la base de datos')
          }
          this.servicioService.putImagen( this.id, formData,'logo').subscribe(
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
                this.mostrarServicio();
              }
          }, error=>{
            console.log(error);
            
          });
        }
      });
    }
  }
  capturarFilePri(event:any){
    this.uploadFilesPri = event.target.files[0];
    if (this.uploadFilesPri!.size > 4072383) {
      ToastSuccess('warning', 'El tamaño maximo es de 4MB, Archivo excede lo estimado');
    } else {
      this.extraserBase64(this.uploadFilesPri).then((imagen: any) => {
        this.imagenPri = imagen.base;
        if (this.id !== undefined) {
          const formData = new FormData();
          const imageBlob = this.fileInputPri!.nativeElement.files[0];
          formData.set('archivo',imageBlob);
          this.cargar =true
          if (this.cargar) {
            loadData('Cargando', 'Espere mientras carga la imagen a la base de datos')
          }
          this.servicioService.putImagen(this.id, formData,'principal').subscribe(
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
                this.mostrarServicio();
              }
          }, error=>{
            console.log(error);
          });
        }
      });
    }
  }
  editarImagen(ids:any){
    this.id = ids;
    this.servicioService.getServicio(ids).subscribe(
      (data: ResultServiceInd) => {

        if (!data.servicio.img) {
          this.imagenPri = "https://res.cloudinary.com/dertftoym/image/upload/v1638987062/no-image_tvywlm.jpg"
        }
        if (!data.servicio.logo) {
          this.imagenLogo =  "https://res.cloudinary.com/dertftoym/image/upload/v1638987062/no-image_tvywlm.jpg"
        }
        if (data.servicio.img) {
          this.imagenPri = data.servicio.img
        }
        if (data.servicio.logo) {
          this.imagenLogo = data.servicio.logo
        }
        this.titulo = 'Editar'
      },
      (error) => {
        console.log(error);

      }
    )
  }
  
  select(ids:any, unblock:boolean){
    this.servicioService.putSelect(ids, unblock).subscribe(
      (data:ResultModelo)=>{
        if (!data.ok) {
          ToastSuccess('error', data.msg);
          this.mostrarServicio();
        }
        if (data.ok) {
          ToastSuccess('success', data.msg)
          this.mostrarServicio();
        }
      },
      (error)=>{
        console.log(error);
        ToastSuccess('warning', error.error.errors[0].msg.toLowerCase())
      }
    )
}
  editarServicio(ids:any){
    this.id = ids;
    this.servicioService.getServicio(ids).subscribe(
      (data: ResultServiceInd) => {
        this.servicioForm.setValue({
          title: data.servicio.title,
          descripcion: data.servicio.descripcion,
        });
        this.titulo = 'Editar'
      },
      (error) => {
        console.log(error);
      }
    )
  }
  borrarServicio(ids:any, unblock:boolean){
    Swal.fire({
      title: 'Estas seguro?',
      text: unblock ? 'Este servicio sera desbloqueado!!!' :'Este servicio sera bloqueado!!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: unblock ? 'Si, desbloquear!' :'Si, bloquear!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicioService.deleteServicio(ids, unblock).subscribe(
          (data: ResultServiceInd)=>{
            this.mostrarServicio();
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
      this.mostrarServicio();
    }
    if ($event.target.value === '2') {
      this.unblock = false;
      this.cargar = true;
      this.mostrarServicio();
    }
  }
  cancelar() {
    this.id = '',
    this.titulo = 'Crear';
    this.imagenLogo = '';
    this.imagenPri='';
    this.servicioForm.setValue({
      title: '',
      descripcion: '',
    });
    //this.mostrarUsuario();
  }
}
