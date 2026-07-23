import React, { useEffect, useState } from 'react';
import { alertaService } from '../services/alertaService';
import { dispositivoService } from '../services/dispositivoService';
import type { Alerta } from '../types/Alerta';
import type { Dispositivo } from '../types/Dispositivo';
import { AlertTriangle, Plus, Trash2, Check, Calendar, Cpu, ShieldAlert, CheckCircle2, Loader2, X } from 'lucide-react';

/**
 * Página para monitoramento e gestão da central de alertas e anomalias do campo.
 */
export const AlertasPage: React.FC = () => {
    const [alertas, setAlertas] = useState<Alerta[]>([]);
    const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [salvando, setSalvando] = useState<boolean>(false);
    const [modalAberto, setModalAberto] = useState<boolean>(false);

    // Estados do formulário
    const [descricao, setDescricao] = useState<string>('');
    const [severidade, setSeveridade] = useState<'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA'>('MEDIA');
    const [dispositivoId, setDispositivoId] = useState<string>('');

    /**
     * Carrega os alertas e a lista de equipamentos cadastrados.
     */
    const carregarDados = async () => {
        try {
            setCarregando(true);
            const [dadosAlertas, dadosDispositivos] = await Promise.all([
                alertaService.listarTodos(),
                dispositivoService.listarTodos(),
            ]);
            setAlertas(dadosAlertas);
            setDispositivos(dadosDispositivos);
        } catch (error) {
            console.error('Erro ao carregar alertas:', error);
            alert('Erro ao carregar a central de alertas do backend.');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    /**
     * Prepara o modal para disparar uma nova ocorrência de alerta.
     */
    const abrirModal = () => {
        setDescricao('');
        setSeveridade('MEDIA');
        setDispositivoId(dispositivos.length > 0 && dispositivos[0].id ? dispositivos[0].id.toString() : '');
        setModalAberto(true);
    };

    /**
     * Registra uma nova anomalia no sistema.
     */
    const handleSalvar = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!descricao.trim() || !dispositivoId) {
            alert('Preencha a descrição do alerta e selecione o dispositivo.');
            return;
        }

        const dispositivoSelecionado = dispositivos.find((d) => d.id === parseInt(dispositivoId));

        const payload: Alerta = {
            descricao,
            severidade,
            dataHoraDisparo: new Date().toISOString(),
            resolvido: false,
            dispositivo: dispositivoSelecionado,
        };

        try {
            setSalvando(true);
            await alertaService.disparar(payload);
            setModalAberto(false);
            await carregarDados();
        } catch (error) {
            console.error('Erro ao disparar alerta:', error);
            alert('Erro ao registrar a anomalia.');
        } finally {
            setSalvando(false);
        }
    };

    /**
     * Altera o estado do alerta para resolvido no backend.
     */
    const handleMarcarComoResolvido = async (alerta: Alerta) => {
        if (!alerta.id) return;

        try {
            const alertaAtualizado: Alerta = {
                ...alerta,
                resolvido: true,
            };
            await alertaService.atualizar(alerta.id, alertaAtualizado);
            await carregarDados();
        } catch (error) {
            console.error('Erro ao resolver alerta:', error);
            alert('Não foi possível atualizar o status do alerta.');
        }
    };

    /**
     * Exclui um alerta do histórico.
     */
    const handleDeletar = async (id: number) => {
        if (confirm('Deseja realmente excluir este evento de alerta?')) {
            try {
                await alertaService.deletar(id);
                await carregarDados();
            } catch (error) {
                console.error('Erro ao remover alerta:', error);
                alert('Não foi possível excluir o alerta.');
            }
        }
    };

    /**
     * Helper visual para a tag de severidade do alerta.
     */
    const renderBadgeSeveridade = (sev: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA') => {
        const estilos = {
            BAIXA: 'bg-blue-100 text-blue-800 border-blue-200',
            MEDIA: 'bg-amber-100 text-amber-800 border-amber-200',
            ALTA: 'bg-orange-100 text-orange-800 border-orange-200',
            CRITICA: 'bg-red-100 text-red-800 border-red-200 animate-pulse',
        };

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${estilos[sev]}`}>
        <ShieldAlert className="w-3.5 h-3.5" /> {sev}
      </span>
        );
    };

    /**
     * Helper de formatação de data e hora em português.
     */
    const formatarDataHora = (isoString: string) => {
        try {
            const data = new Date(isoString);
            return data.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return isoString;
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Cabeçalho */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <AlertTriangle className="w-7 h-7 text-amber-600" />
                        Central de Alertas & Anomalias
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Acompanhe ocorrências, falhas e desvios operacionais detectados no campo.
                    </p>
                </div>
                <button
                    onClick={abrirModal}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg transition-colors font-medium text-sm shadow-sm cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Novo Alerta
                </button>
            </div>

            {/* Tabela de Alertas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {carregando ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-600 mb-2" />
                        <p className="text-sm">Carregando central de alertas...</p>
                    </div>
                ) : alertas.length === 0 ? (
                    <div className="text-center py-16 text-gray-500 space-y-3">
                        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                        <p className="font-medium text-base text-gray-700">Nenhum alerta pendente!</p>
                        <p className="text-xs text-gray-400">Todos os sistemas e sensores estão operando dentro da normalidade.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold uppercase text-xs">
                                <th className="py-4 px-6">ID</th>
                                <th className="py-4 px-6">Data & Hora Disparo</th>
                                <th className="py-4 px-6">Equipamento Sensor</th>
                                <th className="py-4 px-6">Descrição da Ocorrência</th>
                                <th className="py-4 px-6">Severidade</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-right">Ações</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                            {alertas.map((alerta) => (
                                <tr
                                    key={alerta.id}
                                    className={`hover:bg-amber-50/30 transition-colors ${
                                        alerta.resolvido ? 'opacity-60 bg-gray-50/50' : ''
                                    }`}
                                >
                                    <td className="py-4 px-6 font-mono text-xs text-gray-400">#{alerta.id}</td>
                                    <td className="py-4 px-6">
                      <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                        <Calendar className="w-4 h-4 text-amber-600" />
                          {formatarDataHora(alerta.dataHoraDisparo)}
                      </span>
                                    </td>
                                    <td className="py-4 px-6">
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <Cpu className="w-4 h-4 text-amber-600" />
                          {alerta.dispositivo?.nomeModelo || 'Sensor Geral'}
                      </span>
                                    </td>
                                    <td className="py-4 px-6 font-medium text-gray-900">{alerta.descricao}</td>
                                    <td className="py-4 px-6">{renderBadgeSeveridade(alerta.severidade)}</td>
                                    <td className="py-4 px-6">
                                        {alerta.resolvido ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Resolvido
                        </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                          Pendente
                        </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-right space-x-2">
                                        {!alerta.resolvido && (
                                            <button
                                                onClick={() => handleMarcarComoResolvido(alerta)}
                                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                                title="Marcar como Resolvido"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => alerta.id && handleDeletar(alerta.id)}
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

            {/* Modal de Disparo de Alerta */}
            {modalAberto && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-800">Disparar Alerta Manual</h2>
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
                                    Equipamento Afetado
                                </label>
                                <select
                                    value={dispositivoId}
                                    onChange={(e) => setDispositivoId(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                                >
                                    {dispositivos.length === 0 ? (
                                        <option value="">Nenhum equipamento cadastrado</option>
                                    ) : (
                                        dispositivos.map((d) => (
                                            <option key={d.id} value={d.id}>
                                                {d.nomeModelo} ({d.fazenda?.nome || 'Sem Fazenda'})
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                    Nível de Severidade
                                </label>
                                <select
                                    value={severidade}
                                    onChange={(e) =>
                                        setSeveridade(e.target.value as 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA')
                                    }
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                                >
                                    <option value="BAIXA">Baixa</option>
                                    <option value="MEDIA">Média</option>
                                    <option value="ALTA">Alta</option>
                                    <option value="CRITICA">Crítica</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                    Descrição do Problema / Anomalia
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    placeholder="Ex: Nível de umidade crítico detectado no setor norte."
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
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
                                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                                >
                                    {salvando && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Disparar Alerta
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};