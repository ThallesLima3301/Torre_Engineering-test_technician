import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addFavorite } from '../services/torreService';

const JobDetailsPage = () => {
  const { state: job } = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const favoriteMutation = useMutation({
    mutationFn: (selectedJob) => addFavorite('guest', 'job', selectedJob),
    onSuccess: () => {
      setMessage(t('jobDetails.savedMsg'));
      queryClient.invalidateQueries({ queryKey: ['favorites', 'guest'] });
    },
    onError: (err) => {
      setMessage(err.response?.data?.message || t('jobDetails.couldNotSave'));
    },
  });

  if (!job) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold text-gray-950 dark:text-white">{t('jobDetails.unavailableTitle')}</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          {t('jobDetails.unavailableDesc')}
        </p>
        <Link
          to="/jobs"
          className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {t('jobDetails.backToJobs')}
        </Link>
      </section>
    );
  }

  const organization = job.organizations?.[0]?.name || t('jobDetails.company');
  const location = job.locations?.join(', ') || t('jobs.location');
  const compensation = job.compensation?.data?.code || t('jobDetails.notInformed');

  const handleFavorite = () => {
    favoriteMutation.mutate(job);
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-300"
      >
        {t('common.back')}
      </button>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{organization}</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
              {job.objective || t('jobDetails.untitled')}
            </h1>
            {job.tagline && (
              <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">{job.tagline}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleFavorite}
            disabled={favoriteMutation.isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {favoriteMutation.isPending ? t('jobDetails.saving') : t('jobDetails.saveJob')}
          </button>
        </div>

        {message && (
          <p className="mt-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100">
            {message}
          </p>
        )}

        <dl className="mt-6 grid gap-4 border-t border-gray-200 pt-6 text-sm dark:border-gray-800 sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-gray-950 dark:text-white">{t('jobDetails.type')}</dt>
            <dd className="mt-1 text-gray-600 dark:text-gray-300">
              {job.type?.replace(/-/g, ' ') || t('jobDetails.notInformed')}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-950 dark:text-white">{t('jobDetails.location')}</dt>
            <dd className="mt-1 text-gray-600 dark:text-gray-300">{location}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-950 dark:text-white">{t('jobDetails.company')}</dt>
            <dd className="mt-1 text-gray-600 dark:text-gray-300">{organization}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-950 dark:text-white">{t('jobDetails.compensation')}</dt>
            <dd className="mt-1 text-gray-600 dark:text-gray-300">{compensation}</dd>
          </div>
        </dl>

        <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">{t('jobDetails.details')}</h2>
          <p className="mt-3 whitespace-pre-wrap leading-7 text-gray-700 dark:text-gray-300">
            {job.details || t('jobDetails.noDetails')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default JobDetailsPage;
