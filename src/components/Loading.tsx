import { useTranslation } from 'react-i18next';

interface LoadingProps {
  fullScreen?: boolean;
}

export function Loading({ fullScreen }: LoadingProps) {
  const { t } = useTranslation();

  const content = (
    <>
      <div className="animate-spin rounded-full h-12 w-12 border-2 border-line border-t-herb mb-4"></div>
      <p className="text-muted text-sm">{t('common.loading')}</p>
    </>
  );

  if (fullScreen) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-linen items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {content}
    </div>
  );
}
