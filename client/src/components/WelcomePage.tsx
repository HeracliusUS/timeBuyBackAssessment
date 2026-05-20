/*
 * Design: JustAskAVA.com brand — navy #262262, blue #3561FF, light blue #4EB2F9
 * v5: External terminology = "Executive Assistant" / "Assistant"
 * AVA = internal brand name only (defined once for context)
 * Fraunces serif headlines, DM Sans body
 */

import { useAssessment } from '@/contexts/AssessmentContext';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Shield, Sparkles, Target, RotateCcw } from 'lucide-react';

const HERO_IMG = 'https://private-us-east-1.manuscdn.com/sessionFile/d4PlRtWykV7og00LcTCFEV/sandbox/U7FGakhGmVAmzeN42yTKFY-img-1_1771081689000_na1fn_aGVyby13ZWxjb21l.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvZDRQbFJ0V3lrVjdvZzAwTGNUQ0ZFVi9zYW5kYm94L1U3Rkdha2hHbVZBbXplTjQyeVRLRlktaW1nLTFfMTc3MTA4MTY4OTAwMF9uYTFmbl9hR1Z5YnkxM1pXeGpiMjFsLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=OBj2WJZf~N7-cX3flQ~54sNCcqjn~BmgGAu25j6r4U2IxDn-dTGaqnOIlwNTOnClQvZeIXjLmqwTfvtaZZTkR9BYX3BLzGok6LjUyXf64G0bwiih7sLCiNgSk51tQtjcZa08QNpT860DgHynpeHFVNOV4lTREZmM4Z7TW5vxvyrAwCcfXI~CPjSE2M5~C7-tgemZkRwQc9CImJYWr-sH6HNPpG4~RxUImLP4ZQGiFUHlNyR2u6p6IDCEVbaIB3d8~o5XokbvlmcSdyESKPgO9HAqS3s97choRHRDnCOICgaZns9pXLhPaImKe35cv7D1oRgzKonV9NElKJgtfCxNCA__';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function WelcomePage() {
  const { setView, hasSavedProgress, resumeAssessment, resetAssessment } = useAssessment();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero section */}
      <div className="relative min-h-screen flex items-center">
        {/* Background image — right side */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-0 top-0 w-full h-full lg:w-3/5">
            <img
              src={HERO_IMG}
              alt=""
              className="w-full h-full object-cover opacity-40 lg:opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
          </div>
        </div>

        <div className="relative z-10 container py-16 lg:py-24">
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-navy/8 text-brand-navy text-sm font-medium mb-8"
            >
              <Clock className="w-4 h-4" />
              <span>7-minute clarity tool</span>
            </motion.div>

            {/* Headline — v5: Clarity & Capacity Assessment */}
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-brand-navy mb-6"
            >
              Clarity &<br />
              <span className="text-brand-blue">Capacity</span>{' '}
              Assessment
            </motion.h1>

            {/* Brand context — subtle, not AVA-definition-heavy */}
            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-sm text-brand-muted bg-brand-sky/60 border border-brand-light-blue/30 rounded-lg px-4 py-2.5 mb-5 max-w-xl"
            >
              Powered by{' '}
              <a href="https://justaskava.com" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline font-medium">
                Just Ask AVA
              </a>{' '}
              &mdash; skilled, full-time Executive Assistants for business owners ready to stop being the bottleneck.
            </motion.p>

            {/* Subheadline */}
            <motion.p
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-lg sm:text-xl text-foreground/70 leading-relaxed mb-4 max-w-xl"
            >
              This isn&rsquo;t a test. It&rsquo;s a clarity tool that helps you see{' '}
              <em className="text-brand-navy font-medium not-italic">where your time is going</em>,
              what to delegate first, and what kind of Executive Assistant will help you most.
            </motion.p>

            <motion.p
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-base text-muted-foreground leading-relaxed mb-10 max-w-xl"
            >
              In about 7 minutes, you&rsquo;ll get your personalized Time Buyback Score,
              your top tasks to offload, and a best-fit support recommendation.
            </motion.p>

            {/* CTA */}
            <motion.div
              custom={5}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="space-y-3"
            >
              {hasSavedProgress ? (
                <>
                  {/* Resume banner */}
                  <div className="bg-brand-sky/60 border border-brand-light-blue/30 rounded-xl px-5 py-4 mb-2">
                    <p className="text-sm text-brand-navy font-medium mb-0.5">
                      You have saved progress
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Pick up where you left off, or start fresh.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      size="lg"
                      onClick={resumeAssessment}
                      className="bg-brand-green hover:bg-brand-green-light text-white px-8 py-6 text-lg font-medium rounded-xl shadow-lg shadow-brand-green/15 transition-all duration-300 hover:shadow-xl hover:shadow-brand-green/20 hover:-translate-y-0.5 group"
                    >
                      Continue Assessment
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => { resetAssessment(); setView('assessment'); window.scrollTo({ top: 0 }); }}
                      className="border-border text-foreground/70 hover:bg-secondary/50 px-6 py-6 text-base rounded-xl"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Start Over
                    </Button>
                  </div>
                </>
              ) : (
                <Button
                  size="lg"
                  onClick={() => { trackEvent('start_assessment_clicked'); setView('assessment'); window.scrollTo({ top: 0 }); }}
                  className="bg-brand-green hover:bg-brand-green-light text-white px-8 py-6 text-lg font-medium rounded-xl shadow-lg shadow-brand-green/15 transition-all duration-300 hover:shadow-xl hover:shadow-brand-green/20 hover:-translate-y-0.5 group"
                >
                  Start Your Assessment
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* What you'll get section */}
      <div className="relative bg-brand-sky/40 py-20 lg:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-brand-navy mb-4">
              What you&rsquo;ll get instantly
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Real insights, not generic advice. Every result is based on your answers.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Target,
                title: 'Time Buyback Score',
                desc: 'How much time you\u2019re likely to reclaim quickly with an Executive Assistant.',
                colorClass: 'text-brand-navy bg-brand-navy/8',
              },
              {
                icon: Shield,
                title: 'Assistant Readiness Score',
                desc: 'How smoothly you can hand off ownership without stress.',
                colorClass: 'text-brand-blue bg-brand-blue/8',
              },
              {
                icon: Sparkles,
                title: 'Top Tasks to Offload',
                desc: 'Your personalized list of what your assistant takes off your plate first.',
                colorClass: 'text-brand-green bg-brand-green/8',
              },
              {
                icon: ArrowRight,
                title: 'Best-Fit Match',
                desc: 'The assistant type, onboarding style, and communication cadence that fits you.',
                colorClass: 'text-brand-light-blue bg-brand-light-blue/8',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-border/60 hover:shadow-md transition-shadow duration-300"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${item.colorClass}`}
                >
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-brand-navy mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Reassurance strip */}
      <div className="bg-brand-navy py-12">
        <div className="container text-center">
          <p className="text-brand-light-blue/70 text-sm tracking-wide uppercase mb-3 font-medium">
            Powered by
          </p>
          <p className="font-serif text-2xl sm:text-3xl text-white font-semibold mb-3">
            Just Ask AVA
          </p>
          <p className="text-brand-light-blue/80 text-base max-w-lg mx-auto leading-relaxed">
            Skilled, proactive Executive Assistants who help business owners buy back time,
            stop being the bottleneck, and create follow-through. Full-time, $2,500/month.
          </p>
        </div>
      </div>
    </div>
  );
}
