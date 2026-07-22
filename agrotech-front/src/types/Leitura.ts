import { Dispositivo } from './Dispositivo.ts';

/**
 *  Interface que representa os dados de telemetria capturados pelos sensores.
 */
export interface Leitura {
    id?: number;
    phSolo: number;
    umidadeSolo: number;
    temperaturaAr: number;
    dataHoraCaptura: string;
    dispositivo?: Dispositivo;
}
