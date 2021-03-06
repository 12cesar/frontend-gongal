// Generated by https://quicktype.io

export interface ResultService {
    ok:       boolean;
    msg:      string;
    servicio: Servicio[];
}
export interface ResultServiceInd {
    ok:       boolean;
    msg:      string;
    servicio: Servicio;
}

export interface Servicio {
    _id:         string;
    title:       string;
    descripcion: string;
    select:      boolean;
    position:    number;
    estado:      boolean;
    logo?:       string;
    img?:        string;
}
