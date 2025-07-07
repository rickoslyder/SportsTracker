import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings - Sports Event Tracker',
  description: 'Manage your preferences and account settings',
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your preferences and account settings
        </p>
      </div>
      {children}
    </div>
  )
}