import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { PersonalService } from 'src/app/@servicios/admin/personal.service';
import { ServicioService } from 'src/app/@servicios/admin/servicio.service';
import { UbicacionService } from 'src/app/@servicios/admin/ubicacion.service';
import { MensajeService } from 'src/app/@servicios/public/mensaje.service';
import { closeAlert, loadData } from 'src/app/function/cargando';
import { ToastSuccess } from 'src/app/function/validarpost';
import { Lugar, ResultLugar, Ubicacion } from 'src/app/interface/lugar.interface';
import { Personal, ResultPersonal } from 'src/app/interface/personal.interface';
import { ResultService, Servicio } from 'src/app/interface/servicio.interface';
import { Mensaje } from '../../interface/message.interface';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {
  mapa?: mapboxgl.Map;
  lugares: { [key: string]: Lugar } = {};
  markersMapbox: { [id: string]: mapboxgl.Marker } = {};
  listLugares: Ubicacion[] = [];
  cargar?: boolean = true;
  listPersonal: Personal[] = [];
  address: string = '';
  contact: Mensaje = {
    name: '',
    celular: '',
    correo: '',
    empresa: '',
    mensaje: '',
    servicio: ''
  }
  listServicios: Servicio[] = [];
  constructor(private ubicacionService: UbicacionService, private personalService: PersonalService, private servicioService: ServicioService, private mensajeService: MensajeService) { }

  ngOnInit(): void {
    this.getMarcador();
    this.getPersonal();
    this.getServicio();
  }
  getMarcador() {
    if (this.cargar) {
      loadData('Cargando', 'Espere mientras carga la informacion')
    }
    this.ubicacionService.getUbicacion().subscribe(
      (data: ResultLugar) => {
        this.listLugares = data.ubicacion;
        for (let i = 0; i < data.ubicacion.length; i++) {
          this.lugares[i] = data.ubicacion[i];
        }
        this.address = data.ubicacion[0].address;
        this.crearMapa();
        if (this.cargar) {
          closeAlert();
        }
        this.cargar = false;
      },
      (error) => {
        console.log(error);
      }
    );

  }
  getPersonal() {
    this.personalService.getPersonal().subscribe(
      (data: ResultPersonal) => {
        this.listPersonal = data.personal
      },
      (error) => {
        console.log(error);

      }
    )
  }
  getServicio() {
    this.servicioService.getServicios(true).subscribe(
      (data: ResultService) => {
        this.listServicios = data.servicio;
      },
      (error) => {
        console.log(error);

      }
    )
  }
  crearMapa() {
    this.mapa = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      accessToken: 'pk.eyJ1IjoidGlnZXIxMjE0IiwiYSI6ImNrcDd0cDl2NTAzM2syeG1zdzV4NWEwaGIifQ.xYnNZjDu30SiuGKjzgh_jg',
      center: [-74.534565, -8.390361],
      zoom: 15
    });
    for (const [key, marcador] of Object.entries(this.lugares)) {
      this.agregarMarcador2(marcador)
    }
    /* for(const [key,marcador] of Object.entries(this.lugares)){      
      this.agregarMarcador2(marcador)
    }  */
  }
  enviar() {
    this.mensajeService.postMessage(this.contact).subscribe(
      (data) => {
        ToastSuccess('success', data.msg);
        this.contact = {
          name: '',
          celular: '',
          correo: '',
          empresa: '',
          mensaje: '',
          servicio: ''
        }
      },
      (error) => {
        console.log(error);

      }
    )
  }
  agregarMarcador2(marcador: Lugar) {
    const h1 = document.createElement('h5');
    h1.innerText = marcador.title;
    const h2 = document.createElement('h5');
    h2.innerText = marcador.address.toLowerCase();
    //const btnBorrar = document.createElement('button');
    //btnBorrar.innerText = 'Desconectar';
    const div = document.createElement('div');
    div.setAttribute('style', 'width:100px, height:100px')
    div.append(h1, h2);
    const customPopup = new mapboxgl.Popup({
      offset: 25,
      closeOnClick: false
    }).setDOMContent(div);
    const marker = new mapboxgl.Marker({
      draggable: false,
      color: `#${marcador.color}`,
    })
      .setLngLat([marcador.lng, marcador.lat])
      .setPopup(customPopup)
      .addTo(this.mapa!)

    marker.on('drag', () => {
      const lngLat = marker.getLngLat();
      //TODO: Crear evento para emitir las coordenadas de este marcador
      const nuevoMarcador = {
        id: marcador._id,
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
}
