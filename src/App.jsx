import React, { useState, useEffect } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import Navbar from './components/Navbar';
import QuickDailyView from './components/Dashboard/QuickDailyView';
import KpiCards from './components/Dashboard/KpiCards';
import Semaforo from './components/Dashboard/Semaforo';
import QuickQuestions from './components/Dashboard/QuickQuestions';
import CanISpendThis from './components/Simulator/CanISpendThis';
import InvoiceChart from './components/CardsAndInvoices/InvoiceChart';
import InvoiceTable from './components/CardsAndInvoices/InvoiceTable';
import TransitionPlan from './components/CardsAndInvoices/TransitionPlan';
import EntrepreneurDashboard from './components/Entrepreneurship/EntrepreneurDashboard';
import PuddingCalculator from './components/Entrepreneurship/PuddingCalculator';
import BiweeklyView from './components/Cashflow/BiweeklyView';
import WeeklyBudgetTracker from './components/Cashflow/WeeklyBudgetTracker';
import UpcomingBills from './components/Cashflow/UpcomingBills';
import SubscriptionsAudit from './components/Subscriptions/SubscriptionsAudit';
import WeeklyMeetingGuide from './components/WeeklyMeeting/WeeklyMeetingGuide';
import BackupModal from './components/Modals/BackupModal';
import { ShieldCheck, Heart, Mic, Zap } from 'lucide-react';

import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Login from './components/Auth/Login';
import { PWAInstallButton } from './components/PWAInstallButton';

const ALLOWED_EMAILS = [
  'natantelles@gmail.com',
  'juliapires.contas@gmail.com'
];

function AppContent({ user }) {
  const [appMode, setAppMode] = useState('DAILY'); // 'DAILY' (Modo Rápido Limpo) ou 'FULL' (Modo Estratégico Completo)
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showBackupModal, setShowBackupModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white pb-16">
      {/* Navbar Superior com Seletor de Modo */}
      <Navbar
        appMode={appMode}
        setAppMode={setAppMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBackup={() => setShowBackupModal(true)}
      />

      {/* Conteúdo Central */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        
        {/* PWA Install Button when applicable */}
        <div className="flex justify-end mb-4">
          <PWAInstallButton />
        </div>

        {/* Se estiver no MODO DIÁRIO RÁPIDO */}
        {appMode === 'DAILY' ? (
          <QuickDailyView
            onSwitchToFullMode={() => setAppMode('FULL')}
            onNavigateToSimulator={() => {
              setAppMode('FULL');
              setActiveTab('simulator');
            }}
          />
        ) : (
          /* Se estiver no MODO COMPLETO / ESTRATÉGICO */
          <div className="space-y-6 animate-fadeIn">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <KpiCards />
                <Semaforo />
                <QuickQuestions
                  onNavigateToSimulator={() => setActiveTab('simulator')}
                  onNavigateToCards={() => setActiveTab('cards')}
                  onNavigateToEntrepreneur={() => setActiveTab('entrepreneur')}
                />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7">
                    <InvoiceChart />
                  </div>
                  <div className="lg:col-span-5">
                    <WeeklyBudgetTracker />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'simulator' && <CanISpendThis />}

            {activeTab === 'cards' && (
              <div className="space-y-6">
                <InvoiceChart />
                <TransitionPlan />
                <InvoiceTable />
              </div>
            )}

            {activeTab === 'entrepreneur' && <EntrepreneurDashboard />}

            {activeTab === 'pudding' && <PuddingCalculator />}

            {activeTab === 'cashflow' && (
              <div className="space-y-6">
                <BiweeklyView />
                <UpcomingBills />
              </div>
            )}

            {activeTab === 'weeklyBudget' && <WeeklyBudgetTracker />}

            {activeTab === 'subscriptions' && <SubscriptionsAudit />}

            {activeTab === 'weeklyMeeting' && <WeeklyMeetingGuide />}
          </div>
        )}
      </main>

      {/* Footer com Selo de Blindagem */}
      <footer className="max-w-7xl mx-auto px-4 mt-auto pt-6 border-t border-slate-900 w-full flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>
            Financeiro NaJu • Reserva Rescisão Natan: <strong>R$ 10.000 Blindada</strong>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-slate-400">
            <span>Construído para a liberdade financeira de Júlia & Natan</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline" />
          </div>
          <button onClick={() => signOut(auth)} className="text-slate-500 hover:text-slate-300 underline">
            Sair
          </button>
        </div>
      </footer>

      {/* Modal de Backup */}
      {showBackupModal && <BackupModal onClose={() => setShowBackupModal(false)} />}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        if (!currentUser.email || !ALLOWED_EMAILS.includes(currentUser.email.toLowerCase())) {
          await signOut(auth);
          setUser(null);
        } else {
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <FinanceProvider>
      <AppContent user={user} />
    </FinanceProvider>
  );
}

