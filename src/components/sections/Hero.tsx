import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle, AlertTriangle } from 'lucide-react';

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
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-light to-secondary overflow-hidden pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-light rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-white"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Automate Cyber Compliance with{' '}
              <span className="text-accent">AI</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed"
            >
              Streamline regulatory change management for fintechs. Stay compliant, reduce risk, and focus on what matters.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a href="#contact" className="btn-secondary text-center">
                Get Started
              </a>
              <a
                href="#features"
                className="bg-white text-secondary hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-all duration-300 text-center"
              >
                Learn More
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

          {/* Right Content - Animated Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[500px] flex items-center justify-center">
              {/* Central Shield */}
              <motion.div
                animate={floatingAnimation}
                className="absolute z-20 bg-white p-8 rounded-3xl shadow-2xl"
              >
                <Shield size={120} className="text-secondary" strokeWidth={1.5} />
              </motion.div>

              {/* Orbiting Icons */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute w-80 h-80"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-accent p-4 rounded-2xl shadow-xl">
                  <Lock size={32} className="text-white" />
                </div>
              </motion.div>

              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute w-96 h-96"
              >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-success p-4 rounded-2xl shadow-xl">
                  <CheckCircle size={32} className="text-white" />
                </div>
              </motion.div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute w-[450px] h-[450px]"
              >
                <div className="absolute top-1/2 right-0 -translate-y-1/2 bg-warning p-4 rounded-2xl shadow-xl">
                  <AlertTriangle size={32} className="text-white" />
                </div>
              </motion.div>

              {/* Decorative circles */}
              <div className="absolute w-80 h-80 border-2 border-white/20 rounded-full"></div>
              <div className="absolute w-96 h-96 border-2 border-white/20 rounded-full"></div>
              <div className="absolute w-[450px] h-[450px] border-2 border-white/20 rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#F8FAFC"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
