import React, { useEffect, useState } from 'react';
import { leituraService } from '../services/leituraService';
import { dispositivoService } from '../services/dispositivoService';
import type { Leitura } from '../types/Leitura';
import type { Dispositivo } from '../types/Dispositivo';
import { Plus, Trash2, Activity, Calendar, Cpu, Thermometer, Droplets, FlaskConical, Loader2, X } from 'lucide-react';

/**
 * Página para acompanhamento e registro do histórico de telemetria dos sensores.
 */
export const LeiturasPage: React.FC = () => {
    const [leituras, setLeituras] = useState<Leitura[]>([]);
    const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [salvando, setSalvando] = useState<boolean>(false);
    const [modalAberto, setModalAberto] = useState<boolean>(false);

    // Estados do formulário
    const [phSolo, setPhSolo] = useState<string>('');
    const [umidadeSolo, setUmidadeSolo] = useState<string>('');
    const [temperaturaAr, setTemperaturaAr] = useState<string>('');
    const [dataHoraCaptura, setDataHoraCaptura] = useState<string>('');
    const [dispositivoId, setDispositivoId] = useState<string>('');

    /**
     * Carrega o histórico de leituras e a lista de dispositivos ativos.
     */
    const carregarDados = async () => {
        try {
            setCarregando(true);
            const [dadosLeituras, dadosDispositivos] = await Promise.all([
                leituraService.listarTodas(),
                dispositivoService.listarTodos(),
            ]);
            setLeituras(dadosLeituras);
            setDispositivos(dadosDispositivos);
        } catch (error) {
            console.error('Erro ao carregar telemetria:', error);
            alert('Erro ao carregar os dados de telemetria do backend.');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    /**
     * Prepara o modal para registrar uma nova captura de telemetria.
     */
    const abrirModal = () => {
        setPhSolo('6.5');
        setUmidadeSolo('45.0');
        setTemperaturaAr('28.5');
        // Preenche com a data/hora atual no formato ISO exigido pelo input datetime-local
        const agora = new Date();
        agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
        setDataHoraCaptura(agora.toISOString().slice(0, 16));

        setDispositivoId(dispositivos.length > 0 && dispositivos[0].id ? dispositivos[0].id.toString() : '');
        setModalAberto(true);
    };

    /**
     * Submete o novo registro de telemetria.
     */
    const handleSalvar = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!phSolo || !umidadeSolo || !temperaturaAr || !dataHoraCaptura || !dispositivoId) {
            alert('Preencha todos os campos da medição.');
            return;
        }

        const dispositivoSelecionado = dispositivos.find((d) => d.id === parseInt(dispositivoId));

        const payload: Leitura = {
            phSolo: parseFloat(phSolo),
            umidadeSolo: parseFloat(umidadeSolo),
            temperaturaAr: parseFloat(temperaturaAr),
            dataHoraCaptura,
            dispositivo: dispositivoSelecionado,
        };

        try {
            setSalvando(true);
            await leituraService.registrar(payload);
            setModalAberto(false);
            await carregarDados();
        } catch (error) {
            console.error('Erro ao registrar leitura:', error);
            alert('Erro ao gravar os dados de telemetria.');
        } finally {
            setSalvando(false);
        }
    };

    /**
     * Remove um registro de telemetria.
     */
    const handleDeletar = async (id: number) => {
        if (confirm('Deseja excluir este registro de telemetria?')) {
            try {
                await leituraService.deletar(id);
                await carregarDados();
            } catch (error) {
                console.error('Erro ao remover leitura:', error);
                alert('Não foi possível excluir a medição.');
            }
        }
    };

    /**
     * Formata a string de data/hora para o padrão legível pt-BR.
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
                        <Activity className="w-7 h-7 text-emerald-600" />
                        Histórico de Telemetria
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Consulte as leituras ambientais e do solo transmitidas pelos dispositivos.
                    </p>
                </div>
                <button
                    onClick={abrirModal}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg transition-colors font-medium text-sm shadow-sm cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Registrar Leitura
                </button>
            </div>

            {/* Tabela de Leituras */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {carregando ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
                        <p className="text-sm">Carregando dados de telemetria...</p>
                    </div>
                ) : leituras.length === 0 ? (
                    <div className="text-center py-16 text-gray-500 space-y-3">
                        <Activity className="w-12 h-12 text-gray-300 mx-auto" />
                        <p className="font-medium text-base">Nenhuma leitura registrada.</p>
                        <p className="text-xs text-gray-400">Clique no botão acima para simular a primeira captura de dados.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold uppercase text-xs">
                                <th className="py-4 px-6">ID</th>
                                <th className="py-4 px-6">Data & Hora Captura</th>
                                <th className="py-4 px-6">Equipamento Sensor</th>
                                <th className="py-4 px-6">pH do Solo</th>
                                <th className="py-4 px-6">Umidade do Solo</th>
                                <th className="py-4 px-6">Temp. Ar</th>
                                <th className="py-4 px-6 text-right">Ações</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                            {leituras.map((leitura) => (
                                <tr key={leitura.id} className="hover:bg-emerald-50/40 transition-colors">
                                    <td className="py-4 px-6 font-mono text-xs text-gray-400">#{leitura.id}</td>
                                    <td className="py-4 px-6">
                      <span className="flex items-center gap-1.5 font-medium text-gray-800">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                          {formatarDataHora(leitura.dataHoraCaptura)}
                      </span>
                                    </td>
                                    <td className="py-4 px-6">
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <Cpu className="w-4 h-4 text-emerald-600" />
                          {leitura.dispositivo?.nomeModelo || 'Sensor Indefinido'}
                      </span>
                                    </td>
                                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                        <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
                          {leitura.phSolo.toFixed(1)}
                      </span>
                                    </td>
                                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md">
                        <Droplets className="w-3.5 h-3.5 text-blue-600" />
                          {leitura.umidadeSolo.toFixed(1)}%
                      </span>
                                    </td>
                                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md">
                        <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                          {leitura.temperaturaAr.toFixed(1)}°C
                      </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button
                                            onClick={() => leitura.id && handleDeletar(leitura.id)}
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

            {/* Modal de Nova Leitura */}
            {modalAberto && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-800">Registrar Leitura de Telemetria</h2>
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
                                    Equipamento Sensor
                                </label>
                                <select
                                    value={dispositivoId}
                                    onChange={(e) => setDispositivoId(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
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
                                    Data e Hora da Captura
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={dataHoraCaptura}
                                    onChange={(e) => setDataHoraCaptura(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                        pH Solo
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="14"
                                        required
                                        value={phSolo}
                                        onChange={(e) => setPhSolo(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                        Umidade (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="100"
                                        required
                                        value={umidadeSolo}
                                        onChange={(e) => setUmidadeSolo(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                        Temp. (°C)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        required
                                        value={temperaturaAr}
                                        onChange={(e) => setTemperaturaAr(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
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
                                    Salvar Leitura
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};