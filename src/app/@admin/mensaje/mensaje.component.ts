import { Component, OnInit } from '@angular/core';
import { MailboxService } from 'src/app/@servicios/admin/mailbox.service';
import { closeAlert, loadData } from 'src/app/function/cargando';
import { ToastSuccess } from 'src/app/function/validarpost';
import { Mensaje, ResultMailbox, ResultMailboxInd } from 'src/app/interface/mailbox.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mensaje',
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.css']
})
export class MensajeComponent implements OnInit {

  listMensaje: Mensaje[]=[];
  unblock:boolean= false;
  cargar?: boolean = true;
  listMensajeInd={
    from:'',
    fecha:'',
    contenido:'',
    servicio:'',
    name:''
  };
  constructor(private mailboxService: MailboxService) { }

  ngOnInit(): void {
    this.mostrarMailbox();
  }
  mostrarMailbox(){
    if (this.cargar) {
      loadData('Cargando', 'Espere mientras carga la informacion')
    }
    this.mailboxService.getMensajes(this.unblock).subscribe(
      (data:ResultMailbox)=>{
        this.listMensaje= data.mensaje;
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
  mailboxRead(tipo:boolean){
    this.unblock = tipo;
    this.mostrarMailbox();
  }
  verMensaje(id:any){
    this.mailboxService.putMensaje(true, id).subscribe(
      (data:ResultMailboxInd)=>{
        this.listMensajeInd = {
          from:data.mensaje.correo,
          fecha:data.mensaje.date,
          contenido:data.mensaje.mensaje,
          servicio:data.mensaje.servicio.title,
          name:data.mensaje.name
        }
        this.mostrarMailbox();
      },
      (error)=>{
        console.log(error);
        
      }
    )
  }
  borrarMensaje(id:any){
    Swal.fire({
      title: 'Estas seguro?',
      text: 'Este mensaje sera Eliminado!!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.mailboxService.deleteMensaje(id).subscribe(
          (data)=>{
            this.mostrarMailbox();
            Swal.fire(
             'Eliminado',
              'Mensaje Eliminado con exito',
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
}
