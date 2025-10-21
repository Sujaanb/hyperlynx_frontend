import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Radar, GitBranch, FileSearch, Bot } from 'lucide-react';

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: <Radar size={48} />,
      title: 'Regulatory Horizon Scanning',
      description:
        'Real-time monitoring of regulatory changes across multiple jurisdictions. Stay ahead with automated alerts for compliance requirements.',
      color: 'bg-secondary',
    },
    {
      icon: <GitBranch size={48} />,
      title: 'Change Management',
      description:
        'Automated tracking and management of regulatory updates. Streamline your compliance workflow with intelligent change detection.',
      color: 'bg-accent',
    },
    {
      icon: <FileSearch size={48} />,
      title: 'Gap Analysis',
      description:
        'Identify compliance gaps in your policies and procedures. Get actionable insights to maintain 100% regulatory adherence.',
      color: 'bg-success',
    },
    {
      icon: <Bot size={48} />,
      title: 'AI Compliance Assistant',
      description:
        '24/7 AI-powered support for compliance queries. Get instant answers to complex regulatory questions with confidence.',
      color: 'bg-warning',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section id="features" className="py-20 bg-white" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Comprehensive Compliance Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to manage cyber regulatory compliance for your fintech, powered by cutting-edge AI technology.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-slate-50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-secondary/30"
            >
              <div
                className={`${feature.color} w-20 h-20 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/10 to-transparent rounded-2xl transform translate-x-8 -translate-y-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
