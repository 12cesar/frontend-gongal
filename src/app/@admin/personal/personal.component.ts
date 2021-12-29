
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { PersonalService } from 'src/app/@servicios/admin/personal.service';
import { closeAlert, loadData } from 'src/app/function/cargando';
import { ToastSuccess } from 'src/app/function/validarpost';
import { ResultModelo } from 'src/app/interface/modelo.interface';
import { Personal, ResultPersonal, ResultPersonalInd } from 'src/app/interface/personal.interface';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

  imgdefaultLogo: string = "https://res.cloudinary.com/dertftoym/image/upload/v1638987062/no-image_tvywlm.jpg";
  imgdefaultPrincipal: string = "https://res.cloudinary.com/dertftoym/image/upload/v1638987062/no-image_tvywlm.jpg";
  imgdefaultContacto: string = "https://res.cloudinary.com/dertftoym/image/upload/v1638987062/no-image_tvywlm.jpg";
  personalForm: FormGroup;
  listPersonal: Personal[] = [];
  id: string = '';
  cargar?: boolean = true;
  uploadFiles?: File;
  uploadFilesPri?: File;
  uploadFilesContact?: File;
  @ViewChild('fileInputLogo', { static: false }) fileInputLogo?: ElementRef;
  @ViewChild('fileInputPrincipal', { static: false }) fileInputPrincipal?: ElementRef;
  @ViewChild('fileInputContacto', { static: false }) fileInputContacto?: ElementRef;
  constructor(private fb: FormBuilder, private personalService: PersonalService, private sanitizer: DomSanitizer) {
    this.personalForm = this.fb.group({
      correo: ['', Validators.required],
      celular: ['', Validators.required],
      descripcion: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.mostrarPersonal();
  }
  mostrarPersonal() {
    if (this.cargar) {
      loadData('Cargando', 'Espere mientras carga la informacion')
    }
    this.personalService.getPersonal().subscribe(
      (data: ResultPersonal) => {
        this.listPersonal = data.personal;
        this.personalForm.setValue({
          correo: this.listPersonal[0].correo,
          celular: this.listPersonal[0].celular,
          descripcion: this.listPersonal[0].descripcion
        });
        this.id = this.listPersonal[0]._id;
        this.imgdefaultLogo = this.listPersonal[0].logo;
        this.imgdefaultPrincipal=this.listPersonal[0].imgpri;
        this.imgdefaultContacto =this.listPersonal[0].imgcontact;
        if (this.cargar) {
          closeAlert();
        }
        this.cargar = false;
      },
      (error) => {
        console.log(error);

      }
    )
  }
  capturarFileLogo(event: any) {
    this.uploadFiles = event.target.files[0];
    if (this.uploadFiles!.size > 4072383) {
      ToastSuccess('warning', 'El tamaño maximo es de 4MB, Archivo excede lo estimado');
    } else {
      this.extraserBase64(this.uploadFiles).then((imagen: any) => {
        this.imgdefaultLogo = imagen.base;
        if (this.id !== undefined) {
          console.log('hola');
          const formData = new FormData();
          const imageBlob = this.fileInputLogo!.nativeElement.files[0];
          formData.set('archivo',imageBlob);
          this.cargar =true
          if (this.cargar) {
            loadData('Cargando', 'Espere mientras carga la imagen a la base de datos')
          }
          this.personalService.putImagen(formData,this.id,'logo').subscribe(
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
                this.mostrarPersonal();
              }
          }, error=>{
            console.log(error);
            
          });
        }
      });
    }
  }
  capturarFilePrincipal(event: any) {
    this.uploadFilesPri = event.target.files[0];
    if (this.uploadFilesPri!.size > 4072383) {
      ToastSuccess('warning', 'El tamaño maximo es de 4MB, Archivo excede lo estimado');
    } else {
      this.extraserBase64(this.uploadFilesPri).then((imagen: any) => {
        this.imgdefaultPrincipal = imagen.base;
        if (this.id !== undefined) {
          console.log('hola');
          const formData = new FormData();
          const imageBlob = this.fileInputPrincipal!.nativeElement.files[0];
          formData.set('archivo',imageBlob);
          this.cargar =true
          if (this.cargar) {
            loadData('Cargando', 'Espere mientras carga la imagen a la base de datos')
          }
          this.personalService.putImagen(formData,this.id,'principal').subscribe(
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
                this.mostrarPersonal();
              }
          }, error=>{
            console.log(error);
            
          });
        }
      });
    }
  }
  capturarFileContacto(event: any) {
    this.uploadFilesContact = event.target.files[0];
    if (this.uploadFilesContact!.size > 4072383) {
      ToastSuccess('warning', 'El tamaño maximo es de 4MB, Archivo excede lo estimado');
    } else {
      this.extraserBase64(this.uploadFilesContact).then((imagen: any) => {
        this.imgdefaultContacto = imagen.base;
        if (this.id !== undefined) {
          console.log('hola');
          const formData = new FormData();
          const imageBlob = this.fileInputContacto!.nativeElement.files[0];
          formData.set('archivo',imageBlob);
          this.cargar =true
          if (this.cargar) {
            loadData('Cargando', 'Espere mientras carga la imagen a la base de datos')
          }
          this.personalService.putImagen(formData,this.id,'contacto').subscribe(
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
                this.mostrarPersonal();
              }
          }, error=>{
            console.log(error);
            
          });
        }
      });
    }
  }
  editarPersonal() {
    const dato = new FormData();
    dato.append('correo', this.personalForm.get('correo')?.value);
    dato.append('celular', this.personalForm.get('celular')?.value);
    dato.append('descripcion', this.personalForm.get('descripcion')?.value);
    this.personalService.putPersonal(dato, this.id).subscribe(
      (data:ResultPersonalInd)=>{
        ToastSuccess('success', data.msg);
        this.mostrarPersonal();
      },
      (error)=>{
        console.log(error);
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

}
