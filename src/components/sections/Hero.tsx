import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import complianceImage from '../../assets/compliance_image.png';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] as any },
    },
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden pt-20">
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-black"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Automate Cyber Compliance with{' '}
              <span className="text-secondary">AI</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl mb-8 text-gray-700 leading-relaxed"
            >
              Streamline regulatory change management for fintechs. Stay compliant, reduce risk, and focus on what matters.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="https://forms.gle/1HPmiMKf8ksfPo6W7"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-center"
              >
                Request a Demo
              </a>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-12 flex flex-wrap gap-6 text-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="text-success" size={20} />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-success" size={20} />
                <span>ISO 27001 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-success" size={20} />
                <span>GDPR Ready</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Compliance Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative hidden lg:block"
          >
            <img
              src={complianceImage}
              alt="Compliance Automation"
              className="w-full h-auto rounded-2xl shadow-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
