import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What data sources does Hyperlynx monitor?',
      answer:
        'Hyperlynx monitors over 500 regulatory sources including federal and state regulators (SEC, FINRA, CFPB, OCC, state banking departments), international bodies (FSB, BCBS, IOSCO), and industry standards organizations. We continuously update our sources to ensure comprehensive coverage.',
    },
    {
      question: 'How accurate is the AI-powered compliance analysis?',
      answer:
        'Our AI engine maintains a 99.9% accuracy rate, validated through continuous audits and expert review. The system is trained on millions of regulatory documents and is constantly learning from new compliance scenarios. All AI recommendations include confidence scores and supporting documentation.',
    },
    {
      question: 'Can Hyperlynx integrate with existing compliance systems?',
      answer:
        'Yes, Hyperlynx offers robust API integration with popular GRC platforms, document management systems, and workflow tools. We provide pre-built connectors for major systems and custom integration support for enterprise clients.',
    },
    {
      question: 'How long does implementation typically take?',
      answer:
        'Most organizations are up and running within 2-4 weeks. This includes initial setup, data integration, team training, and customization to your specific compliance framework. Our dedicated implementation team ensures a smooth onboarding process.',
    },
    {
      question: 'What security measures are in place to protect our data?',
      answer:
        'Hyperlynx is SOC 2 Type II certified, ISO 27001 compliant, and GDPR ready. We employ end-to-end encryption, role-based access controls, regular security audits, and maintain strict data residency options. Your compliance data never leaves your designated security perimeter.',
    },
    {
      question: 'How does pricing work?',
      answer:
        'Pricing is based on your organization size, number of jurisdictions monitored, and feature requirements. We offer flexible monthly and annual plans with no hidden fees. Contact us for a customized quote that fits your specific needs.',
    },
    {
      question: 'What kind of support and training do you provide?',
      answer:
        'All plans include comprehensive onboarding, live training sessions, and access to our knowledge base. Premium plans include dedicated compliance advisors, priority support, and quarterly strategy reviews with our compliance experts.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gradient-to-br from-slate-50 to-gray-100" ref={ref}>
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about Hyperlynx
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-primary pr-4">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown size={24} className="text-secondary" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-200 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center bg-gradient-to-br from-secondary to-secondary-dark text-white rounded-2xl p-12 shadow-xl"
        >
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Compliance?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join leading fintechs using Hyperlynx to stay ahead of regulations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="bg-white text-secondary hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Schedule a Demo
            </a>
            <a
              href="#contact"
              className="bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Contact Sales
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
