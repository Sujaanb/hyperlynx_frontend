import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { X, ArrowRight, CheckCircle, Clock, FileText } from 'lucide-react';

const Impact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const comparisons = [
    {
      before: {
        icon: <X size={32} className="text-red-500" />,
        title: 'Manual Monitoring',
        description: 'Hours spent tracking regulatory updates across multiple sources',
      },
      after: {
        icon: <CheckCircle size={32} className="text-success" />,
        title: 'Automated Scanning',
        description: 'Real-time alerts delivered instantly to your dashboard',
      },
      metric: 'Reduce noise by 80%',
    },
    {
      before: {
        icon: <Clock size={32} className="text-red-500" />,
        title: '1-3 Weeks Analysis',
        description: 'Lengthy review cycles to assess compliance impact',
      },
      after: {
        icon: <CheckCircle size={32} className="text-success" />,
        title: '<2 Days Response',
        description: 'AI-powered impact analysis with immediate recommendations',
      },
      metric: '90% faster response time',
    },
    {
      before: {
        icon: <FileText size={32} className="text-red-500" />,
        title: 'Incomplete Documentation',
        description: 'Scattered records with gaps in audit trail',
      },
      after: {
        icon: <CheckCircle size={32} className="text-success" />,
        title: '100% Audit Trail',
        description: 'Complete documentation with automated record-keeping',
      },
      metric: 'Full compliance visibility',
    },
  ];

  return (
    <section id="impact" className="py-20 bg-gradient-to-br from-slate-50 to-gray-100" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Transform Your Compliance Workflow
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how Hyperlynx revolutionizes the way fintechs handle regulatory compliance
          </p>
        </motion.div>

        <div className="space-y-12">
          {comparisons.map((comparison, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                {/* Before */}
                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start mb-4">
                    {comparison.before.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {comparison.before.title}
                  </h3>
                  <p className="text-gray-600">{comparison.before.description}</p>
                </div>

                {/* Arrow & Metric */}
                <div className="flex flex-col items-center justify-center space-y-4">
                  <ArrowRight
                    size={48}
                    className="text-secondary hidden lg:block"
                    strokeWidth={2}
                  />
                  <div className="lg:hidden">
                    <ArrowRight
                      size={48}
                      className="text-secondary rotate-90"
                      strokeWidth={2}
                    />
                  </div>
                  <div className="bg-accent/10 text-accent font-bold px-6 py-3 rounded-full text-center">
                    {comparison.metric}
                  </div>
                </div>

                {/* After */}
                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start mb-4">
                    {comparison.after.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {comparison.after.title}
                  </h3>
                  <p className="text-gray-600">{comparison.after.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-5xl font-bold text-secondary mb-2">500+</div>
            <div className="text-gray-600 font-medium">Regulatory Sources</div>
          </div>
          <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-5xl font-bold text-accent mb-2">24/7</div>
            <div className="text-gray-600 font-medium">Continuous Monitoring</div>
          </div>
          <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-5xl font-bold text-success mb-2">99.9%</div>
            <div className="text-gray-600 font-medium">Accuracy Rate</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Impact;
