import { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';

type Props = {
  calLink: string;
  label: string;
};

export default function CalButton({ calLink, label }: Props) {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi();
      cal('ui', { hideEventTypeDetails: false });
    })();
  }, []);

  return (
    <button type="button" className="btn-primary" data-cal-link={calLink}>
      {label}
    </button>
  );
}
