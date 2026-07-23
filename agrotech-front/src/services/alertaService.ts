import { api } from './api';
import type { Alerta } from '../types/Alerta';

/**
 * Serviço encarregado do consumo dos endpoints referentes aos alertas e anomalias do sistema.
 */
export const alertaService = {
    /**
     * Retorna todas as ocorrências de alertas disparados no ecossistema.
     *
     * @returns {Promise<Alerta[]>} Uma promessa contendo a lista de alertas.
     */
    listarTodos: async (): Promise<Alerta[]> => {
        const response = await api.get<Alerta[]>('/alertas');
        return response.data;
    },

    /**
     * Obtém os detalhes de um evento de alerta pelo seu identificador.
     *
     * @param {number} id - Identificador único do alerta.
     * @returns {Promise<Alerta>} Uma promessa com os dados do alerta.
     */
    buscarPorId: async (id: number): Promise<Alerta> => {
        const response = await api.get<Alerta>(`/alertas/${id}`);
        return response.data;
    },

    /**
     * Registra o disparo de uma nova ocorrência ou anomalia de sensor.
     *
     * @param {Alerta} alerta - Dados de severidade, descrição e equipamento associado.
     * @returns {Promise<Alerta>} Uma promessa com o alerta cadastrado.
     */
    disparar: async (alerta: Alerta): Promise<Alerta> => {
        const response = await api.post<Alerta>('/alertas', alerta);
        return response.data;
    },

    /**
     * Atualiza as informações de um alerta (ex: alterar status para resolvido).
     *
     * @param {number} id - Identificador do alerta.
     * @param {Alerta} alerta - Objeto com o status e informações alteradas.
     * @returns {Promise<Alerta>} Uma promessa contendo o alerta atualizado.
     */
    atualizar: async (id: number, alerta: Alerta): Promise<Alerta> => {
        const response = await api.put<Alerta>(`/alertas/${id}`, alerta);
        return response.data;
    },

    /**
     * Exclui um evento de alerta do histórico do sistema.
     *
     * @param {number} id - Identificador único do alerta a ser removido.
     * @returns {Promise<void>} Promessa resolvida após a deleção.
     */
    deletar: async (id: number): Promise<void> => {
        await api.delete(`/alertas/${id}`);
    },
};