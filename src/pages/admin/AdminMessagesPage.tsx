import { useEffect, useState } from 'react';
import AdminShell from '../../components/admin/AdminShell';
import { supabase } from '../../lib/supabase';
import { usePageMeta } from '../../hooks/usePageMeta';

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  usePageMeta({ title: 'Admin — Mensajes' });

  useEffect(() => {
    supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setMessages(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <AdminShell title="Mensajes de contacto">
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No hay mensajes todavía.</p>
      ) : (
        <div className="space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{msg.name}</p>
                  <a href={`mailto:${msg.email}`} className="text-sm text-brand-600 hover:underline">{msg.email}</a>
                  {msg.phone && <p className="text-sm text-gray-500">{msg.phone}</p>}
                </div>
                <p className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(msg.created_at).toLocaleString('es-AR')}
                </p>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
