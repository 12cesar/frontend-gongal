// Generated by https://quicktype.io

export interface ResultSocial {
    ok:     boolean;
    msg:    string;
    social: Social[];
}
export interface ResultSocialInd {
    ok:     boolean;
    msg:    string;
    social: Social;
}
export interface Social {
    _id:      string;
    title:    string;
    enlace:   string;
    position: number;
    estado:   boolean;
    img?:     string;
}
