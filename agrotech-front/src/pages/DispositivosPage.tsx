import React, { useEffect, useState } from 'react';
import { dispositivoService } from '../services/dispositivoService';
import { fazendaService } from '../services/fazendaService';
import type { Dispositivo } from '../types/Dispositivo';
import type { Fazenda } from '../types/Fazenda';
import { Plus, Pencil, Trash2, Cpu, Calendar, Tractor, Loader2, X, CheckCircle, AlertCircle, Wrench } from 'lucide-react';

/**
 * Página para gerenciamento de equipamentos IoT e sensores de campo.
 */
export const DispositivosPage: React.FC = () => {
    const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
    const [fazendas, setFazendas] = useState<Fazenda[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [salvando, setSalvando] = useState<boolean>(false);
    const [modalAberto, setModalAberto] = useState<boolean>(false);
    const [dispositivoEdicao, setDispositivoEdicao] = useState<Dispositivo | null>(null);

    // Estados do formulário
    const [nomeModelo, setNomeModelo] = useState<string>('');
    const [dataInstalacao, setDataInstalacao] = useState<string>('');
    const [status, setStatus] = useState<'ATIVO' | 'INATIVO' | 'MANUTENCAO'>('ATIVO');
    const [fazendaId, setFazendaId] = useState<string>('');

    /**
     * Busca a lista de dispositivos e fazendas no backend.
     */
    const carregarDados = async () => {
        try {
            setCarregando(true);
            const [dadosDispositivos, dadosFazendas] = await Promise.all([
                dispositivoService.listarTodos(),
                fazendaService.listarTodas(),
            ]);
            setDispositivos(dadosDispositivos);
            setFazendas(dadosFazendas);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            alert('Erro ao carregar equipamentos ou fazendas do backend.');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    /**
     * Prepara o modal para criação ou edição de dispositivo.
     */
    const abrirModal = (dispositivo: Dispositivo | null = null) => {
        if (dispositivo) {
            setDispositivoEdicao(dispositivo);
            setNomeModelo(dispositivo.nomeModelo);
            setDataInstalacao(dispositivo.dataInstalacao);
            setStatus(dispositivo.status);
            setFazendaId(dispositivo.fazenda?.id ? dispositivo.fazenda.id.toString() : '');
        } else {
            setDispositivoEdicao(null);
            setNomeModelo('');
            setDataInstalacao(new Date().toISOString().split('T')[0]); // Data atual
            setStatus('ATIVO');
            setFazendaId(fazendas.length > 0 && fazendas[0].id ? fazendas[0].id.toString() : '');
        }
        setModalAberto(true);
    };

    /**
     * Processa o salvamento/atualização do dispositivo.
     */
    const handleSalvar = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nomeModelo.trim() || !dataInstalacao || !fazendaId) {
            alert('Preencha todos os campos obrigatórios.');
            return;
        }

        const fazendaSelecionada = fazendas.find((f) => f.id === parseInt(fazendaId));

        const payload: Dispositivo = {
            nomeModelo,
            dataInstalacao,
            status,
            fazenda: fazendaSelecionada,
        };

        try {
            setSalvando(true);
            if (dispositivoEdicao && dispositivoEdicao.id) {
                await dispositivoService.atualizar(dispositivoEdicao.id, payload);
            } else {
                await dispositivoService.cadastrar(payload);
            }
            setModalAberto(false);
            await carregarDados();
        } catch (error) {
            console.error('Erro ao salvar dispositivo:', error);
            alert('Erro ao salvar o equipamento.');
        } finally {
            setSalvando(false);
        }
    };

    /**
     * Remove um dispositivo cadastrado.
     */
    const handleDeletar = async (id: number) => {
        if (confirm('Deseja realmente remover este dispositivo?')) {
            try {
                await dispositivoService.deletar(id);
                await carregarDados();
            } catch (error) {
                console.error('Erro ao remover dispositivo:', error);
                alert('Não foi possível excluir o equipamento.');
            }
        }
    };

    /**
     * Helper visual para renderizar a badge de status do dispositivo.
     */
    const renderBadgeStatus = (st: 'ATIVO' | 'INATIVO' | 'MANUTENCAO') => {
        switch (st) {
            case 'ATIVO':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-3.5 h-3.5" /> Ativo
          </span>
                );
            case 'INATIVO':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <AlertCircle className="w-3.5 h-3.5" /> Inativo
          </span>
                );
            case 'MANUTENCAO':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Wrench className="w-3.5 h-3.5" /> Manutenção
          </span>
                );
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Cabeçalho */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Cpu className="w-7 h-7 text-emerald-600" />
                        Equipamentos IoT
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Gerencie e vincule sensores às fazendas para coleta de dados de telemetria.
                    </p>
                </div>
                <button
                    onClick={() => abrirModal()}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg transition-colors font-medium text-sm shadow-sm cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Novo Dispositivo
                </button>
            </div>

            {/* Tabela de Dispositivos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {carregando ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
                        <p className="text-sm">Carregando equipamentos...</p>
                    </div>
                ) : dispositivos.length === 0 ? (
                    <div className="text-center py-16 text-gray-500 space-y-3">
                        <Cpu className="w-12 h-12 text-gray-300 mx-auto" />
                        <p className="font-medium text-base">Nenhum equipamento cadastrado.</p>
                        <p className="text-xs text-gray-400">Adicione um novo dispositivo IoT para começar o monitoramento.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold uppercase text-xs">
                                <th className="py-4 px-6">ID</th>
                                <th className="py-4 px-6">Modelo / Identificador</th>
                                <th className="py-4 px-6">Fazenda Vinculada</th>
                                <th className="py-4 px-6">Data de Instalação</th>
                                <th className="py-4 px-6">Status Operacional</th>
                                <th className="py-4 px-6 text-right">Ações</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                            {dispositivos.map((dispositivo) => (
                                <tr key={dispositivo.id} className="hover:bg-emerald-50/40 transition-colors">
                                    <td className="py-4 px-6 font-mono text-xs text-gray-400">#{dispositivo.id}</td>
                                    <td className="py-4 px-6 font-semibold text-gray-900">{dispositivo.nomeModelo}</td>
                                    <td className="py-4 px-6">
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <Tractor className="w-4 h-4 text-emerald-600" />
                          {dispositivo.fazenda?.nome || 'Sem Fazenda'}
                      </span>
                                    </td>
                                    <td className="py-4 px-6">
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                          {dispositivo.dataInstalacao}
                      </span>
                                    </td>
                                    <td className="py-4 px-6">{renderBadgeStatus(dispositivo.status)}</td>
                                    <td className="py-4 px-6 text-right space-x-2">
                                        <button
                                            onClick={() => abrirModal(dispositivo)}
                                            className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                            title="Editar"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => dispositivo.id && handleDeletar(dispositivo.id)}
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
                                {dispositivoEdicao ? 'Editar Dispositivo' : 'Cadastrar Novo Dispositivo'}
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
                                    Modelo / Nome do Sensor
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={nomeModelo}
                                    onChange={(e) => setNomeModelo(e.target.value)}
                                    placeholder="Ex: Sensor pH Solo DHT22"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                    Fazenda Vinculada
                                </label>
                                <select
                                    value={fazendaId}
                                    onChange={(e) => setFazendaId(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                                >
                                    {fazendas.length === 0 ? (
                                        <option value="">Nenhuma fazenda cadastrada</option>
                                    ) : (
                                        fazendas.map((f) => (
                                            <option key={f.id} value={f.id}>
                                                {f.nome} ({f.localizacao})
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                    Data de Instalação
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={dataInstalacao}
                                    onChange={(e) => setDataInstalacao(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                    Status Operacional
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as 'ATIVO' | 'INATIVO' | 'MANUTENCAO')}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                                >
                                    <option value="ATIVO">Ativo</option>
                                    <option value="INATIVO">Inativo</option>
                                    <option value="MANUTENCAO">Em Manutenção</option>
                                </select>
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
                                    {dispositivoEdicao ? 'Atualizar' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};