<!-- components/ProgressSteps.vue -->
<template>
  <nav 
    class="progress-steps" 
    role="progressbar" 
    :aria-valuenow="activeStep"
    :aria-valuemin="1"
    :aria-valuemax="steps.length"
    :aria-label="`Bước ${activeStep} trong ${steps.length}`"
  >
    <ol class="steps-list">
      <li
        v-for="(step, index) in steps"
        :key="step.id"
        class="step-item"
        :class="{
          'step-completed': step.id < activeStep,
          'step-active': step.id === activeStep,
          'step-upcoming': step.id > activeStep
        }"
      >
        <div class="step-content">
          <div class="step-indicator">
            <div class="step-number" :aria-hidden="step.id < activeStep">
              <i 
                v-if="step.id < activeStep" 
                class="fas fa-check" 
                aria-label="Hoàn thành"
              ></i>
              <span v-else>{{ step.id }}</span>
            </div>
          </div>
          
          <div class="step-text">
            <div class="step-title">{{ step.title }}</div>
            <div class="step-description">{{ step.description }}</div>
          </div>
        </div>
        
        <!-- Connector line -->
        <div 
          v-if="index < steps.length - 1" 
          class="step-connector"
          :class="{
            'connector-completed': step.id < activeStep,
            'connector-active': step.id === activeStep
          }"
          aria-hidden="true"
        ></div>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
interface Step {
  id: number
  title: string
  description: string
}

interface Props {
  activeStep: number
  steps: Step[]
}

defineProps<Props>()
</script>

<style scoped>
.progress-steps {
  padding: 0;
}

.steps-list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0;
}

.step-item {
  position: relative;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.step-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 2;
}
</style>