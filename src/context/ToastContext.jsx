import { createContext, useCallback, useContext, useState } from 'react'
import Toast from '../components/Toast'

const ToastContext = createContext(undefined)

export function ToastProvider({ children }) {
  const [message, setMessage] = useState('')

  const showToast = useCallback((text) => setMessage(text), [])
  const dismiss = useCallback(() => setMessage(''), [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Toast message={message} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
