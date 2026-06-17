const BASE = import.meta.env.VITE_API_BASE_URL

export async function fetchTodos() {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error('할일 목록을 불러오지 못했습니다.')
  return res.json()
}

export async function createTodo(title) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, completed: false }),
  })
  if (!res.ok) throw new Error('할일을 추가하지 못했습니다.')
  return res.json()
}

export async function updateTodo(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('할일을 수정하지 못했습니다.')
  return res.json()
}

export async function deleteTodo(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('할일을 삭제하지 못했습니다.')
}
