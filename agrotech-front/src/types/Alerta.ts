import  { Dispositivo } from './Dispositivo.ts';

/**
 * Interface que representa os alertas gerados por anomalias.
 */
export interface Alerta {
    id?: number;
    descricao: string;
    severidade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
    dataHoraDisparo: string;
    resolvido: boolean;
    dispositivo?: Dispositivo;
}