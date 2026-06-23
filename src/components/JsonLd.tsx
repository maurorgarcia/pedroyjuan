import { useEffect } from 'react';

type Props = {
  data: Record<string, unknown>;
};

export default function JsonLd({ data }: Props) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    script.id = 'json-ld';
    document.head.appendChild(script);
    return () => {
      document.getElementById('json-ld')?.remove();
    };
  }, [data]);

  return null;
}
