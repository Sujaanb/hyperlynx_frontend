import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Quote } from 'lucide-react';

const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const testimonials = [
    {
      quote:
        'Hyperlynx has transformed how we manage compliance. What used to take weeks now takes days, and we have complete confidence in our audit trail.',
      author: 'Sarah Chen',
      role: 'Chief Compliance Officer',
      company: 'FinTrust Digital',
    },
    {
      quote:
        'The AI-powered regulatory scanning is a game-changer. We stay ahead of compliance requirements without dedicating entire teams to manual monitoring.',
      author: 'Michael Rodriguez',
      role: 'VP of Risk Management',
      company: 'PayStream Solutions',
    },
    {
      quote:
        'As a fast-growing fintech, compliance was becoming our biggest bottleneck. Hyperlynx gave us back our velocity while improving our compliance posture.',
      author: 'Emily Watson',
      role: 'CEO',
      company: 'SwiftLedger',
    },
    {
      quote:
        'The gap analysis feature identified compliance issues we didn\'t even know existed. It\'s like having a compliance expert available 24/7.',
      author: 'David Kim',
      role: 'Head of Legal',
      company: 'CryptoBank Pro',
    },
    {
      quote:
        'Implementation was seamless, and the ROI was immediate. Our compliance costs dropped by 60% in the first quarter.',
      author: 'Lisa Martinez',
      role: 'CFO',
      company: 'NeoFinance Group',
    },
    {
      quote:
        'Hyperlynx doesn\'t just track regulations—it helps us understand them. The AI assistant is incredibly accurate and saves us countless hours.',
      author: 'James Anderson',
      role: 'Director of Compliance',
      company: 'Digital Wealth Partners',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="testimonials" className="py-20 bg-white" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Trusted by Leading Fintechs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what compliance leaders are saying about Hyperlynx
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 relative"
            >
              <div className="absolute top-6 right-6 text-secondary/20">
                <Quote size={48} />
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed relative z-10">
                "{testimonial.quote}"
              </p>
              <div className="border-t border-gray-300 pt-4">
                <p className="font-bold text-primary">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
                <p className="text-sm text-secondary font-medium">
                  {testimonial.company}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-8 font-medium">Backed by leading investors</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            <div className="text-2xl font-bold text-gray-700">Sequoia Capital</div>
            <div className="text-2xl font-bold text-gray-700">Andreessen Horowitz</div>
            <div className="text-2xl font-bold text-gray-700">Y Combinator</div>
            <div className="text-2xl font-bold text-gray-700">Accel Partners</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
