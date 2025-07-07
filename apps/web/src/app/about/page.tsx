import { Metadata } from 'next'
import { CompanyStory } from '../../components/about/company-story'
import { TeamSection } from '../../components/about/team-section'
import { MissionValues } from '../../components/about/mission-values'
import { Timeline } from '../../components/about/timeline'
import { OfficeSection } from '../../components/about/office-section'
import { JoinTeam } from '../../components/about/join-team'

export const metadata: Metadata = {
  title: 'About Us - Sports Event Tracker',
  description: 'Learn about our mission to help sports fans never miss their favorite events. Meet the team behind Sports Event Tracker.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <CompanyStory />
      <MissionValues />
      <Timeline />
      <TeamSection />
      <OfficeSection />
      <JoinTeam />
    </div>
  )
}