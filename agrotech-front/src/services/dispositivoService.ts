import { api } from './api';
import { Dispositivo } from '../types/Dispositivo';

/**
 * Serviço responsável por realizar as chamadas HTTP relacionadas
 * ao gerenciamento e controle dos dispositivos IoT.
 */
export const dispositivoService = {
    /**
     * Consulta a lista com todos os dispositivos IoT registrados.
     *
     * @returns {Promise<Dispositivo[]>} Uma promessa contendo a lista de equipamentos.
     */
    listarTodos: async (): Promise<Dispositivo[]> => {
        const response = await api.get<Dispositivo[]>('/dispositivos');
        return response.data;
    },

    /**
     * Localiza um dispositivo IoT específico pelo seu ID.
     *
     * @param {number} id - Identificador único do dispositivo.
     * @returns {Promise<Dispositivo>} Uma promessa contendo os dados do dispositivo.
     */
    buscarPorId: async (id: number): Promise<Dispositivo> => {
        const response = await api.get<Dispositivo>(`/dispositivos/${id}`);
        return response.data;
    },

    /**
     * Registra um novo equipamento IoT vinculando-o a uma fazenda.
     *
     * @param {Dispositivo} dispositivo - Objeto contendo dados de modelo, status e vínculo.
     * @returns {Promise<Dispositivo>} Uma promessa com o dispositivo salvo.
     */
    cadastrar: async (dispositivo: Dispositivo): Promise<Dispositivo> => {
        const response = await api.post<Dispositivo>('/dispositivos', dispositivo);
        return response.data;
    },

    /**
     * Altera informações ou o status operacional de um equipamento cadastrado.
     *
     * @param {number} id - Identificador do dispositivo.
     * @param {Dispositivo} dispositivo - Novos dados para atualização.
     * @returns {Promise<Dispositivo>} Uma promessa contendo o dispositivo atualizado.
     */
    atualizar: async (id: number, dispositivo: Dispositivo): Promise<Dispositivo> => {
        const response = await api.put<Dispositivo>(`/dispositivos/${id}`, dispositivo);
        return response.data;
    },

    /**
     * Exclui o cadastro de um equipamento do sistema.
     *
     * @param {number} id - Identificador único do dispositivo a ser deletado.
     * @returns {Promise<void>} Promessa resolvida após a exclusão.
     */
    deletar: async (id: number): Promise<void> => {
        await api.delete(`/dispositivos/${id}`);
    },
};