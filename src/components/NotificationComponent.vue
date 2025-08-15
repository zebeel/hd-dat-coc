<!-- components/NotificationComponent.vue -->
<template>
  <Transition
    name="notification"
    enter-active-class="notification-enter-active"
    leave-active-class="notification-leave-active"
    enter-from-class="notification-enter-from"
    leave-to-class="notification-leave-to"
  >
    <div
      v-if="show"
      class="notification-container"
      :class="[
        `notification-${type}`,
        { 'notification-dismissible': dismissible }
      ]"
      role="alert"
      :aria-live="type === 'error' ? 'assertive' : 'polite'"
    >
      <div class="notification-content">
        <div class="notification-icon">
          <i :class="getIcon()" aria-hidden="true"></i>
        </div>
        
        <div class="notification-message">
          <p>{{ message }}</p>
        </div>
        
        <button
          v-if="dismissible"
          @click="$emit('close')"
          class="notification-close"
          type="button"
          aria-label="Đóng thông báo"
        >
          <i class="fas fa-times" aria-hidden="true"></i>
        </button>
      </div>
      
      <!-- Progress bar for auto-dismiss -->
      <div
        v-if="showProgress && duration > 0"
        class="notification-progress"
      >
        <div
          class="notification-progress-bar"
          :style="{ animationDuration: `${duration}ms` }"
        ></div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NotificationType } from '../composables/useNotification'

interface Props {
  type: NotificationType
  message: string
  show?: boolean
  dismissible?: boolean
  duration?: number
  showProgress?: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
  dismissible: true,
  duration: 5000,
  showProgress: true
})

defineEmits<Emits>()

const getIcon = (): string => {
  const iconMap: Record<NotificationType, string> = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  }
  return iconMap[props.type] || iconMap.info
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  max-width: 400px;
  min-width: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1000;
  border-left: 4px solid;
}

.notification-success {
  border-left-color: #10b981;
}

.notification-error {
  border-left-color: #ef4444;
}

.notification-warning {
  border-left-color: #f59e0b;
}

.notification-info {
  border-left-color: #3b82f6;
}

.notification-content {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  gap: 0.75rem;
}

.notification-icon {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-success .notification-icon {
  color: #10b981;
}

.notification-error .notification-icon {
  color: #ef4444;
}

.notification-warning .notification-icon {
  color: #f59e0b;
}

.notification-info .notification-icon {
  color: #3b82f6;
}

.notification-message {
  flex: 1;
  color: #374151;
}

.notification-message p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  font-weight: 500;
}

.notification-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-close:hover {
  color: #6b7280;
  background: #f3f4f6;
}

.notification-close:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.notification-progress {
  height: 3px;
  background: #f3f4f6;
  overflow: hidden;
}

.notification-progress-bar {
  height: 100%;
  background: currentColor;
  animation: progress-countdown linear;
  transform-origin: left;
}

.notification-success .notification-progress-bar {
  background: #10b981;
}

.notification-error .notification-progress-bar {
  background: #ef4444;
}

.notification-warning .notification-progress-bar {
  background: #f59e0b;
}

.notification-info .notification-progress-bar {
  background: #3b82f6;
}

/* Animations */
.notification-enter-active {
  transition: all 0.3s ease-out;
}

.notification-leave-active {
  transition: all 0.3s ease-in;
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@keyframes progress-countdown {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

/* Mobile responsive */
@media (max-width: 640px) {
  .notification-container {
    left: 1rem;
    right: 1rem;
    max-width: none;
    min-width: auto;
  }
  
  .notification-enter-from,
  .notification-leave-to {
    transform: translateY(-100%);
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .notification-container {
    border: 2px solid;
    border-left-width: 6px;
  }
  
  .notification-success {
    border-color: #10b981;
  }
  
  .notification-error {
    border-color: #ef4444;
  }
  
  .notification-warning {
    border-color: #f59e0b;
  }
  
  .notification-info {
    border-color: #3b82f6;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .notification-enter-active,
  .notification-leave-active {
    transition: none;
  }
  
  .notification-progress-bar {
    animation: none;
  }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .notification-container {
    background: #1f2937;
    color: #f9fafb;
  }
  
  .notification-message {
    color: #f9fafb;
  }
  
  .notification-close {
    color: #9ca3af;
  }
  
  .notification-close:hover {
    color: #d1d5db;
    background: #374151;
  }
  
  .notification-progress {
    background: #374151;
  }
}
</style>