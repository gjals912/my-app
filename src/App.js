import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : { today: [], tomorrow: [] };
  });

  const [input, setInput] = useState('');
  const [time, setTime] = useState('');
  const [selectedDay, setSelectedDay] = useState('today');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim() === '') return;

    const newTodo = {
      id: Date.now(),
      text: input.trim(),
      time: time || '',
      completed: false,
    };

    setTodos((prev) => ({
      ...prev,
      [selectedDay]: [...prev[selectedDay], newTodo],
    }));

    setInput('');
    setTime('');
  };

  const toggleTodo = (day, id) => {
    setTodos((prev) => ({
      ...prev,
      [day]: prev[day].map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    }));
  };

  const deleteTodo = (day, id) => {
    setTodos((prev) => ({
      ...prev,
      [day]: prev[day].filter((todo) => todo.id !== id),
    }));
  };

  const renderTodoList = (label, dayKey) => (
    <div className="todo-section">
      <h2>{label}</h2>
      <ul className="todo-list">
        {todos[dayKey].map((todo) => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'done' : ''}`}>
            <div className="todo-text" onClick={() => toggleTodo(dayKey, todo.id)}>
              <span className="todo-title">{todo.text}</span>
              {todo.time && <span className="todo-time">🕒 {todo.time}</span>}
            </div>
            <button className="delete-btn" onClick={() => deleteTodo(dayKey, todo.id)}>
              ❌
            </button>
          </li>
        ))}
      </ul>
      {todos[dayKey].length === 0 && (
        <p className="empty-msg">할 일이 없습니다 🎉</p>
      )}
    </div>
  );

  return (
    <div className="app-wrapper">
      <div className="todo-card">
        <h1>🌈 할 일 목록</h1>

        <div className="input-row">
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            <option value="today">오늘</option>
            <option value="tomorrow">내일</option>
          </select>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="할 일을 입력하세요"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <button onClick={addTodo}>➕</button>
        </div>

        {renderTodoList('📅 오늘 할 일', 'today')}
        {renderTodoList('🌙 내일 할 일', 'tomorrow')}
      </div>
    </div>
  );
}

export default App;
