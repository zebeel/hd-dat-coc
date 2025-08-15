// composables/useNotification.ts
import { reactive, ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  show: boolean
  duration?: number
}

const notifications = reactive<Map<string, Notification>>(new Map())
const activeNotification = ref<Notification>({
  id: '',
  type: 'info',
  message: '',
  show: false
})

let notificationCounter = 0

export const useNotification = () => {
  const showNotification = (
    message: string, 
    type: NotificationType = 'info', 
    duration: number = 5000
  ): string => {
    const id = `notification-${++notificationCounter}`
    
    const notification: Notification = {
      id,
      type,
      message,
      show: true,
      duration
    }
    
    // Set as active notification (for single notification display)
    activeNotification.value = notification
    
    // Auto hide after duration
    if (duration > 0) {
      setTimeout(() => {
        hideNotification(id)
      }, duration)
    }
    
    // Store in map for multiple notifications if needed
    notifications.set(id, notification)
    
    return id
  }

  const hideNotification = (id?: string): void => {
    if (id) {
      const notification = notifications.get(id)
      if (notification) {
        notification.show = false
        notifications.delete(id)
        
        // Clear active if it's the same
        if (activeNotification.value?.id === id) {
          activeNotification.value = {
            id: '',
            type: 'info',
            message: '',
            show: false
          }
        }
      }
    } else {
      // Hide active notification
      if (activeNotification.value) {
        activeNotification.value.show = false
        notifications.delete(activeNotification.value.id)
        activeNotification.value = {
          id: '',
          type: 'info',
          message: '',
          show: false
        }
      }
    }
  }

  const clearAllNotifications = (): void => {
    notifications.clear()
    activeNotification.value = {
      id: '',
      type: 'info',
      message: '',
      show: false
    }
  }

  // Utility methods for different types
  const showSuccess = (message: string, duration?: number) => 
    showNotification(message, 'success', duration)
  
  const showError = (message: string, duration?: number) => 
    showNotification(message, 'error', duration)
  
  const showWarning = (message: string, duration?: number) => 
    showNotification(message, 'warning', duration)
  
  const showInfo = (message: string, duration?: number) => 
    showNotification(message, 'info', duration)

  return {
    // State
    notifications: Array.from(notifications.values()),
    notification: activeNotification,
    
    // Methods
    showNotification,
    hideNotification,
    clearAllNotifications,
    
    // Utility methods
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}