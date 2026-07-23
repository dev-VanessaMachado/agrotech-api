import { api } from './api';
import type { Fazenda } from '../types/Fazenda';

/**
 * Serviço responsável por integrar a camada de interface web com a API Spring Boot
 * referente ao gerenciamento das propriedades rurais (Fazendas).
 */
export const fazendaService = {
    /**
     * Recupera a lista completa de fazendas cadastradas no sistema.
     *
     * @returns {Promise<Fazenda[]>} Uma promessa contendo a lista de fazendas.
     */
    listarTodas: async (): Promise<Fazenda[]> => {
        const response = await api.get<Fazenda[]>('/fazendas');
        return response.data;
    },

    /**
     * Busca os detalhes de uma fazenda específica pelo seu identificador.
     *
     * @param {number} id - Identificador único da fazenda.
     * @returns {Promise<Fazenda>} Uma promessa contendo a instância da fazenda encontrada.
     */
    buscarPorId: async (id: number): Promise<Fazenda> => {
        const response = await api.get<Fazenda>(`/fazendas/${id}`);
        return response.data;
    },

    /**
     * Realiza o cadastro de uma nova propriedade rural no sistema.
     *
     * @param {Fazenda} fazenda - Objeto contendo os dados da nova fazenda.
     * @returns {Promise<Fazenda>} Uma promessa contendo a fazenda cadastrada e com ID gerado.
     */
    cadastrar: async (fazenda: Fazenda): Promise<Fazenda> => {
        const response = await api.post<Fazenda>('/fazendas', fazenda);
        return response.data;
    },

    /**
     * Atualiza as informações de uma fazenda já existente.
     *
     * @param {number} id - Identificador único da fazenda a ser alterada.
     * @param {Fazenda} fazenda - Objeto com os novos dados atualizados.
     * @returns {Promise<Fazenda>} Uma promessa contendo a fazenda atualizada.
     */
    atualizar: async (id: number, fazenda: Fazenda): Promise<Fazenda> => {
        const response = await api.put<Fazenda>(`/fazendas/${id}`, fazenda);
        return response.data;
    },

    /**
     * Remove um registro de fazenda do sistema através do seu ID.
     *
     * @param {number} id - Identificador único da fazenda a ser excluída.
     * @returns {Promise<void>} Promessa resolvida após a exclusão com sucesso.
     */
    deletar: async (id: number): Promise<void> => {
        await api.delete(`/fazendas/${id}`);
    },
};