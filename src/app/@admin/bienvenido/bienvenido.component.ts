import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { WelcomeService } from 'src/app/@servicios/admin/welcome.service';
import { closeAlert, loadData } from 'src/app/function/cargando';
import { ToastSuccess } from 'src/app/function/validarpost';
import { ResultModelo } from 'src/app/interface/modelo.interface';
import { ResultWelcome, ResultWelcomeInd, Welcome } from 'src/app/interface/welcome.interface';

@Component({
  selector: 'app-bienvenido',
  templateUrl: './bienvenido.component.html',
  styleUrls: ['./bienvenido.component.css']
})
export class BienvenidoComponent implements OnInit {
  listWelcome: Welcome[] = [];
  imagenDefault: string = "https://res.cloudinary.com/dertftoym/image/upload/v1638987062/no-image_tvywlm.jpg";
  id: string = '';
  cargar?: boolean = true;
  uploadFiles?: File;
  welcomeForm: FormGroup;
  @ViewChild('fileInput', { static: false }) fileInput?: ElementRef;
  constructor(private fb: FormBuilder, private welcomeService: WelcomeService, private sanitizer: DomSanitizer) { 
    this.welcomeForm = this.fb.group({
      subject: ['', Validators.required],
      html: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.mostrarWelcome();
  }
  mostrarWelcome(){
    if (this.cargar) {
      loadData('Cargando', 'Espere mientras carga la informacion')
    }
    this.welcomeService.getWelcome().subscribe(
      (data:ResultWelcome)=>{
        this.listWelcome = data.welcome;
        this.welcomeForm.setValue({
          subject: this.listWelcome[0].subject,
          html: this.listWelcome[0].html,
        });
        this.id = this.listWelcome[0]._id;
        this.imagenDefault = this.listWelcome[0].img;
        if (this.cargar) {
          closeAlert();
        }
        this.cargar = false;
      },
     (error)=>{
       console.log(error);
     } 
    )
  }
  editarWelcome(){
    const dato = new FormData();
    dato.append('subject', this.welcomeForm.get('subject')?.value);
    dato.append('html', this.welcomeForm.get('html')?.value);
    this.welcomeService.putWelcome(dato, this.id).subscribe(
      (data:ResultWelcomeInd)=>{
        ToastSuccess('success', data.msg);
        this.mostrarWelcome();
      },
      (error)=>{
        console.log(error);
        
      }
    )
  }
  capturarFile(event:any){
    this.uploadFiles = event.target.files[0];
    if (this.uploadFiles!.size > 4072383) {
      ToastSuccess('warning', 'El tamaño maximo es de 4MB, Archivo excede lo estimado');
    } else {
      this.extraserBase64(this.uploadFiles).then((imagen: any) => {
        this.imagenDefault = imagen.base;
        if (this.id !== undefined) {
          console.log('hola');
          const formData = new FormData();
          const imageBlob = this.fileInput!.nativeElement.files[0];
          formData.set('archivo',imageBlob);
          this.cargar =true
          if (this.cargar) {
            loadData('Cargando', 'Espere mientras carga la imagen a la base de datos')
          }
          this.welcomeService.putImagen(formData,this.id,'welcome').subscribe(
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
                this.mostrarWelcome();
              }
          }, error=>{
            console.log(error);
            
          });
        }
      });
    }
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
