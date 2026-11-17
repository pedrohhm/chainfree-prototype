import { Link, Outlet } from 'react-router';
import { useApp } from '../context/AppContext';

export default function RequireHealthConsent() {
  const { patient } = useApp();
  if (patient?.healthConsent !== false) return <Outlet />;

  return (
    <section className="space-y-3 p-4">
      <h1 className="text-lg font-semibold text-slate-800">Consentimento para dados de saúde</h1>
      <p className="text-sm text-slate-600">Este recurso está indisponível porque você recusou o tratamento de dados de saúde no cadastro.</p>
      <Link className="text-sm font-medium text-purple-700 underline" to="/patient/psychoeducation">
        Acessar a psicoeducação
      </Link>
    </section>
  );
}
