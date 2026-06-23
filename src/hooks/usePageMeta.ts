import { useEffect } from 'react';

type PageMeta = {
  title: string;
  description?: string;
};

const BASE_TITLE = 'Pedro y Juan Petshop';

export function usePageMeta({ title, description }: PageMeta) {
  useEffect(() => {
    document.title = title === BASE_TITLE ? BASE_TITLE : `${title} | ${BASE_TITLE}`;

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }
  }, [title, description]);
}
