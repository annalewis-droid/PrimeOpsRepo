import { createClient } from '../../utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: todos, error } = await supabase.from('todos').select();

  if (error) {
    return <p className="p-6 text-red-600">Error loading todos: {error.message}</p>;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 px-6 py-10">
      <div className="mx-auto max-w-3xl bg-white rounded-3xl p-8 shadow-xl">
        <h1 className="text-2xl font-black mb-6">Todos</h1>
        {todos?.length ? (
          <ul className="space-y-3">
            {todos.map((todo: any) => (
              <li key={todo.id} className="rounded-3xl border border-slate-200 p-4">
                {todo.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500">No todos found.</p>
        )}
      </div>
    </main>
  );
}
