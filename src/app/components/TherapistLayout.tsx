import { useState } from 'react';
import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Home, Users, MessageSquare, FileEdit, FileText, BookMarked, LogOut, Crown, UserCircle, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useApp } from '../context/AppContext';

export default function TherapistLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userName, userType, signOut } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (userType !== 'therapist') return <Navigate to="/" replace />;

  const handleLogout = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  const menuItems = [
    { icon: Home, label: 'Início', path: '/therapist/dashboard' },
    { icon: Users, label: 'Pacientes', path: '/therapist/patients' },
    { icon: MessageSquare, label: 'Perguntas', path: '/therapist/questions' },
    { icon: FileEdit, label: 'Notas/Sugestões', path: '/therapist/notes' },
    { icon: FileText, label: 'Relatórios', path: '/therapist/reports' },
    { icon: BookMarked, label: 'Manual', path: '/therapist/manual' },
    { icon: UserCircle, label: 'Perfil', path: '/therapist/profile' },
  ];

  const bottomNavItems = [
    { icon: Home, label: 'Início', path: '/therapist/dashboard' },
    { icon: Users, label: 'Pacientes', path: '/therapist/patients' },
    { icon: FileEdit, label: 'Notas', path: '/therapist/notes' },
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
            <h1 className="text-lg font-bold" style={{ color: '#3B82F6' }}>ChainFree</h1>
          </div>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
            style={{ color: '#3B82F6' }}
          >
            <Menu className="w-6 h-6" />
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
            className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] shadow-xl flex flex-col"
            style={{ backgroundColor: 'white' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu Header */}
            <div className="p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⛓️‍💥</span>
                  <h1 className="text-xl font-bold" style={{ color: '#3B82F6' }}>ChainFree</h1>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  style={{ color: '#3B82F6' }}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm" style={{ color: '#6B7280' }}>Dr(a). {userName || 'Terapeuta'}</p>
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
                        backgroundColor: isActive ? '#DBEAFE' : 'transparent',
                        color: isActive ? '#3B82F6' : '#6B7280',
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
                style={{ backgroundColor: '#3B82F6' }}
                onClick={() => { navigate('/subscription'); setIsMenuOpen(false); }}
              >
                <Crown className="w-4 h-4 mr-2" />
                Assinar Premium
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20 w-full">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t shadow-lg z-40 w-full" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
        <div className="flex items-center justify-around">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path && (location.pathname === item.path || location.pathname.startsWith(item.path + '/'));

            if (item.action) {
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="flex flex-col items-center gap-1 py-2 px-4 flex-1 transition-colors"
                  style={{ color: '#6B7280' }}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path!}
                className="flex flex-col items-center gap-1 py-2 px-4 flex-1 transition-colors"
                style={{
                  color: isActive ? '#3B82F6' : '#6B7280',
                  backgroundColor: isActive ? '#DBEAFE' : 'transparent',
                }}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
