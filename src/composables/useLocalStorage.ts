// composables/useLocalStorage.ts
import { ref, watch, Ref } from 'vue'

export interface StorageOptions {
  serializer?: {
    read: (value: string) => any
    write: (value: any) => string
  }
  syncAcrossTabs?: boolean
  onError?: (error: Error) => void
}

export interface StorageData<T> {
  data: T
  timestamp: string
  version: string
  checksum?: string
}

const defaultOptions: StorageOptions = {
  serializer: {
    read: JSON.parse,
    write: JSON.stringify
  },
  syncAcrossTabs: true,
  onError: (error) => console.error('LocalStorage error:', error)
}

// Simple checksum function for data integrity
const generateChecksum = (data: string): string => {
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash.toString(36)
}

export const useLocalStorage = <T>(
  key: string,
  defaultValue?: T,
  options: StorageOptions = {}
) => {
  const opts = { ...defaultOptions, ...options }
  const data = ref<T | undefined>(defaultValue) as Ref<T>
  const error = ref<Error | null>(null)
  const isLoading = ref(false)

  const handleError = (err: Error): void => {
    error.value = err
    if (opts.onError) {
      opts.onError(err)
    }
  }

  const validateData = (rawData: string, storedData: StorageData<T>): boolean => {
    if (!storedData.checksum) return true
    
    const dataToCheck = JSON.stringify({
      data: storedData.data,
      timestamp: storedData.timestamp,
      version: storedData.version
    })
    
    return generateChecksum(dataToCheck) === storedData.checksum
  }

  const read = (): T | undefined => {
    try {
      isLoading.value = true
      error.value = null

      if (typeof window === 'undefined') {
        return defaultValue
      }

      const rawData = localStorage.getItem(key)
      if (!rawData) {
        return defaultValue
      }

      const parsedData = opts.serializer!.read(rawData) as StorageData<T>
      
      // Validate data integrity
      if (!validateData(rawData, parsedData)) {
        throw new Error('Data integrity check failed')
      }

      return parsedData.data
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Failed to read from localStorage'))
      return defaultValue
    } finally {
      isLoading.value = false
    }
  }

  const write = (value: T): void => {
    try {
      error.value = null

      if (typeof window === 'undefined') {
        return
      }

      const storageData: StorageData<T> = {
        data: value,
        timestamp: new Date().toISOString(),
        version: '1.0'
      }

      // Generate checksum for data integrity
      const dataToHash = JSON.stringify(storageData)
      storageData.checksum = generateChecksum(dataToHash)

      const serializedData = opts.serializer!.write(storageData)
      localStorage.setItem(key, serializedData)
      
      data.value = value
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Failed to write to localStorage'))
    }
  }

  const remove = (): void => {
    try {
      error.value = null

      if (typeof window === 'undefined') {
        return
      }

      localStorage.removeItem(key)
      data.value = defaultValue as T
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Failed to remove from localStorage'))
    }
  }

  const clear = (): void => {
    try {
      error.value = null

      if (typeof window === 'undefined') {
        return
      }

      localStorage.clear()
      data.value = defaultValue as T
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Failed to clear localStorage'))
    }
  }

  // Check if localStorage is available
  const isSupported = (): boolean => {
    try {
      if (typeof window === 'undefined') return false
      
      const testKey = '__localStorage_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  // Get storage usage information
  const getStorageInfo = () => {
    if (!isSupported()) {
      return { used: 0, remaining: 0, total: 0 }
    }

    try {
      let used = 0
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length
        }
      }

      // Most browsers limit localStorage to 5-10MB
      const estimated = 5 * 1024 * 1024 // 5MB estimate
      return {
        used,
        remaining: Math.max(0, estimated - used),
        total: estimated
      }
    } catch {
      return { used: 0, remaining: 0, total: 0 }
    }
  }

  // Initialize data from localStorage
  const initializeData = (): void => {
    const storedValue = read()
    if (storedValue !== undefined) {
      data.value = storedValue
    }
  }

  // Watch for data changes and sync to localStorage
  if (opts.syncAcrossTabs) {
    watch(
      data,
      (newValue) => {
        if (newValue !== undefined) {
          write(newValue)
        }
      },
      { deep: true }
    )
  }

  // Listen for storage events from other tabs
  if (typeof window !== 'undefined' && opts.syncAcrossTabs) {
    window.addEventListener('storage', (e) => {
      if (e.key === key && e.newValue) {
        try {
          const parsedData = opts.serializer!.read(e.newValue) as StorageData<T>
          if (validateData(e.newValue, parsedData)) {
            data.value = parsedData.data
          }
        } catch (err) {
          handleError(err instanceof Error ? err : new Error('Failed to sync data across tabs'))
        }
      }
    })
  }

  // Initialize
  initializeData()

  return {
    // State
    data,
    error,
    isLoading,
    
    // Methods
    saveData: write,
    loadData: read,
    clearData: remove,
    clearAllData: clear,
    
    // Utilities
    isSupported,
    getStorageInfo,
    
    // Backward compatibility
    save: write,
    load: read,
    clear: remove
  }
}