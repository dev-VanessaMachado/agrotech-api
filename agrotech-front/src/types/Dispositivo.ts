import { Fazenda } from './Fazenda.ts';

/**
 * Interface que representa a entidade Dispositivo IoT do backend.
 */
export interface Dispositivo {
    id?: number;
    nomeModelo: string;
    dataInstalacao: string;
    status: 'ATIVO' | 'INATIVO' | 'MANUTENCAO';
    fazenda?: Fazenda;
}