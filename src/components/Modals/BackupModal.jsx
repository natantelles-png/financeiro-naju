import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { X, Download, Upload, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BackupModal({ onClose }) {
  const { exportDataJson, importDataJson, resetAllData } = useFinance();
  const [importText, setImportText] = useState('');
  const [msg, setMsg] = useState('');
  const [isError, setIsError] = useState(false);

  const handleExport = () => {
    const json = exportDataJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financeiro-naju-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg('Backup exportado com sucesso em arquivo JSON!');
    setIsError(false);
  };

  const handleCopyClipboard = () => {
    const json = exportDataJson();
    navigator.clipboard.writeText(json);
    setMsg('Dados copiados para a área de transferência!');
    setIsError(false);
  };

  const handleImport = () => {
    if (!importText.trim()) {
      setMsg('Cole o conteúdo do backup JSON para importar.');
      setIsError(true);
      return;
    }

    const res = importDataJson(importText);
    if (res.success) {
      setMsg('Dados importados e restaurados com sucesso!');
      setIsError(false);
      setTimeout(() => onClose(), 1500);
    } else {
      setMsg(`Erro ao importar: ${res.error}`);
      setIsError(true);
    }
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja redefinir os dados para os valores originais do Manual? Todas as alterações serão restauradas.')) {
      resetAllData();
      setMsg('Dados redefinidos com sucesso para o estado inicial!');
      setIsError(false);
      setTimeout(() => onClose(), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-black text-white">Backup e Segurança dos Dados</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {msg && (
          <div
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              isError
                ? 'bg-rose-950/50 border-rose-800 text-rose-300'
                : 'bg-emerald-950/50 border-emerald-800 text-emerald-300'
            }`}
          >
            {isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{msg}</span>
          </div>
        )}

        {/* Seção de Exportação */}
        <div className="space-y-2 text-xs">
          <span className="font-bold text-slate-300">1. Exportar Dados Atuais</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExport}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Baixar Arquivo JSON</span>
            </button>
            <button
              onClick={handleCopyClipboard}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 transition flex items-center justify-center gap-1.5"
            >
              <span>Copiar Texto JSON</span>
            </button>
          </div>
        </div>

        {/* Seção de Importação */}
        <div className="space-y-2 text-xs pt-2 border-t border-slate-800">
          <span className="font-bold text-slate-300">2. Restaurar Backup</span>
          <textarea
            rows="3"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Cole o JSON de backup aqui..."
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-[10px] focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleImport}
            className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center justify-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Restaurar Backup Informado</span>
          </button>
        </div>

        {/* Redefinição Geral */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Restaurar dados originais do Manual</span>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 font-semibold transition flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetar Fábrica</span>
          </button>
        </div>
      </div>
    </div>
  );
}
