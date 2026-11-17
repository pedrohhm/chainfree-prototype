import { useState } from 'react';
import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Home, BookOpen, ClipboardList, Brain, Dumbbell, TrendingUp, Timer, HelpCircle, BookMarked, LogOut, Crown, UserCircle, Menu, X, FileEdit } from 'lucide-react';
import { Button } from './ui/button';
import { useApp } from '../context/AppContext';

export default function PatientLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userName, userType, isRestoringSession, signOut } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  if (isRestoringSession) return <p className="p-4" role="status">Verificando sessão…</p>;
  if (userType !== 'patient') return <Navigate to="/" replace />;

  const handleLogout = async () => {
    setLogoutError('');
    setIsSigningOut(true);
    try {
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : 'Não foi possível sair.');
    } finally {
      setIsSigningOut(false);
    }
  };

  const menuItems = [
    { icon: Home, label: 'Início', path: '/patient/dashboard' },
    { icon: BookOpen, label: 'Psicoeducação', path: '/patient/psychoeducation' },
    { icon: ClipboardList, label: 'Escala DY-BOCS', path: '/patient/ybocs' },
    { icon: Brain, label: 'Mapeamento', path: '/patient/mapping' },
    { icon: Dumbbell, label: 'Exercícios EPR', path: '/patient/epr' },
    { icon: TrendingUp, label: 'Progresso', path: '/patient/progress' },
    { icon: Timer, label: 'Temporizador', path: '/patient/timer' },
    { icon: HelpCircle, label: 'Perguntas', path: '/patient/questions' },
    { icon: FileEdit, label: 'Sugestões', path: '/patient/suggestions' },
    { icon: BookMarked, label: 'Manual', path: '/patient/manual' },
    { icon: UserCircle, label: 'Perfil', path: '/patient/profile' },
  ];

  const bottomNavItems = [
    { icon: Home, label: 'Início', path: '/patient/dashboard' },
    { icon: Dumbbell, label: 'EPR', path: '/patient/epr' },
    { icon: TrendingUp, label: 'Progresso', path: '/patient/progress' },
    { icon: Menu, label: 'Menu', action: () => setIsMenuOpen(true) },
  ];

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 border-b shadow-sm w-full" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
        <div className="flex items-center justify-between px-4 py-3 w-full">
          <div className="flex items-center gap-2">
            <span className="text-xl">⛓️‍💥</span>
            <h1 className="text-lg font-bold" style={{ color: '#8B5CF6' }}>ChainFree</h1>
          </div>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-purple-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            style={{ color: '#8B5CF6' }}
            aria-label="Abrir menu de navegação"
            aria-expanded={isMenuOpen}
            aria-controls="side-menu"
          >
            <Menu className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Mobile Side Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            id="side-menu"
            role="dialog"
            aria-label="Menu de navegação"
            aria-modal="true"
            className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] shadow-xl flex flex-col"
            style={{ backgroundColor: 'white' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu Header */}
            <div className="p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⛓️‍💥</span>
                  <h1 className="text-xl font-bold" style={{ color: '#8B5CF6' }}>ChainFree</h1>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-purple-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  style={{ color: '#8B5CF6' }}
                  aria-label="Fechar menu de navegação"
                >
                  <X className="w-6 h-6" aria-hidden="true" />
                </button>
              </div>
              <p className="text-sm" style={{ color: '#6B7280' }}>Olá, {userName || 'Paciente'}!</p>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                return (
                  <Link key={item.path} to={item.path} onClick={handleMenuItemClick}>
                    <div
                      className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                      style={{
                        backgroundColor: isActive ? '#F3E8FF' : 'transparent',
                        color: isActive ? '#8B5CF6' : '#6B7280',
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Menu Footer */}
            <div className="p-4 border-t space-y-2" style={{ borderColor: '#E5E7EB' }}>
              <Button
                className="w-full text-white"
                style={{ backgroundColor: '#8B5CF6' }}
                onClick={() => { navigate('/subscription'); setIsMenuOpen(false); }}
              >
                <Crown className="w-4 h-4 mr-2" />
                Assinar Premium
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLogout}
                disabled={isSigningOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {isSigningOut ? 'Saindo…' : 'Sair'}
              </Button>
              {logoutError && <p role="alert" className="text-sm text-red-800">{logoutError}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20 w-full">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t shadow-lg z-40 w-full" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }} aria-label="Navegação principal">
        <div className="flex items-center justify-around">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path && (location.pathname === item.path || location.pathname.startsWith(item.path + '/'));

            if (item.action) {
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="flex flex-col items-center gap-1 py-2 px-4 flex-1 transition-colors min-h-[48px]"
                  style={{ color: '#6B7280' }}
                  aria-label={item.label}
                >
                  <Icon className="w-6 h-6" aria-hidden="true" />
                  <span className="text-xs" aria-hidden="true">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path!}
                className="flex flex-col items-center gap-1 py-2 px-4 flex-1 transition-colors min-h-[48px]"
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  color: isActive ? '#8B5CF6' : '#6B7280',
                  backgroundColor: isActive ? '#F3E8FF' : 'transparent',
                }}
              >
                <Icon className="w-6 h-6" aria-hidden="true" />
                <span className="text-xs" aria-hidden="true">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
