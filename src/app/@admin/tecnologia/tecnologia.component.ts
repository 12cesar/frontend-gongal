import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tecnologia, ResultTecnologia, ResultTecnologiaInd } from '../../interface/tecnologia.interface';
import { TecnologiaService } from '../../@servicios/admin/tecnologia.service';
import { closeAlert, loadData } from 'src/app/function/cargando';
import Swal from 'sweetalert2';
import { ToastSuccess } from 'src/app/function/validarpost';
import { ResultModelo } from '../../interface/modelo.interface';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-tecnologia',
  templateUrl: './tecnologia.component.html',
  styleUrls: ['./tecnologia.component.css']
})
export class TecnologiaComponent implements OnInit {
  listTecnologia: Tecnologia[] = [];
  titulo: string = 'Crear';
  id: string = '';
  cargar?: boolean = true;
  unblock: boolean = true;
  tecnologiaForm: FormGroup;
  imagenPri?: string;
  imgdefault: string = "https://res.cloudinary.com/dertftoym/image/upload/v1638987062/no-image_tvywlm.jpg";
  uploadFiles?: File;
  @ViewChild('fileInput', { static: false }) fileInput?: ElementRef;
  constructor(private fb: FormBuilder, private tecnologiaService: TecnologiaService, private sanitizer: DomSanitizer) {
    this.tecnologiaForm = this.fb.group({
      title: ['', Validators.required],
      descripcion: ['', Validators.required],
    })

  }

  ngOnInit(): void {
    this.mostrarTecnologia();
  }
  mostrarTecnologia() {
    if (this.cargar) {
      loadData('Cargando', 'Espere mientras carga la informacion')
    }
    this.tecnologiaService.getTecnologias(this.unblock).subscribe(
      (data: ResultTecnologia) => {
        this.listTecnologia = data.tecnologia;
        if (this.cargar) {
          closeAlert();
        }
        this.cargar = false;
      }
    )
  }
  crearEditarTecnologia() {
    if (this.id === '') {
      const data = new FormData();
      data.append('title', this.tecnologiaForm.get('title')?.value);
      data.append('descripcion', this.tecnologiaForm.get('descripcion')?.value);
      this.tecnologiaService.postTecnologia(data).subscribe(
        (data: ResultTecnologiaInd) => {
          ToastSuccess('success', data.msg);
          this.tecnologiaForm.setValue({
            title: '',
            descripcion: '',
          });
          this.mostrarTecnologia();
        },
        (error) => {
          console.log(error);
          ToastSuccess('warning', error.error.errors[0].msg.toLowerCase())
        }
      )
    }
    if (this.id !== '') {
      const data = new FormData();
      data.append('title', this.tecnologiaForm.get('title')?.value);
      data.append('descripcion', this.tecnologiaForm.get('descripcion')?.value);
      this.tecnologiaService.putSTecnologia(data, this.id).subscribe(
        (data: ResultTecnologiaInd) => {
          ToastSuccess('success', data.msg);
          this.mostrarTecnologia();
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
          this.tecnologiaService.putImagen( this.id, formData).subscribe(
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
                this.mostrarTecnologia();
              }
          }, error=>{
            console.log(error);
            
          });
        }
      });
    }

  }
  VerImagenId(ids: any) {
    this.id = ids;
    this.tecnologiaService.getTecnologia(ids).subscribe(
      (data: ResultTecnologiaInd) => {

        if (!data.tecnologia.img) {
          this.imagenPri = "https://res.cloudinary.com/dertftoym/image/upload/v1638987062/no-image_tvywlm.jpg"
        } else {
          this.imagenPri = data.tecnologia.img
        }
        this.titulo = 'Editar'
      },
      (error) => {
        console.log(error);

      }
    )
  }
  select(ids: any, unblock: boolean) {
    this.tecnologiaService.putSelect(ids, unblock).subscribe(
      (data: ResultModelo) => {
        if (!data.ok) {
          ToastSuccess('error', data.msg);
          this.mostrarTecnologia();
        }
        if (data.ok) {
          ToastSuccess('success', data.msg)
          this.mostrarTecnologia();
        }
      },
      (error) => {
        console.log(error);
        ToastSuccess('warning', error.error.errors[0].msg.toLowerCase())
      }
    )
  }
  editarTecnologia(ids: any) {
    this.id = ids;
    this.tecnologiaService.getTecnologia(ids).subscribe(
      (data: ResultTecnologiaInd) => {

        this.tecnologiaForm.setValue({
          title: data.tecnologia.title,
          descripcion: data.tecnologia.descripcion,
        })

        this.titulo = 'Editar'
      },
      (error) => {
        console.log(error);

      }
    )
  }
  borrarTecnologia(ids: any, unblock: boolean) {
    Swal.fire({
      title: 'Estas seguro?',
      text: unblock ? 'Esta tecnologia sera desbloqueado!!!' : 'Este tecnologia sera bloqueado!!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: unblock ? 'Si, desbloquear!' : 'Si, bloquear!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tecnologiaService.deleteTecnologia(ids, unblock).subscribe(
          (data: ResultTecnologiaInd) => {
            this.mostrarTecnologia();
            Swal.fire(
              unblock ? 'Desbloqueado' : 'Bloqueado',
              data.msg,
              'success'
            )
          },
          (error) => {
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
      this.mostrarTecnologia();
    }
    if ($event.target.value === '2') {
      this.unblock = false;
      this.cargar = true;
      this.mostrarTecnologia();
    }
  }
  cancelar() {
    this.id = '',
    this.titulo = 'Crear';
    this.imagenPri = '';
    this.tecnologiaForm.setValue({
      title: '',
      descripcion: '',
    });
    //this.mostrarUsuario();
  }
}
