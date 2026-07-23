import React, { useEffect, useState } from 'react';
import { fazendaService } from '../services/fazendaService';
import type { Fazenda } from '../types/Fazenda';
import { Plus, Pencil, Trash2, Tractor, MapPin, Maximize2, Loader2, X } from 'lucide-react';

/**
 * Página para gerenciamento de propriedades rurais (Fazendas).
 * Exibe listagem, permite cadastrar novas fazendas, editar dados existentes e remover registros.
 */
export const FazendasPage: React.FC = () => {
    const [fazendas, setFazendas] = useState<Fazenda[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [salvando, setSalvando] = useState<boolean>(false);
    const [modalAberto, setModalAberto] = useState<boolean>(false);
    const [fazendaEdicao, setFazendaEdicao] = useState<Fazenda | null>(null);

    // Estados do formulário
    const [nome, setNome] = useState<string>('');
    const [localizacao, setLocalizacao] = useState<string>('');
    const [areaHectares, setAreaHectares] = useState<string>('');

    /**
     * Carrega a lista de fazendas cadastradas no backend.
     */
    const carregarFazendas = async () => {
        try {
            setCarregando(true);
            const dados = await fazendaService.listarTodas();
            setFazendas(dados);
        } catch (error) {
            console.error('Erro ao carregar fazendas:', error);
            alert('Não foi possível carregar a lista de fazendas. Verifique se o backend está rodando.');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarFazendas();
    }, []);

    /**
     * Prepara o modal para criar uma nova fazenda ou editar uma existente.
     *
     * @param {Fazenda | null} fazenda - Instância para edição ou null para novo cadastro.
     */
    const abrirModal = (fazenda: Fazenda | null = null) => {
        if (fazenda) {
            setFazendaEdicao(fazenda);
            setNome(fazenda.nome);
            setLocalizacao(fazenda.localizacao);
            setAreaHectares(fazenda.areaHectares.toString());
        } else {
            setFazendaEdicao(null);
            setNome('');
            setLocalizacao('');
            setAreaHectares('');
        }
        setModalAberto(true);
    };

    /**
     * Submete os dados do formulário de criação/edição.
     */
    const handleSalvar = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome.trim() || !localizacao.trim() || !areaHectares) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const payload: Fazenda = {
            nome,
            localizacao,
            areaHectares: parseFloat(areaHectares),
        };

        try {
            setSalvando(true);
            if (fazendaEdicao && fazendaEdicao.id) {
                await fazendaService.atualizar(fazendaEdicao.id, payload);
            } else {
                await fazendaService.cadastrar(payload);
            }
            setModalAberto(false);
            await carregarFazendas();
        } catch (error) {
            console.error('Erro ao salvar fazenda:', error);
            alert('Erro ao salvar os dados da fazenda.');
        } finally {
            setSalvando(false);
        }
    };

    /**
     * Remove uma fazenda pelo ID após confirmação.
     *
     * @param {number} id - Identificador da fazenda a ser excluída.
     */
    const handleDeletar = async (id: number) => {
        if (confirm('Tem certeza que deseja remover esta fazenda?')) {
            try {
                await fazendaService.deletar(id);
                await carregarFazendas();
            } catch (error) {
                console.error('Erro ao remover fazenda:', error);
                alert('Não foi possível excluir a fazenda.');
            }
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Cabeçalho da Página */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Tractor className="w-7 h-7 text-emerald-600" />
                        Gerenciamento de Fazendas
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Cadastre e monitore as propriedades rurais registradas no sistema.
                    </p>
                </div>
                <button
                    onClick={() => abrirModal()}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg transition-colors font-medium text-sm shadow-sm cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Nova Fazenda
                </button>
            </div>

            {/* Conteúdo Principal / Tabela */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {carregando ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
                        <p className="text-sm">Carregando fazendas...</p>
                    </div>
                ) : fazendas.length === 0 ? (
                    <div className="text-center py-16 text-gray-500 space-y-3">
                        <Tractor className="w-12 h-12 text-gray-300 mx-auto" />
                        <p className="font-medium text-base">Nenhuma fazenda cadastrada.</p>
                        <p className="text-xs text-gray-400">Clique no botão acima para adicionar a primeira propriedade.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold uppercase text-xs">
                                <th className="py-4 px-6">ID</th>
                                <th className="py-4 px-6">Nome da Propriedade</th>
                                <th className="py-4 px-6">Localização</th>
                                <th className="py-4 px-6">Área (Hectares)</th>
                                <th className="py-4 px-6 text-right">Ações</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                            {fazendas.map((fazenda) => (
                                <tr key={fazenda.id} className="hover:bg-emerald-50/40 transition-colors">
                                    <td className="py-4 px-6 font-mono text-xs text-gray-400">#{fazenda.id}</td>
                                    <td className="py-4 px-6 font-semibold text-gray-900">{fazenda.nome}</td>
                                    <td className="py-4 px-6">
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                          {fazenda.localizacao}
                      </span>
                                    </td>
                                    <td className="py-4 px-6">
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <Maximize2 className="w-4 h-4 text-emerald-600" />
                          {fazenda.areaHectares.toLocaleString('pt-BR')} ha
                      </span>
                                    </td>
                                    <td className="py-4 px-6 text-right space-x-2">
                                        <button
                                            onClick={() => abrirModal(fazenda)}
                                            className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                            title="Editar"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => fazenda.id && handleDeletar(fazenda.id)}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                            title="Excluir"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal de Cadastro/Edição */}
            {modalAberto && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-800">
                                {fazendaEdicao ? 'Editar Fazenda' : 'Cadastrar Nova Fazenda'}
                            </h2>
                            <button
                                onClick={() => setModalAberto(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-200/50 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSalvar} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                    Nome da Propriedade
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Ex: Fazenda Santa Maria"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                    Localização / Município
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={localizacao}
                                    onChange={(e) => setLocalizacao(e.target.value)}
                                    placeholder="Ex: Luís Eduardo Magalhães - BA"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                    Área Total (Hectares)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    required
                                    value={areaHectares}
                                    onChange={(e) => setAreaHectares(e.target.value)}
                                    placeholder="Ex: 500"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setModalAberto(false)}
                                    className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={salvando}
                                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                                >
                                    {salvando && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {fazendaEdicao ? 'Atualizar' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};