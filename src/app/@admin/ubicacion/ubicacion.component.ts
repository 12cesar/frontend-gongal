import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as mapboxgl from 'mapbox-gl';
import { UbicacionService } from 'src/app/@servicios/admin/ubicacion.service';
import { closeAlert, loadData } from 'src/app/function/cargando';
import { ToastSuccess } from 'src/app/function/validarpost';
import { Lugar, ResultLugar, ResultLugarInd, Ubicacion } from 'src/app/interface/lugar.interface';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.css']
})
export class UbicacionComponent implements OnInit {
  mapa?:mapboxgl.Map;
  btnBorrar: any;
  lugares:{[key:string]:Lugar}={};
  markersMapbox: {[id:string]: mapboxgl.Marker} ={};
  position={
    lng:0,
    lat:0
  }
  pointForm:FormGroup;
  listLugares:Ubicacion[]=[];
  cargar?: boolean = true;
  constructor(private fb:FormBuilder, private ubicacionService:UbicacionService) { 
    this.pointForm=this.fb.group({
      title:['', Validators.required],
      address:['', Validators.required],
      lat:[0, Validators.required],
      lng:[0, Validators.required],
      color:['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.getMarcador()
  }
  getMarcador(){
    if (this.cargar) {
      loadData('Cargando', 'Espere mientras carga la informacion')
    }
    this.ubicacionService.getUbicacion().subscribe(
      (data:ResultLugar)=>{
        this.listLugares = data.ubicacion;
        for (let i = 0; i < data.ubicacion.length; i++) {
            this.lugares[i] =data.ubicacion[i];       
        }
        this.crearMapa();
        if (this.cargar) {
          closeAlert();
        }
        this.cargar = false;
      },
      (error)=>{
        console.log(error);
      }
    );

  }
  crearMapa() {
    this.mapa = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      accessToken: 'pk.eyJ1IjoidGlnZXIxMjE0IiwiYSI6ImNrcDd0cDl2NTAzM2syeG1zdzV4NWEwaGIifQ.xYnNZjDu30SiuGKjzgh_jg',
      center:[-74.534565, -8.390361],
      zoom:13
    });

    for(const [key,marcador] of Object.entries(this.lugares)){      
      this.agregarMarcador2(marcador)
    } 
  }
  agregarMarcador(marcador:Lugar){
    const h1 = document.createElement('h6');
    h1.innerText = 'Crear Marcador';
    const h2 = document.createElement('h2');
    h2.innerText = marcador.address.toLowerCase();
    const btnCrear= document.createElement('button');
    btnCrear.innerText='crear';
    btnCrear.className = 'btn btn-primary';
    this.btnBorrar = document.createElement('button');
    this.btnBorrar.innerText = 'Borrar';
    this.btnBorrar.className = 'btn btn-danger ml-2';
    //const btnBorrar = document.createElement('button');
    //btnBorrar.innerText = 'Desconectar';
    const div = document.createElement('div');
    div.setAttribute('style','width:100px, height:100px')
    div.append(h1, btnCrear, this.btnBorrar);
    const customPopup = new mapboxgl.Popup({
      offset:25,
      closeOnClick:false
    }).setDOMContent(div);
    const marker = new mapboxgl.Marker({
      draggable:true,
      color:marcador.color,
    })
    .setLngLat([marcador.lng, marcador.lat])
    .setPopup(customPopup)
    .addTo(this.mapa!)
    btnCrear.addEventListener('click',()=>{
      const modals = document.querySelector(".hidden");
      const container = modals?.querySelector(".container");
      modals?.classList.remove("hidden")
    })
    this.position = {
      lng:marcador.lng,
      lat:marcador.lat
    } 
    this.pointForm.setValue({
      title:'',
      address:'',
      lat:marcador.lat,
      lng:marcador.lng,
      color:marcador.color.slice(1)
    })
    marker.on('drag', ()=>{
      const lngLat = marker.getLngLat();
      this.position = lngLat;
      this.pointForm.setValue({
        title:'',
        address:'',
        lat:this.position.lat,
        lng:this.position.lng,
        color:marcador.color.slice(1)
      })
      //TODO: Crear evento para emitir las coordenadas de este marcador
      const nuevoMarcador ={
        id:marcador._id,
        ...lngLat
      };
      //this.wsService.emit('marcador-mover', nuevoMarcador);
    });
    this.btnBorrar.addEventListener('click', ()=>{
      marker.remove();
      //TODO: Eliminar el marcador por sockets
    });
  }
  crearMarcador(){
    const customMarker:Lugar= {
      _id: new Date().toISOString(),
      lng: -74.5362106937176,  
      lat: -8.388726653659987,
      title: 'julio cesar calderon galindo',
      address: 'vehiculo 3',
      color:'#' + Math.floor(Math.random()*16777215).toString(16),
      select:false
    }
    this.agregarMarcador(customMarker);
    //emitir marcador -nuevo
    //this.wsService.emit('marcador-nuevo', customMarker)
  }
  cerrar(){
    const modals = document.querySelector(".modal");
      const container = modals?.querySelector(".container");
      modals?.classList.add("hidden")
  }
  addMarcador(){
    const dato = new FormData();
    dato.append('title', this.pointForm.get('title')?.value);
    dato.append('address', this.pointForm.get('address')?.value);
    dato.append('lng', this.pointForm.get('lng')?.value);
    dato.append('lat', this.pointForm.get('lat')?.value);
    dato.append('color', this.pointForm.get('color')?.value);
    this.ubicacionService.postBeneficio(dato).subscribe(
      (data)=>{
        ToastSuccess('success','Creado con exito')
        this.getMarcador();
      },
      (error)=>{
        console.log(error);
        
      }
    )
  }
  prueba(){
    console.log('me diste click');
    
  }
  agregarMarcador2(marcador:Lugar){
    const h1 = document.createElement('h5');
    h1.innerText = marcador.title;
    const h2 = document.createElement('h5');
    h2.innerText = marcador.address.toLowerCase();
    //const btnBorrar = document.createElement('button');
    //btnBorrar.innerText = 'Desconectar';
    const div = document.createElement('div');
    div.setAttribute('style','width:100px, height:100px')
    div.append(h1, h2);
    const customPopup = new mapboxgl.Popup({
      offset:25,
      closeOnClick:false
    }).setDOMContent(div);
    const marker = new mapboxgl.Marker({
      draggable:false,
      color:`#${marcador.color}`,
    })
    .setLngLat([marcador.lng, marcador.lat])
    .setPopup(customPopup)
    .addTo(this.mapa!)

    marker.on('drag', ()=>{
      const lngLat = marker.getLngLat();
      //TODO: Crear evento para emitir las coordenadas de este marcador
      const nuevoMarcador ={
        id:marcador._id,
        ...lngLat
      };
      //this.wsService.emit('marcador-mover', nuevoMarcador);
      
    });

    /* btnBorrar.addEventListener('click', ()=>{
      marker.remove();

      //TODO: Eliminar el marcador mediante sockets
      this.wsService.emit('marcador-borrar', marcador.id);

    }) */

    this.markersMapbox[marcador._id!] = marker;
  }
  eliminar(id:any){
    Swal.fire({
      title: 'Estas seguro?',
      text: 'Esta ubicacion sera eliminada!!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ubicacionService.deleteUbicacion(id).subscribe(
          (data: ResultLugarInd)=>{
            for (let i = 0; i < Object.keys(this.lugares).length; i++) {
              if (this.lugares[i]._id === id) {
                delete this.lugares[i]
              }  
            }
            Swal.fire(
              'Eliminado',
              data.msg,
              'success'
            );
            this.getMarcador();
          },
          (error)=>{
            console.log(error);
            
          }
        )
        
      }
    })
  }
}
