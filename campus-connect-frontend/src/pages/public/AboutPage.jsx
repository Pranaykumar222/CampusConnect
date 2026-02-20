import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Target, Users, Lightbulb, Rocket, GraduationCap,
  MessageSquare, BookOpen, Calendar, ArrowRight
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const howItWorks = [
  {
    step: '01',
    icon: GraduationCap,
    title: 'Create Your Profile',
    description: 'Sign up with your university email, add your skills, interests, and academic background.',
  },
  {
    step: '02',
    icon: Users,
    title: 'Connect with Peers',
    description: 'Discover students with similar interests, join communities, and follow inspiring creators.',
  },
  {
    step: '03',
    icon: Rocket,
    title: 'Build and Collaborate',
    description: 'Join projects, attend events, share resources, and build your professional portfolio.',
  },
]

const team = [
  {
    name: 'Pranay Kumar Karanam',
    role: 'Founder & Developer',
    bio: 'Computer Science student building CampusConnect to help students collaborate, network, and grow together.',
  },
  {
    name: 'AI Assistant',
    role: 'Technical Support & Architecture Guidance',
    bio: 'Assisted in system design, UI improvements, and development guidance during the building process.',
  },
]


const highlights = [
  { icon: MessageSquare, title: 'Real-time Collaboration', description: 'Chat, plan, and coordinate with teams in real-time.' },
  { icon: Calendar, title: 'Event Management', description: 'Create and discover campus events, from workshops to hackathons.' },
  { icon: BookOpen, title: 'Resource Library', description: 'Access shared study materials, code templates, and guides.' },
  { icon: Lightbulb, title: 'Smart Matching', description: 'Get matched with projects and people based on your skills.' },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-surface-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold text-surface-900 sm:text-5xl">
              Built by Student,{' '}
              <span className="text-brand-600">for Students</span>
            </h1>
            <p className="mt-6 text-lg text-surface-500 leading-relaxed">
              CampusConnect was born from a simple observation: the most impactful moments in college happen through connections. We built the platform to make those connections effortless.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100">
              <Target className="h-6 w-6 text-brand-600" />
            </div>
            <h2 className="text-3xl font-bold text-surface-900">Our Mission</h2>
            <p className="mt-4 text-surface-500 leading-relaxed">
              We believe every student deserves access to a thriving professional network. CampusConnect breaks down the barriers between campuses, majors, and experience levels to create a space where collaboration leads to real outcomes.
            </p>
            <p className="mt-3 text-surface-500 leading-relaxed">
              Whether you are looking for a co-founder, a study group, or your next career opportunity, CampusConnect puts the right people and resources at your fingertips.
            </p>
          </div>
          {/*
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-brand-50 p-6">
              <p className="text-3xl font-bold text-brand-600">200+</p>
              <p className="mt-1 text-sm text-surface-600">Universities</p>
            </div>
            <div className="rounded-xl bg-brand-50 p-6">
              <p className="text-3xl font-bold text-brand-600">15K+</p>
              <p className="mt-1 text-sm text-surface-600">Active Students</p>
            </div>
            <div className="rounded-xl bg-brand-50 p-6">
              <p className="text-3xl font-bold text-brand-600">3.4K</p>
              <p className="mt-1 text-sm text-surface-600">Projects Built</p>
            </div>
            <div className="rounded-xl bg-brand-50 p-6">
              <p className="text-3xl font-bold text-brand-600">92%</p>
              <p className="mt-1 text-sm text-surface-600">Satisfaction</p>
            </div>
          </div>
*/}<div className="rounded-xl bg-brand-50 p-6">
  <p className="text-lg font-semibold text-brand-600">
    🚀 Early stage platform
  </p>
  <p className="mt-2 text-sm text-surface-600">
    Currently expanding to more campuses.
  </p>
</div>

        </div>
      </section>

      {/* How It Works */}
      <section className="bg-surface-50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-surface-900">How CampusConnect Works</h2>
          <p className="mt-2 text-center text-surface-500">Get started in three simple steps</p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100">
                  <item.icon className="h-7 w-7 text-brand-600" />
                </div>
                <span className="text-xs font-bold text-brand-400">STEP {item.step}</span>
                <h3 className="mt-2 text-lg font-semibold text-surface-900">{item.title}</h3>
                <p className="mt-2 text-sm text-surface-500 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-surface-900">Meet the Team</h2>
        <p className="mt-2 text-center text-surface-500">The people behind the platform</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <Card key={member.name} className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-700">
                {member.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <h3 className="font-semibold text-surface-900">{member.name}</h3>
              <p className="text-sm text-brand-600">{member.role}</p>
              <p className="mt-2 text-xs text-surface-500 leading-relaxed">{member.bio}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="bg-surface-50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-surface-900">Platform Highlights</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((h) => (
              <Card key={h.title} className="text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50">
                  <h.icon className="h-5 w-5 text-brand-600" />
                </div>
                <h3 className="text-sm font-semibold text-surface-900">{h.title}</h3>
                <p className="mt-1 text-xs text-surface-500 leading-relaxed">{h.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="rounded-2xl bg-brand-600 px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-white">Join the Movement</h2>
          <p className="mx-auto mt-3 max-w-lg text-brand-100">
            Thousands of students are already collaborating, networking, and growing on CampusConnect.
          </p>
          <Link to="/register">
          <Button
  size="lg"
  className="mt-6 bg-white !text-brand-600 hover:bg-brand-200 hover:!text-brand-700"
>
  Get Started Free
  <ArrowRight className="h-4 w-4" />
</Button>

          </Link>
        </div>
      </section>
    </div>
  )
}
