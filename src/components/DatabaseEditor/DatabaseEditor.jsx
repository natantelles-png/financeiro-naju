import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Database, Save, AlertTriangle, CheckCircle } from 'lucide-react';

export default function DatabaseEditor() {
  const { data, exportDataJson, importDataJson } = useFinance();
  const [jsonText, setJsonText] = useState(() => exportDataJson());
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

  const handleSave = () => {
    const result = importDataJson(jsonText);
    if (result.success) {
      setStatus({ type: 'success', message: 'Banco de dados atualizado com sucesso!' });
      setTimeout(() => setStatus(null), 3000);
    } else {
      setStatus({ type: 'error', message: `Erro ao salvar: ${result.error}` });
    }
  };

  const handleReset = () => {
    setJsonText(exportDataJson());
    setStatus(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Editor de Banco de Dados</h2>
            <p className="text-xs text-slate-400">
              Aqui você pode visualizar e editar diretamente toda a base de dados do aplicativo.
              Tenha muito cuidado ao alterar a estrutura JSON.
            </p>
          </div>
        </div>

        {status && (
          <div className={`p-4 rounded-xl mb-4 text-sm font-medium flex items-center gap-2 ${
            status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span>{status.message}</span>
          </div>
        )}

        <div className="relative">
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="w-full h-[500px] bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-300 font-mono text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-y"
            spellCheck="false"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl text-slate-400 font-medium hover:bg-slate-800 transition"
          >
            Descartar Alterações
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-lg shadow-indigo-600/20"
          >
            <Save className="w-4 h-4" />
            Salvar Banco de Dados
          </button>
        </div>
      </div>
    </div>
  );
}
