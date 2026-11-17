import { Link, useLocation } from 'react-router';
import { ArrowLeft, FileText, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import termsText from '../content/terms.txt?raw';
import privacyText from '../content/privacy.txt?raw';

type LegalDocumentType = 'terms' | 'privacy';

const documents: Record<
  LegalDocumentType,
  { content: string; icon: typeof FileText; label: string }
> = {
  terms: {
    content: termsText,
    icon: FileText,
    label: 'Termos de Uso e Consentimento',
  },
  privacy: {
    content: privacyText,
    icon: ShieldCheck,
    label: 'Política de Privacidade',
  },
};

function isSectionHeading(line: string) {
  return /^\d+(?:\.\d+)*\.?\s/.test(line);
}

export default function LegalDocument({ type }: { type: LegalDocumentType }) {
  const location = useLocation();
  const document = documents[type];
  const Icon = document.icon;
  const lines = document.content.split('\n').filter((line) => line.trim());
  const title = lines[0];
  const version = lines[1];
  const returnTo =
    new URLSearchParams(location.search).get('returnTo') || '/';

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto max-w-3xl">
        <Button asChild variant="ghost" className="mb-4 min-h-12">
          <Link to={returnTo}>
            <ArrowLeft aria-hidden="true" />
            Voltar
          </Link>
        </Button>

        <Card>
          <CardHeader className="border-b">
            <div className="flex items-start gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                <Icon aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-xl leading-snug text-slate-900">
                  {title}
                </CardTitle>
                <p className="mt-2 text-sm text-slate-600">{version}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <p className="sr-only">
              Início do documento {document.label}.
            </p>
            {lines.slice(2).map((line, index) =>
              isSectionHeading(line) ? (
                <div
                  key={`${line}-${index}`}
                  role="heading"
                  aria-level={2}
                  className="pt-3 text-lg font-semibold leading-relaxed text-slate-900"
                >
                  {line}
                </div>
              ) : (
                <p
                  key={`${line}-${index}`}
                  className="text-base leading-relaxed text-slate-700"
                >
                  {line}
                </p>
              ),
            )}
          </CardContent>
        </Card>

        <div className="mt-4 text-center text-sm text-slate-600">
          Dúvidas: pedrohenriquemakiyama@gmail.com
        </div>
      </div>
    </main>
  );
}
