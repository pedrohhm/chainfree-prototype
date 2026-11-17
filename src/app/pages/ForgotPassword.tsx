import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6" style={{ backgroundColor: '#F8FAFC' }}>
      <Card className="w-full max-w-md" style={{ borderColor: '#8B5CF6' }}>
        <CardHeader className="text-center">
          <div
            className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#8B5CF6' }}
          >
            <span className="text-2xl text-white">🔑</span>
          </div>
          <CardTitle className="text-2xl" style={{ color: '#8B5CF6' }}>
            Recuperação de senha
          </CardTitle>
          <CardDescription style={{ color: '#6B7280' }}>
            A recuperação de senha está indisponível nesta versão.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full text-white" style={{ backgroundColor: '#8B5CF6' }}>
            <Link to="/"><ArrowLeft aria-hidden="true" /> Voltar para login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
