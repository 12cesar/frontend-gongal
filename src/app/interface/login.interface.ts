// Generated by https://quicktype.io

export interface ResultLogin {
    ok:    boolean;
    msg:   string;
    user:  User;
    token: string;
}

export interface User {
    _id:      string;
    name:     string;
    lastname: string;
    usuario:  string;
    rol:      string;
    estado:   boolean;
    password: string;
}
