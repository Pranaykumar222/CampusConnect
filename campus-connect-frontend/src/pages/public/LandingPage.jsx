import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users, Calendar, FolderKanban, BookOpen, Search, ArrowRight,
  MessageSquare, Lightbulb, Globe, Sparkles, Star, ChevronRight
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { formatCount } from '../../utils/helpers'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const stats = [
  { label: 'Active Students', value: 15000, icon: Users },
  { label: 'Events Hosted', value: 1200, icon: Calendar },
  { label: 'Projects Built', value: 3400, icon: FolderKanban },
  { label: 'Communities', value: 850, icon: Globe },
]

const features = [
  {
    icon: FolderKanban,
    title: 'Collaborative Projects',
    description: 'Find teammates, build real projects, and showcase your portfolio to potential employers.',
  },
  {
    icon: Calendar,
    title: 'Campus Events',
    description: 'Discover hackathons, workshops, and networking events from universities across the country.',
  },
  {
    icon: MessageSquare,
    title: 'Real-time Messaging',
    description: 'Stay connected with personal and group chats. Coordinate with project teams instantly.',
  },
  {
    icon: BookOpen,
    title: 'Resource Sharing',
    description: 'Share study materials, code templates, and guides. Help others while building your reputation.',
  },
  {
    icon: Users,
    title: 'Community Posts',
    description: 'Share ideas, ask questions, and engage with a vibrant student community.',
  },
  {
    icon: Lightbulb,
    title: 'Smart Discovery',
    description: 'Get personalized suggestions for clubs, people, and projects that match your interests.',
  },
]

const trendingEvents = [
  {
    title: 'Spring Hackathon 2026',
    date: 'Mar 15, 2026',
    category: 'Hackathon',
    attendees: 342,
  },
  {
    title: 'AI/ML Workshop Series',
    date: 'Mar 20, 2026',
    category: 'Workshop',
    attendees: 156,
  },
  {
    title: 'Startup Pitch Night',
    date: 'Mar 28, 2026',
    category: 'Networking',
    attendees: 210,
  },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CS Junior, Stanford',
    text: 'CampusConnect helped me find my co-founder for our startup. The project matching is incredibly accurate.',
    avatar: null,
  },
  {
    name: 'Marcus Johnson',
    role: 'Engineering Senior, MIT',
    text: 'I went from zero connections to landing an internship through a project I found here. Absolute game changer.',
    avatar: null,
  },
  {
    name: 'Priya Patel',
    role: 'Design Sophomore, RISD',
    text: 'The community is so supportive. I share my design resources and get amazing feedback from students worldwide.',
    avatar: null,
  },
]

const suggestedTags = [
  'Machine Learning', 'Web Development', 'Data Science', 'Mobile Apps',
  'UI/UX Design', 'Blockchain', 'Cloud Computing', 'Cybersecurity',
]

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-50 via-white to-white" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <Badge variant="primary" className="mb-4 px-3 py-1">
                🚀 Early Access Platform
              </Badge>
              <h1 className="text-4xl font-extrabold tracking-tight text-surface-900 sm:text-5xl lg:text-6xl">
                Your Campus.{' '}
                <span className="text-brand-600">Your Network.</span>{' '}
                Your Future.
              </h1>
              <p className="mt-6 text-lg text-surface-500 leading-relaxed">
                CampusConnect is where students collaborate on projects, discover events, share resources, and build the connections that shape careers. Join a community that moves at your speed.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link to="/register">
                  <Button size="lg" className="px-8">
                    Join CampusConnect
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
    {/*
      <section className="border-y border-surface-200 bg-surface-50">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100">
                  <stat.icon className="h-6 w-6 text-brand-600" />
                </div>
                <p className="text-2xl font-bold text-surface-900">{formatCount(stat.value)}</p>
                <p className="text-sm text-surface-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
*/}
<section className="border-y border-surface-200 bg-surface-50">
  <div className="mx-auto max-w-7xl px-4 py-12 text-center">
    <p className="text-sm text-surface-500">
      🚀 Platform launching across campuses soon.
    </p>
  </div>
</section>


      {/* Search Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-surface-900">Explore What Interests You</h2>
          <p className="mt-2 text-surface-500">Search for projects, events, people, and resources</p>
          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Search projects, events, communities..."
              className="w-full rounded-xl border border-surface-300 bg-white py-3.5 pl-12 pr-4 text-sm text-surface-900 placeholder-surface-400 shadow-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              readOnly
              onClick={() => window.location.href = '/register'}
            />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {suggestedTags.map((tag) => (
              <Badge key={tag} className="cursor-pointer transition-colors hover:bg-brand-100 hover:text-brand-700">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-surface-50 py-16" id="features">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-surface-900">Everything You Need to Thrive on Campus</h2>
            <p className="mt-3 text-surface-500">
              Built by students, for students. Every feature designed to help you collaborate and grow.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card hover className="h-full">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50">
                    <feature.icon className="h-5 w-5 text-brand-600" />
                  </div>
                  <h3 className="text-base font-semibold text-surface-900">{feature.title}</h3>
                  <p className="mt-2 text-sm text-surface-500 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Events */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8" id="events">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-surface-900">Trending Events</h2>
            <p className="mt-1 text-surface-500">Discover what is happening across campuses</p>
          </div>
          <Link to="/register" className="hidden items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 md:flex">
            View all events <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trendingEvents.map((event, i) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card hover className="h-full">
                <div className="flex items-center justify-between">
                  <Badge variant="primary">{event.category}</Badge>
                  <span className="text-xs text-surface-400">{event.date}</span>
                </div>
                <h3 className="mt-3 text-base font-semibold text-surface-900">{event.title}</h3>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-surface-500">
                    <Users className="h-4 w-4" />
                    {event.attendees} attending
                  </div>
                  <Link to="/register">
                    <Button size="sm">Register</Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-surface-50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-surface-900">Loved by Students Everywhere</h2>
            <p className="mt-2 text-surface-500">Hear from students who have transformed their campus experience</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <div className="mb-3 flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-surface-600 leading-relaxed">{`"${t.text}"`}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                      {t.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-900">{t.name}</p>
                      <p className="text-xs text-surface-500">{t.role}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="rounded-2xl bg-brand-600 px-8 py-12 text-center sm:px-12 lg:py-16">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to Transform Your Campus Experience?</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            Join thousands of students already building projects, attending events, and growing their professional network.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/register">
            <Button
               size="lg"
               className="bg-white !text-brand-600 hover:bg-brand-200 hover:!text-brand-700"
              >
              Create Free Account
            </Button>

            </Link>
            <Link to="/about">
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
                Explore Platform
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
