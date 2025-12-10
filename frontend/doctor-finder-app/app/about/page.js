'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  Shield,
  Users,
  Award,
  Target,
  Lightbulb,
  CheckCircle,
} from 'lucide-react';

const stats = [
  { value: '50K+', label: 'Happy Patients' },
  { value: '500+', label: 'Expert Doctors' },
  { value: '100+', label: 'Specializations' },
  { value: '24/7', label: 'Support' },
];

const values = [
  {
    icon: Heart,
    title: 'Patient-Centric Care',
    description: 'We put patients first, ensuring every interaction is focused on improving health outcomes.',
  },
  {
    icon: Shield,
    title: 'Trust & Transparency',
    description: 'All our doctors are verified, and we maintain complete transparency in our processes.',
  },
  {
    icon: Users,
    title: 'Accessibility',
    description: 'Healthcare should be accessible to everyone, regardless of location or circumstances.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We partner with only the best healthcare professionals to ensure quality care.',
  },
];

const team = [
  { name: 'Musab Iftikhar', role: 'CEO & Founder', image: 'MI' },
  { name: 'Ali', role: 'Chief Technology Officer', image: 'AL' },
  { name: 'Kinza', role: 'Lead Developer', image: 'KZ' },
  { name: 'Ayra', role: 'UI/UX Designer', image: 'AY' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 to-emerald-700 py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30">
              About Us
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Transforming Healthcare
              <span className="block text-teal-200">One Connection at a Time</span>
            </h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              MediFind is revolutionizing how patients connect with healthcare providers. 
              Our mission is to make quality healthcare accessible, affordable, and convenient for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</p>
                <p className="text-slate-600">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-teal-100 text-teal-700 hover:bg-teal-100">
                Our Story
              </Badge>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Building the Future of Healthcare
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  MediFind was born from a simple observation: finding the right doctor 
                  shouldn't be complicated. In 2020, our founders experienced firsthand 
                  the challenges of navigating the healthcare system—long wait times, 
                  difficulty finding specialists, and lack of transparency.
                </p>
                <p>
                  They envisioned a platform where patients could easily find, compare, 
                  and book appointments with qualified healthcare professionals. Today, 
                  MediFind serves thousands of patients, connecting them with a network 
                  of over 500 verified doctors across multiple specializations.
                </p>
                <p>
                  Our commitment goes beyond just appointments. We're building a 
                  healthcare ecosystem that empowers patients with information, 
                  choice, and convenience.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-teal-100 to-emerald-100 rounded-3xl flex items-center justify-center">
                <div className="w-3/4 h-3/4 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <Heart className="w-32 h-32 text-white" />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">100% Verified</p>
                    <p className="text-sm text-slate-500">All doctors verified</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              Our Purpose
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Mission & Vision
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
                  <p className="text-slate-600 leading-relaxed">
                    To democratize access to quality healthcare by creating a seamless 
                    platform that connects patients with the right healthcare providers, 
                    when and where they need them. We strive to eliminate barriers and 
                    make healthcare navigation effortless.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
                  <p className="text-slate-600 leading-relaxed">
                    A world where everyone has access to exceptional healthcare at 
                    their fingertips. We envision a future where technology bridges 
                    the gap between patients and providers, making personalized, 
                    quality care the standard, not the exception.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-teal-100 text-teal-700 hover:bg-teal-100">
              Core Values
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              What Drives Us
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our values shape everything we do, from the products we build to the 
              partnerships we form.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-md hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-7 h-7 text-teal-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                    <p className="text-slate-600 text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-amber-100 text-amber-700 hover:bg-amber-100">
              Our Team
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Meet the Leaders
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our diverse team of healthcare and technology experts is dedicated to 
              transforming the healthcare experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {member.image}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                <p className="text-slate-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


