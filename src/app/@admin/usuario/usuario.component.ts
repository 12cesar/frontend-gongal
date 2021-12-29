import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { closeAlert, loadData } from 'src/app/function/cargando';
import { ToastSuccess } from 'src/app/function/validarpost';
import { ResultModelo } from 'src/app/interface/modelo.interface';
import { Usuario } from 'src/app/interface/usuario.interface';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../@servicios/admin/usuario.service';
import { ResultUsuario, ResultUsuarioInd } from '../../interface/usuario.interface';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  listUsuario: Usuario[] = [];
  titulo: string = 'Crear';
  id: string = '';
  cargar?: boolean = true;
  unblock: boolean = true;
  usuarioForm: FormGroup;
  imgdefault: string = "https://res.cloudinary.com/dertftoym/image/upload/v1638987062/no-image_tvywlm.jpg";
  imagenPri?: string;
  uploadFiles?: File;
  @ViewChild('fileInput', { static: false }) fileInput?: ElementRef;
  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private sanitizer: DomSanitizer) {
    this.usuarioForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      usuario: ['', Validators.required],
      password: [''],
    })
  }

  ngOnInit(): void {
    this.mostrarUsuario();
  }
  mostrarUsuario() {
    if (this.cargar) {
      loadData('Cargando', 'Espere mientras carga la informacion')
    }
    this.usuarioService.getUsuarios(this.unblock).subscribe(
      (data: ResultUsuario) => {
        this.listUsuario = data.usuario;
        if (this.cargar) {
          closeAlert();
        }
        this.cargar = false;
      }
    )
  }
  crearEditarUsuario() {
    if (this.id === '') {
      const data = new FormData();
      data.append('name', this.usuarioForm.get('name')?.value);
      data.append('lastname', this.usuarioForm.get('lastname')?.value);
      data.append('usuario', this.usuarioForm.get('usuario')?.value);
      data.append('password', this.usuarioForm.get('password')?.value);

      this.usuarioService.postUsuario(data).subscribe(
        (data: ResultUsuarioInd) => {
          ToastSuccess('success', data.msg);
          this.usuarioForm.setValue({
            name: '',
            lastname: '',
            usuario: '',
            password: ''
          });
          this.mostrarUsuario();
        },
        (error) => {
          console.log(error);
          ToastSuccess('warning', error.error.errors[0].msg.toLowerCase())
        }
      )

    }
    if (this.id !== '') {
      const data = new FormData();
      data.append('name', this.usuarioForm.get('name')?.value);
      data.append('lastname', this.usuarioForm.get('lastname')?.value);
      data.append('usuario', this.usuarioForm.get('usuario')?.value);
      if (this.usuarioForm.get('password')?.value !== '') {
        data.append('password', this.usuarioForm.get('password')?.value);
      }
      this.usuarioService.putUsuario(data, this.id).subscribe(
        (data:ResultUsuarioInd)=>{
          ToastSuccess('success',data.msg );
          this.mostrarUsuario();
        },
        (error)=>{
          console.log(error);
        }
      )
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
          this.usuarioService.putImagen( this.id, formData).subscribe(
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
                this.mostrarUsuario();
              }
          }, error=>{
            console.log(error);
            
          });
        }
      });
    }
  }
  editarUsuario(ids: any) {
    this.id = ids;
    this.usuarioService.getUsuario(ids).subscribe(
      (data: ResultUsuarioInd) => {
       
        this.usuarioForm.setValue({
          name: data.usuario.name,
          lastname: data.usuario.lastname,
          usuario: data.usuario.usuario,
          password: ''
        })
        this.titulo = 'Editar'
      },
      (error) => {
        console.log(error);

      }
    )
  }
  borrarUsuario(id: any, unblock: boolean) {
    Swal.fire({
      title: 'Estas seguro?',
      text: unblock ? 'Este usuario sera desbloqueado!!!' :'Este usuario sera bloqueado!!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: unblock ? 'Si, desbloquear!' :'Si, bloquear!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.deleteUsuario(id, unblock).subscribe(
          (data: ResultUsuarioInd)=>{
            this.mostrarUsuario();
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
  editarImagen(ids: any) {
    this.id = ids;
    this.usuarioService.getUsuario(ids).subscribe(
      (data: ResultUsuarioInd) => {

        if (!data.usuario.img) {
          this.imagenPri = "https://res.cloudinary.com/dertftoym/image/upload/v1638987062/no-image_tvywlm.jpg"
        } else {
          this.imagenPri = data.usuario.img
        }
        this.titulo = 'Editar'
      },
      (error) => {
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
  ShowSelected($event: any) {
    if ($event.target.value === '1') {
      this.unblock = true;
      this.cargar = true;
      this.mostrarUsuario();
    }
    if ($event.target.value === '2') {
      this.unblock = false;
      this.cargar = true;
      this.mostrarUsuario();
    }
  }
  cancelar() {
    this.id = '',
    this.titulo = 'Crear';
    this.imagenPri = '';
    this.usuarioForm.setValue({
      name: '',
      lastname: '',
      usuario: '',
      password: ''
    });
    //this.mostrarUsuario();
  }
}
