import { useEffect } from 'react'
import { App as CapApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'

export function useBackButton(handler: () => void, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled || !Capacitor.isNativePlatform()) return

    const listener = CapApp.addListener('backButton', () => {
      handler()
    })

    return () => {
      listener.then(l => l.remove())
    }
  }, [handler, enabled])
}
