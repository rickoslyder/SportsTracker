import { Metadata } from 'next'
import { StatusHero } from '../../components/status/status-hero'
import { CurrentStatus } from '../../components/status/current-status'
import { ServiceGrid } from '../../components/status/service-grid'
import { IncidentHistory } from '../../components/status/incident-history'
import { StatusUpdates } from '../../components/status/status-updates'
import { UptimeStats } from '../../components/status/uptime-stats'

export const metadata: Metadata = {
  title: 'System Status - Sports Event Tracker',
  description: 'Check the current status of Sports Event Tracker services and view incident history.',
}

export default function StatusPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <StatusHero />
      <CurrentStatus />
      <ServiceGrid />
      <UptimeStats />
      <IncidentHistory />
      <StatusUpdates />
    </div>
  )
}