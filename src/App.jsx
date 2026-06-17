import { useState, useEffect, useRef } from 'react'
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api'
import './App.css'

function TodoItem({ todo, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(todo.title)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  function handleEdit() {
    setTitle(todo.title)
    setEditing(true)
  }

  function handleCancel() {
    setTitle(todo.title)
    setEditing(false)
  }

  async function handleSave() {
    const trimmed = title.trim()
    if (!trimmed || trimmed === todo.title) {
      handleCancel()
      return
    }
    await onUpdate(todo._id, { title: trimmed })
    setEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') handleCancel()
  }

  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo._id, todo.completed)}
      />
      {editing ? (
        <input
          ref={inputRef}
          className="edit-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
        />
      ) : (
        <span className="todo-title" onDoubleClick={handleEdit}>
          {todo.title}
        </span>
      )}
      <div className="todo-actions">
        {!editing && (
          <button className="btn-edit" onClick={handleEdit}>수정</button>
        )}
        <button className="btn-delete" onClick={() => onDelete(todo._id)}>삭제</button>
      </div>
    </li>
  )
}

export default function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodos()
      .then(setTodos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    try {
      const todo = await createTodo(trimmed)
      setTodos((prev) => [todo, ...prev])
      setInput('')
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleToggle(id, currentCompleted) {
    try {
      const updated = await updateTodo(id, { completed: !currentCompleted })
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)))
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleUpdate(id, data) {
    try {
      const updated = await updateTodo(id, data)
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)))
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTodo(id)
      setTodos((prev) => prev.filter((t) => t._id !== id))
    } catch (e) {
      setError(e.message)
    }
  }

  const remaining = todos.filter((t) => !t.completed).length

  return (
    <div className="app">
      <h1>할일 목록</h1>

      <form className="add-form" onSubmit={handleAdd}>
        <input
          className="add-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="할일을 입력하세요"
        />
        <button className="btn-add" type="submit">추가</button>
      </form>

      {error && (
        <p className="error" onClick={() => setError(null)}>{error}</p>
      )}

      {loading ? (
        <p className="status">불러오는 중...</p>
      ) : todos.length === 0 ? (
        <p className="status">할일이 없습니다.</p>
      ) : (
        <>
          <ul className="todo-list">
            {todos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={handleToggle}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </ul>
          <p className="summary">남은 할일: {remaining}개</p>
        </>
      )}
    </div>
  )
}
