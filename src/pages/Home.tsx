import React, { useState, useEffect } from 'react';
import type { ITodo } from '../interfaces';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { TodoItem } from '../components/TodoItem';

export const Home: React.FC = () => {
  const [todos, setTodos] = useState<ITodo[]>(() => {
    try {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        return JSON.parse(savedTodos);
      }
    } catch (err) {
      console.error('Failed to parse todos from localStorage', err);
    }
    return [];
  });
  
  const [newTaskText, setNewTaskText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTodo: ITodo = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      text: newTaskText.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTodos((prev) => [newTodo, ...prev]);
    setNewTaskText('');
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id: string, newText: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-3xl space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tight">
            Focus.
          </h1>
          <p className="text-slate-400 text-lg">What do you need to get done today?</p>
        </div>

        {/* Main Glass Panel */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10">
          
          {/* Add Todo Form */}
          <form onSubmit={handleAddTodo} className="flex gap-3 mb-8">
            <Input
              type="text"
              placeholder="E.g., Review the pull request..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              className="flex-1 text-lg shadow-inner"
            />
            <Button type="submit" className="px-8" icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }>
              Add
            </Button>
          </form>

          {/* Filters & Status */}
          {todos.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
              <span className="text-slate-400 font-medium">
                {activeCount} task{activeCount !== 1 ? 's' : ''} remaining
              </span>
              
              <div className="flex bg-slate-800/50 p-1 rounded-xl">
                {(['all', 'active', 'completed'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      filter === f 
                        ? 'bg-indigo-500 text-white shadow-md' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              {todos.some(t => t.completed) && (
                <button 
                  onClick={clearCompleted}
                  className="text-sm text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Clear completed
                </button>
              )}
            </div>
          )}

          {/* Todo List */}
          <div className="space-y-3">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <svg className="mx-auto h-12 w-12 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <p className="text-lg font-medium">No tasks found</p>
                <p className="text-sm mt-1">Enjoy your day or create a new task!</p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onUpdate={updateTodo}
                />
              ))
            )}
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-8">
          Double-click to edit a task
        </p>

      </div>
    </div>
  );
};
