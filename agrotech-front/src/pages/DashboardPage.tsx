import React, { useEffect, useState } from 'react';
import { fazendaService } from '../services/fazendaService';
import { dispositivoService } from '../services/dispositivoService';
import { leituraService } from '../services/leituraService';
import { alertaService } from '../services/alertaService';
import type { Fazenda } from '../types/Fazenda';
import type { Dispositivo } from '../types/Dispositivo';
import type { Leitura } from '../types/Leitura';
import type { Alerta } from '../types/Alerta';
import {
    Tractor,
    Cpu,
    Activity,
    AlertTriangle,
    CheckCircle2,
    Loader2,
    TrendingUp,
    Clock,
    ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Página inicial (Dashboard) com a visão geral do sistema Agrotech.
 * Apresenta indicadores-chave (KPIs), métricas consolidadas e atalhos rápidos.
 */
export const DashboardPage: React.FC = () => {
    const [fazendas, setFazendas] = useState<Fazenda[]>([]);
    const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
    const [leituras, setLeituras] = useState<Leitura[]>([]);
    const [alertas, setAlertas] = useState<Alerta[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);

    /**
     * Consolida a busca de todas as entidades do sistema para os KPIs.
     */
    const carregarDashboard = async () => {
        try {
            setCarregando(true);
            const [fData, dData, lData, aData] = await Promise.all([
                fazendaService.listarTodas(),
                dispositivoService.listarTodos(),
                leituraService.listarTodas(),
                alertaService.listarTodos(),
            ]);
            setFazendas(fData);
            setDispositivos(dData);
            setLeituras(lData);
            setAlertas(aData);
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarDashboard();
    }, []);

    // Cálculos de métricas agregadas
    const totalHectares = fazendas.reduce((acc, f) => acc + (f.areaHectares || 0), 0);
    const dispositivosAtivos = dispositivos.filter((d) => d.status === 'ATIVO').length;
    const alertasPendentes = alertas.filter((a) => !a.resolvido).length;
    const ultimasLeituras = [...leituras].reverse().slice(0, 5);
    const ultimosAlertas = [...alertas].filter((a) => !a.resolvido).reverse().slice(0, 5);

    if (carregando) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-3" />
                <p className="text-sm font-medium">Carregando indicadores do campo...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Cabeçalho */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Visão Geral do Campo</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Acompanhamento consolidado de propriedades, ativos IoT, telemetria e ocorrências.
                </p>
            </div>

            {/* Cards de KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Card Fazendas */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase text-gray-400">Propriedades</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{fazendas.length}</h3>
                        <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" /> {totalHectares.toLocaleString('pt-BR')} ha monitorados
                        </p>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Tractor className="w-6 h-6" />
                    </div>
                </div>

                {/* Card Dispositivos */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase text-gray-400">Equipamentos IoT</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{dispositivos.length}</h3>
                        <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> {dispositivosAtivos} ativos no momento
                        </p>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Cpu className="w-6 h-6" />
                    </div>
                </div>

                {/* Card Telemetria */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase text-gray-400">Total de Leituras</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{leituras.length}</h3>
                        <p className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Histórico acumulado
                        </p>
                    </div>
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <Activity className="w-6 h-6" />
                    </div>
                </div>

                {/* Card Alertas */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase text-gray-400">Alertas Pendentes</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{alertasPendentes}</h3>
                        <p
                            className={`text-xs font-medium mt-1 ${
                                alertasPendentes > 0 ? 'text-amber-600' : 'text-emerald-600'
                            }`}
                        >
                            {alertasPendentes > 0 ? 'Requer atenção operacional' : 'Nenhum risco detectado'}
                        </p>
                    </div>
                    <div
                        className={`p-3 rounded-xl ${
                            alertasPendentes > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                        }`}
                    >
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Seção de Resumos Recentes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Painel de Últimas Leituras */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-emerald-600" />
                            Últimas Medições Recebidas
                        </h2>
                        <Link
                            to="/leituras"
                            className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 transition-colors"
                        >
                            Ver todas <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {ultimasLeituras.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">Nenhuma medição gravada ainda.</p>
                    ) : (
                        <div className="space-y-3">
                            {ultimasLeituras.map((leitura) => (
                                <div
                                    key={leitura.id}
                                    className="flex items-center justify-between p-3.5 bg-gray-50 rounded-lg border border-gray-100 text-xs"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {leitura.dispositivo?.nomeModelo || 'Sensor Desconhecido'}
                                        </p>
                                        <p className="text-gray-500 mt-0.5">
                                            pH: <strong className="text-emerald-700">{leitura.phSolo}</strong> | Umidade:{' '}
                                            <strong className="text-blue-700">{leitura.umidadeSolo}%</strong> | Temp:{' '}
                                            <strong className="text-amber-700">{leitura.temperaturaAr}°C</strong>
                                        </p>
                                    </div>
                                    <span className="font-mono text-gray-400">
                    {new Date(leitura.dataHoraCaptura).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                  </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Painel de Alertas Ativos */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                            Alertas Ativos
                        </h2>
                        <Link
                            to="/alertas"
                            className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 transition-colors"
                        >
                            Central completa <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {ultimosAlertas.length === 0 ? (
                        <div className="text-center py-8 text-emerald-600 space-y-1">
                            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                            <p className="text-sm font-medium">Sem alertas ativos!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {ultimosAlertas.map((alerta) => (
                                <div
                                    key={alerta.id}
                                    className="flex items-center justify-between p-3.5 bg-amber-50/50 rounded-lg border border-amber-100 text-xs"
                                >
                                    <div>
                    <span className="font-bold text-amber-900 uppercase tracking-wide text-[10px] bg-amber-100 px-2 py-0.5 rounded">
                      {alerta.severidade}
                    </span>
                                        <p className="font-medium text-gray-800 mt-1.5">{alerta.descricao}</p>
                                    </div>
                                    <span className="text-gray-400 font-mono text-[11px]">
                    {alerta.dispositivo?.nomeModelo}
                  </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};