import { EventsDataTable } from '../../../components/admin/events-data-table'

export default function AdminEventsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Events Management</h1>
        <p className="text-muted-foreground">View and manage all events in the system</p>
      </div>
      
      <EventsDataTable />
    </div>
  )
}