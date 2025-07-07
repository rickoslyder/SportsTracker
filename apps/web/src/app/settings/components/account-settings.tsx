'use client'

import { useState } from 'react'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sports-tracker/ui'
import { useUserPreferences } from '../../../stores/user-preferences'
import { useUser } from '@clerk/nextjs'
import { Download, RefreshCw, Trash2, Cloud, CloudOff } from 'lucide-react'
import { updateUserConfig } from '../../actions/user-config'

export function AccountSettings() {
  const { preferences, reset } = useUserPreferences()
  const { user, isSignedIn } = useUser()
  const [isResetting, setIsResetting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const handleExportData = () => {
    const data = {
      preferences,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sports-tracker-settings-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleResetPreferences = async () => {
    if (!confirm('Are you sure you want to reset all preferences to defaults? This cannot be undone.')) {
      return
    }
    
    setIsResetting(true)
    try {
      reset()
      // If signed in, also reset in the cloud
      if (isSignedIn && user) {
        await updateUserConfig({
          preferences: {},
          sync_enabled: false,
        })
      }
    } finally {
      setIsResetting(false)
    }
  }

  const handleSyncToggle = async () => {
    if (!isSignedIn || !user) return
    
    setIsSyncing(true)
    try {
      await updateUserConfig({
        preferences,
        sync_enabled: !preferences.syncEnabled,
      })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account & Data</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and data
        </p>
      </div>
      
      <div className="space-y-4">
        {/* Sync Status */}
        {isSignedIn ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <Cloud className="h-4 w-4" />
                <span>Cloud Sync</span>
              </CardTitle>
              <CardDescription>
                Sync your preferences across all devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">
                    Sync is currently {preferences.syncEnabled ? 'enabled' : 'disabled'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last synced: {new Date().toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSyncToggle}
                  disabled={isSyncing}
                >
                  {isSyncing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : preferences.syncEnabled ? (
                    <>
                      <CloudOff className="h-4 w-4 mr-2" />
                      Disable Sync
                    </>
                  ) : (
                    <>
                      <Cloud className="h-4 w-4 mr-2" />
                      Enable Sync
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <CloudOff className="h-4 w-4" />
                <span>Sign In for Sync</span>
              </CardTitle>
              <CardDescription>
                Sign in to sync your preferences across devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" asChild>
                <a href="/sign-in">Sign In</a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data Management</CardTitle>
            <CardDescription>
              Export or reset your data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleExportData}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Settings
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={handleResetPreferences}
              disabled={isResetting}
            >
              {isResetting ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Reset to Defaults
            </Button>
          </CardContent>
        </Card>

        {/* Account Info */}
        {isSignedIn && user && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Email</span>
                <span>{user.primaryEmailAddress?.emailAddress}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">User ID</span>
                <span className="font-mono text-xs">{user.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Joined</span>
                <span>{new Date(user.createdAt!).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}