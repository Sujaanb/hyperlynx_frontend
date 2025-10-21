import { Shield, Linkedin, Twitter, Github, Mail } from 'lucide-react';
import logo from '../../assets/hyperlynx_logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Security', href: '#security' },
      { name: 'Integrations', href: '#integrations' },
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Careers', href: '#careers' },
      { name: 'Blog', href: '#blog' },
      { name: 'Contact', href: '#contact' },
    ],
    resources: [
      { name: 'Documentation', href: '#docs' },
      { name: 'Help Center', href: '#help' },
      { name: 'Case Studies', href: '#case-studies' },
      { name: 'Webinars', href: '#webinars' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'DPA', href: '#dpa' },
    ],
  };

  const certifications = [
    { name: 'SOC 2 Type II', icon: <Shield size={20} /> },
    { name: 'ISO 27001', icon: <Shield size={20} /> },
    { name: 'GDPR Compliant', icon: <Shield size={20} /> },
  ];

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src={logo} alt="Hyperlynx Logo" className="h-10 w-10 brightness-0 invert" />
              <span className="text-2xl font-bold font-display">Hyperlynx</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              AI-powered cyber regulatory compliance platform for modern fintechs. Automate compliance, reduce risk, and stay ahead of regulations.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors duration-200"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors duration-200"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors duration-200"
              >
                <Github size={20} />
              </a>
              <a
                href="mailto:contact@hyperlynx.ai"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors duration-200"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-accent transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-accent transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-accent transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-accent transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Certifications */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg"
              >
                <div className="text-success">{cert.icon}</div>
                <span className="text-sm font-medium">{cert.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Hyperlynx. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              Made with precision for fintech compliance
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
