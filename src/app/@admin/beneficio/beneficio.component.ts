import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BeneficioService } from 'src/app/@servicios/admin/beneficio.service';
import { closeAlert, loadData } from 'src/app/function/cargando';
import { ToastSuccess } from 'src/app/function/validarpost';
import { ResultModelo } from 'src/app/interface/modelo.interface';
import Swal from 'sweetalert2';
import { Beneficio, ResultBeneficio, ResultBeneficioInd } from '../../interface/beneficio.interface';

@Component({
  selector: 'app-beneficio',
  templateUrl: './beneficio.component.html',
  styleUrls: ['./beneficio.component.css']
})
export class BeneficioComponent implements OnInit {
  listBeneficio: Beneficio[] = [];
  titulo: string = 'Crear';
  id: string = '';
  cargar?: boolean = true;
  unblock: boolean = true;
  beneficioForm: FormGroup;
  imgdefault: string = "https://res.cloudinary.com/dertftoym/image/upload/v1638987062/no-image_tvywlm.jpg";
  imagenPri?: string;
  uploadFiles?: File;
  @ViewChild('fileInput', { static: false }) fileInput?: ElementRef;
  constructor(private fb: FormBuilder, private beneficioService: BeneficioService, private sanitizer: DomSanitizer) { 
    this.beneficioForm = this.fb.group({
      title: ['', Validators.required],
      descripcion: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.mostrarBeneficio();
  }
  mostrarBeneficio() {
    if (this.cargar) {
      loadData('Cargando', 'Espere mientras carga la informacion')
    }
    this.beneficioService.getBeneficios(this.unblock).subscribe(
      (data: ResultBeneficio) => {
        this.listBeneficio = data.beneficio;
        if (this.cargar) {
          closeAlert();
        }
        this.cargar = false;
      }
    )
  }
  crearEditarBeneficio(){
    if (this.id === '') {
      const data = new FormData();
      data.append('title', this.beneficioForm.get('title')?.value);
      data.append('descripcion', this.beneficioForm.get('descripcion')?.value);
      this.beneficioService.postBeneficio(data).subscribe(
        (data: ResultBeneficioInd) => {
          ToastSuccess('success', data.msg);
          this.beneficioForm.setValue({
            title: '',
            descripcion: '',
          });
          this.mostrarBeneficio();
        },
        (error) => {
          console.log(error);
          ToastSuccess('warning', error.error.errors[0].msg.toLowerCase())
        }
      )
    }
    if (this.id !== '') {
      const data = new FormData();
      data.append('title', this.beneficioForm.get('title')?.value);
      data.append('descripcion', this.beneficioForm.get('descripcion')?.value);
      this.beneficioService.putBeneficio(data, this.id).subscribe(
        (data: ResultBeneficioInd) => {
          ToastSuccess('success', data.msg);
          this.mostrarBeneficio();
        },
        (error) => {
          console.log(error);
          ToastSuccess('warning', error.error.errors[0].msg.toLowerCase())
        })
    }
  }
  capturarFile(event: any) {
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
          this.beneficioService.putImagen( this.id, formData).subscribe(
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
                this.mostrarBeneficio();
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
    this.beneficioService.getBeneficio(ids).subscribe(
      (data: ResultBeneficioInd) => {

        if (!data.beneficio.img) {
          this.imagenPri = "https://res.cloudinary.com/dertftoym/image/upload/v1638987062/no-image_tvywlm.jpg"
        } else {
          this.imagenPri = data.beneficio.img
        }
        this.titulo = 'Editar'
      },
      (error) => {
        console.log(error);

      }
    )
  }
  select(ids:any, unblock:boolean){
    this.beneficioService.putSelect(ids, unblock).subscribe(
      (data:ResultModelo)=>{
        if (!data.ok) {
          ToastSuccess('error', data.msg);
          this.mostrarBeneficio();
        }
        if (data.ok) {
          ToastSuccess('success', data.msg)
          this.mostrarBeneficio();
        }
      },
      (error)=>{
        console.log(error);
        ToastSuccess('warning', error.error.errors[0].msg.toLowerCase())
      }
    )
}
  editarBeneficio(ids:any){
    this.id = ids;
    this.beneficioService.getBeneficio(ids).subscribe(
      (data: ResultBeneficioInd) => {

        this.beneficioForm.setValue({
          title: data.beneficio.title,
          descripcion: data.beneficio.descripcion,
        })

        this.titulo = 'Editar'
      },
      (error) => {
        console.log(error);

      }
    )
  }
  borrarBeneficio(ids:any, unblock:boolean){
    Swal.fire({
      title: 'Estas seguro?',
      text: unblock ? 'Este beneficio sera desbloqueado!!!' :'Este beneficio sera bloqueado!!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: unblock ? 'Si, desbloquear!' :'Si, bloquear!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.beneficioService.deleteBeneficio(ids, unblock).subscribe(
          (data: ResultBeneficioInd)=>{
            this.mostrarBeneficio();
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
      this.mostrarBeneficio();
    }
    if ($event.target.value === '2') {
      this.unblock = false;
      this.cargar = true;
      this.mostrarBeneficio();
    }
  }
  cancelar() {
    this.id = '',
    this.titulo = 'Crear';
    this.imagenPri = '';
    this.beneficioForm.setValue({
      title: '',
      descripcion: '',
    });
    //this.mostrarUsuario();
  }
}
