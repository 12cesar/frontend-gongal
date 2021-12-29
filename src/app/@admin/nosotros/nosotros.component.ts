import { ResultServiceInd } from './../../interface/servicio.interface';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NosotrosService } from 'src/app/@servicios/admin/nosotros.service';
import { closeAlert, loadData } from 'src/app/function/cargando';
import { Nosotro, ResultNosotros, ResultNosotrosInd } from 'src/app/interface/nosotros.interface';
import Swal from 'sweetalert2';
import { ToastSuccess } from 'src/app/function/validarpost';
import { DomSanitizer } from '@angular/platform-browser';
import { ResultModelo } from 'src/app/interface/modelo.interface';

@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.css']
})
export class NosotrosComponent implements OnInit {
  listNosotros: Nosotro[] = [];
  titulo: string = 'Crear';
  id: string = '';
  cargar?: boolean = true;
  unblock: boolean = true;
  nosotroForm: FormGroup;
  imgdefault: string = "https://res.cloudinary.com/dertftoym/image/upload/v1638987062/no-image_tvywlm.jpg";
  imagenPri?: string;
  uploadFiles?: File;
  @ViewChild('fileInput', { static: false }) fileInput?: ElementRef;
  constructor(private fb: FormBuilder, private nosotroService: NosotrosService,private sanitizer: DomSanitizer) { 
    this.nosotroForm = this.fb.group({
      title: ['', Validators.required],
      descripcion: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.mostrarNosotros();
  }
  mostrarNosotros() {
    if (this.cargar) {
      loadData('Cargando', 'Espere mientras carga la informacion')
    }
    this.nosotroService.getNosotros(this.unblock).subscribe(
      (data: ResultNosotros) => {
        this.listNosotros = data.nosotros;
        if (this.cargar) {
          closeAlert();
        }
        this.cargar = false;
      }
    )
  }
  crearEditarNosotros(){
    if (this.id === '') {
      const data = new FormData();
      data.append('title', this.nosotroForm.get('title')?.value);
      data.append('descripcion', this.nosotroForm.get('descripcion')?.value);
      this.nosotroService.postNosotro(data).subscribe(
        (data: ResultNosotrosInd) => {
          ToastSuccess('success', data.msg);
          this.nosotroForm.setValue({
            title: '',
            descripcion: '',
          });
          this.mostrarNosotros();
        },
        (error) => {
          console.log(error);
          ToastSuccess('warning', error.error.errors[0].msg.toLowerCase())
        }
      )
    }
    if (this.id !== '') {
      const data = new FormData();
      data.append('title', this.nosotroForm.get('title')?.value);
      data.append('descripcion', this.nosotroForm.get('descripcion')?.value);
      this.nosotroService.putNosotro(data, this.id).subscribe(
        (data: ResultNosotrosInd) => {
          ToastSuccess('success', data.msg);
          this.mostrarNosotros();
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
          this.nosotroService.putImagen( this.id, formData).subscribe(
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
                this.mostrarNosotros();
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
    this.nosotroService.getNosotro(ids).subscribe(
      (data: ResultNosotrosInd) => {

        if (!data.nosotros.img) {
          this.imagenPri = "https://res.cloudinary.com/dertftoym/image/upload/v1638987062/no-image_tvywlm.jpg"
        } else {
          this.imagenPri = data.nosotros.img
        }
        this.titulo = 'Editar'
      },
      (error) => {
        console.log(error);

      }
    )
  }
  editarNosotros(ids:any){
    this.id = ids;
    this.nosotroService.getNosotro(ids).subscribe(
      (data: ResultNosotrosInd) => {

        this.nosotroForm.setValue({
          title: data.nosotros.title,
          descripcion: data.nosotros.descripcion,
        })

        this.titulo = 'Editar'
      },
      (error) => {
        console.log(error);

      }
    )
  }
  borrarNosotros(ids:any, unblock:boolean){
    Swal.fire({
      title: 'Estas seguro?',
      text: unblock ? 'Esta opcion sera desbloqueado!!!' :'Este opcion sera bloqueado!!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: unblock ? 'Si, desbloquear!' :'Si, bloquear!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.nosotroService.deleteNosotro(ids, unblock).subscribe(
          (data: ResultNosotrosInd)=>{
            this.mostrarNosotros();
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
  select(ids:any, unblock:boolean){
    this.nosotroService.putSelect(ids, unblock).subscribe(
      (data:ResultModelo)=>{
        if (!data.ok) {
          ToastSuccess('error', data.msg);
          this.mostrarNosotros();
        }
        if (data.ok) {
          ToastSuccess('success', data.msg)
          this.mostrarNosotros();
        }
      },
      (error)=>{
        console.log(error);
        ToastSuccess('warning', error.error.errors[0].msg.toLowerCase())
      }
    )
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
      this.mostrarNosotros();
    }
    if ($event.target.value === '2') {
      this.unblock = false;
      this.cargar = true;
      this.mostrarNosotros();
    }
  }
  cancelar() {
    this.id = '',
    this.titulo = 'Crear';
    this.imagenPri = '';
    this.nosotroForm.setValue({
      title: '',
      descripcion: '',
    });
    //this.mostrarUsuario();
  }
}
