import { api } from './api';
import type { Leitura } from '../types/Leitura';

/**
 * Serviço responsável pela comunicação de dados de telemetria e leituras dos sensores de campo.
 */
export const leituraService = {
    /**
     * Busca o histórico completo de capturas de dados realizadas pelos sensores.
     *
     * @returns {Promise<Leitura[]>} Uma promessa contendo o histórico de leituras.
     */
    listarTodas: async (): Promise<Leitura[]> => {
        const response = await api.get<Leitura[]>('/leituras');
        return response.data;
    },

    /**
     * Consulta os dados detalhados de uma leitura individual por ID.
     *
     * @param {number} id - Identificador único da medição.
     * @returns {Promise<Leitura>} Uma promessa contendo a leitura recuperada.
     */
    buscarPorId: async (id: number): Promise<Leitura> => {
        const response = await api.get<Leitura>(`/leituras/${id}`);
        return response.data;
    },

    /**
     * Envia para persistência um novo registro de telemetria medido no campo.
     *
     * @param {Leitura} leitura - Dados de temperatura, umidade e pH do solo.
     * @returns {Promise<Leitura>} Uma promessa contendo a leitura gravada no banco.
     */
    registrar: async (leitura: Leitura): Promise<Leitura> => {
        const response = await api.post<Leitura>('/leituras', leitura);
        return response.data;
    },

    /**
     * Permite a atualização manual de um registro de telemetria existente.
     *
     * @param {number} id - Identificador do registro a ser corrigido.
     * @param {Leitura} leitura - Dados atualizados de medição.
     * @returns {Promise<Leitura>} Uma promessa com a leitura corrigida.
     */
    atualizar: async (id: number, leitura: Leitura): Promise<Leitura> => {
        const response = await api.put<Leitura>(`/leituras/${id}`, leitura);
        return response.data;
    },

    /**
     * Remove um registro do histórico de telemetria do sistema.
     *
     * @param {number} id - Identificador da leitura a ser excluída.
     * @returns {Promise<void>} Promessa resolvida após a exclusão.
     */
    deletar: async (id: number): Promise<void> => {
        await api.delete(`/leituras/${id}`);
    },
};