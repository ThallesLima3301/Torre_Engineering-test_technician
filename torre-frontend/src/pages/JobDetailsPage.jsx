import { useLocation, useNavigate } from 'react-router-dom';

const JobDetailsPage = () => {
  const { state: job } = useLocation();
  const navigate = useNavigate();

  if (!job) return <p className="p-6">❌ Vaga não encontrada.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← Voltar
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.objective}</h1>
      <p className="text-gray-600 text-lg mb-4">{job.tagline}</p>

      <div className="text-sm text-gray-700 space-y-2">
        <p><strong>Tipo:</strong> {job.type?.replace(/-/g, ' ') || 'Não informado'}</p>
        <p><strong>Local:</strong> {job.locations?.join(', ') || 'Remoto'}</p>
        <p><strong>Empresa:</strong> {job.organizations?.[0]?.name || 'Desconhecida'}</p>
        <p><strong>Remuneração:</strong> {job.compensation?.data?.code || 'Não informada'}</p>
      </div>

      <hr className="my-6" />

      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
        {job.details || 'Nenhum detalhe adicional fornecido.'}
      </div>
    </div>
  );
};

export default JobDetailsPage;
