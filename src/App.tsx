import { useState } from 'react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Card } from './components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion';
import { ChevronRight, Check, X, Search, TrendingUp, Users, BarChart3, Shield, FileText, Sparkles, Globe, Lock } from 'lucide-react';
import { CopilotChat } from './components/CopilotChat';
import logo from './assets/logo.png';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[9+9+6-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />/
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/40 backdrop-blur-xl border-b border-white/[0.08] z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2">
            <img src={logo} alt="Hyperlynx" className="h-8" />
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-500 hover:text-gray-300 transition-colors">Features</a>
            <a href="#workflow" className="text-gray-500 hover:text-gray-300 transition-colors">Workflow</a>
            <a href="#faq" className="text-gray-500 hover:text-gray-300 transition-colors">FAQ</a>
            <a href="#contact" className="text-gray-500 hover:text-gray-300 transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-4">
            <Button className="bg-white text-black hover:bg-gray-200">Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <Badge className="bg-white/[0.05] text-gray-300 border-white/[0.08] mb-4 sm:mb-6 hover:bg-white/[0.08] transition-colors text-xs sm:text-sm">
                Announcing Compliance Copilot
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6 leading-tight text-gray-100">
                Agentic AI for Cyber Compliance
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-400 mb-6 sm:mb-8 leading-relaxed">
                Streamline regulatory change management for fintechs. Stay compliant, reduce risk, and focus on what matters.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <Button className="w-full sm:w-auto bg-white text-black hover:bg-gray-200">
                  Request a Demo
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/[0.08] flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400" />
                  </div>
                  <span className="text-gray-500">SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/[0.08] flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400" />
                  </div>
                  <span className="text-gray-500">ISO 27001 Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/[0.08] flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400" />
                  </div>
                  <span className="text-gray-500">GDPR Ready</span>
                </div>
              </div>
            </div>

            {/* 3D Hero Element */}
            <div className="relative">
              <div className="absolute inset-0 bg-white/[0.03] blur-3xl rounded-full" />
              <div className="relative bg-white/[0.02] backdrop-blur-2xl rounded-3xl p-8 border border-white/[0.08] shadow-2xl">
                <div className="mb-6">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 mb-4">
                    New Regulation Detected
                  </Badge>
                  <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/[0.08] mb-6">
                    <div className="text-sm text-gray-500 mb-2">GDPR Article 32</div>
                    <h3 className="text-2xl mb-2 text-gray-200">Security of Processing</h3>
                    <p className="text-sm text-gray-500">Technical and organizational measures to ensure appropriate security</p>
                  </div>
                </div>

                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <div className="w-48 h-16 bg-white/[0.05] rounded-full border border-white/[0.1] flex items-center justify-center backdrop-blur-md">
                      <div className="text-center">
                        <div className="text-gray-200">Hyperlynx AI</div>
                        <div className="text-xs text-gray-500">Processing...</div>
                      </div>
                    </div>
                    <div className="absolute -bottom-8 left-1/2 w-0.5 h-12 bg-gradient-to-b from-white/[0.1] to-transparent -translate-x-1/2" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-12">
                  <div className="bg-white/[0.03] backdrop-blur-sm rounded-lg p-4 border border-white/[0.08] text-center">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-gray-300 text-sm">Extract</div>
                    <div className="text-xs text-gray-600">Requirements</div>
                  </div>
                  <div className="bg-white/[0.03] backdrop-blur-sm rounded-lg p-4 border border-white/[0.08] text-center">
                    <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-gray-300 text-sm">Analyze</div>
                    <div className="text-xs text-gray-600">Impact</div>
                  </div>
                  <div className="bg-white/[0.03] backdrop-blur-sm rounded-lg p-4 border border-white/[0.08] text-center">
                    <Shield className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-gray-300 text-sm">Assess</div>
                    <div className="text-xs text-gray-600">Gaps</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 px-6 border-t border-white/[0.05]">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-white/[0.03] text-gray-400 border-white/[0.08] mb-6">Compliance Automation Platform</Badge>
          <h2 className="text-4xl mb-6 text-gray-200">
            Everything you need to manage cyber regulatory compliance for your fintech, powered by cutting-edge AI technology.
          </h2>
          <p className="text-xl text-gray-500">
            Monitor regulatory changes across 100+ sources, automate gap analysis, and get AI-powered recommendations in real-time.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature 1 - Regulatory Scanning */}
            <Card className="bg-white/[0.02] backdrop-blur-xl border-white/[0.08] p-8 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] backdrop-blur-sm flex items-center justify-center group-hover:bg-white/[0.1] transition-colors border border-white/[0.05]">
                  <Globe className="w-6 h-6 text-gray-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl mb-2 text-gray-200">Regulatory Horizon Scanning</h3>
                  <p className="text-sm text-gray-600">CONTINUOUS MONITORING</p>
                </div>
              </div>
              
              <p className="text-gray-500 mb-6 leading-relaxed">
                Real-time monitoring of regulatory changes across multiple jurisdictions. Track US federal regulators (SEC, FINRA, CFPB, OCC), European authorities (EBA, FCA, ESMA), and international bodies (FSB, BCBS, IOSCO).
              </p>

              <div className="space-y-3">
                <div className="bg-white/[0.03] backdrop-blur-sm rounded-lg p-4 border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Active Sources</span>
                    <span className="text-gray-200">127</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div className="h-full bg-gray-400 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Check className="w-4 h-4 text-gray-400" />
                  <span>Automated alerts for new regulations</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Check className="w-4 h-4 text-gray-400" />
                  <span>Multi-jurisdiction coverage</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Check className="w-4 h-4 text-gray-400" />
                  <span>Daily regulatory updates</span>
                </div>
              </div>
            </Card>

            {/* Feature 2 - Change Management */}
            <Card className="bg-white/[0.02] backdrop-blur-xl border-white/[0.08] p-8 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] backdrop-blur-sm flex items-center justify-center group-hover:bg-white/[0.1] transition-colors border border-white/[0.05]">
                  <TrendingUp className="w-6 h-6 text-gray-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl mb-2 text-gray-200">Change Management</h3>
                  <p className="text-sm text-gray-600">INTELLIGENT TRACKING</p>
                </div>
              </div>
              
              <p className="text-gray-500 mb-6 leading-relaxed">
                Automated tracking and management of regulatory updates. Our AI engine detects changes, classifies their impact, and generates actionable recommendations for your compliance team.
              </p>

              <div className="space-y-3">
                <div className="bg-white/[0.03] backdrop-blur-sm rounded-lg p-4 border border-white/[0.06]">
                  <div className="text-xs text-gray-600 mb-2">RECENT CHANGES</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">SEC Cyber Disclosure</span>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">High Impact</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">DORA Updates</span>
                      <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs">Medium</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">GDPR Amendment</span>
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">Low Impact</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Check className="w-4 h-4 text-gray-400" />
                  <span>Automatic change detection</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Check className="w-4 h-4 text-gray-400" />
                  <span>Impact classification</span>
                </div>
              </div>
            </Card>

            {/* Feature 3 - Gap Analysis */}
            <Card className="bg-white/[0.02] backdrop-blur-xl border-white/[0.08] p-8 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] backdrop-blur-sm flex items-center justify-center group-hover:bg-white/[0.1] transition-colors border border-white/[0.05]">
                  <BarChart3 className="w-6 h-6 text-gray-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl mb-2 text-gray-200">Gap Analysis</h3>
                  <p className="text-sm text-gray-600">COMPLIANCE ASSESSMENT</p>
                </div>
              </div>
              
              <p className="text-gray-500 mb-6 leading-relaxed">
                Identify compliance gaps in your policies and procedures automatically. Compare your current state against regulatory requirements and get prioritized remediation steps.
              </p>

              <div className="space-y-3">
                <div className="bg-white/[0.03] backdrop-blur-sm rounded-lg p-4 border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">Compliance Score</span>
                    <span className="text-2xl text-gray-200">94%</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Policies Reviewed</span>
                      <span className="text-gray-400">87/92</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Requirements Met</span>
                      <span className="text-gray-400">234/249</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Open Gaps</span>
                      <span className="text-emerald-400">15</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Check className="w-4 h-4 text-gray-400" />
                  <span>Automated policy mapping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Check className="w-4 h-4 text-gray-400" />
                  <span>Prioritized remediation</span>
                </div>
              </div>
            </Card>

            {/* Feature 4 - AI Assistant */}
            <Card className="bg-white/[0.02] backdrop-blur-xl border-white/[0.08] p-8 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] backdrop-blur-sm flex items-center justify-center group-hover:bg-white/[0.1] transition-colors border border-white/[0.05]">
                  <Sparkles className="w-6 h-6 text-gray-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl mb-2 text-gray-200">AI Compliance Assistant</h3>
                  <p className="text-sm text-gray-600">24/7 SUPPORT</p>
                </div>
              </div>
              
              <p className="text-gray-500 mb-6 leading-relaxed">
                Get instant answers to complex regulatory questions. Our AI assistant is trained on thousands of compliance documents and provides accurate, source-backed responses.
              </p>

              <div className="space-y-3">
                <div className="bg-white/[0.03] backdrop-blur-sm rounded-lg p-4 border border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-600">ONLINE</span>
                  </div>
                  <div className="bg-white/[0.04] rounded-lg p-3 mb-2 text-sm text-gray-400">
                    What are the GDPR breach notification requirements?
                  </div>
                  <div className="bg-white/[0.06] rounded-lg p-3 text-sm text-gray-300">
                    Breaches must be reported within 72 hours to the supervisory authority...
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Check className="w-4 h-4 text-gray-400" />
                  <span>Natural language queries</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Check className="w-4 h-4 text-gray-400" />
                  <span>Source citations provided</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Check className="w-4 h-4 text-gray-400" />
                  <span>Instant responses</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl mb-3 text-gray-200">100+</div>
              <div className="text-gray-400">Regulatory Sources</div>
              <p className="text-sm text-gray-600 mt-2">Continuous monitoring across US, EU, and international bodies</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-3 text-gray-200">99.9%</div>
              <div className="text-gray-400">Accuracy Rate</div>
              <p className="text-sm text-gray-600 mt-2">AI-powered analysis validated by compliance experts</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-3 text-gray-200">24/7</div>
              <div className="text-gray-400">Continuous Monitoring</div>
              <p className="text-sm text-gray-600 mt-2">Real-time alerts and updates delivered instantly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Transformation */}
      <section id="workflow" className="py-20 px-6 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4 text-gray-200">Transform Your Compliance Workflow</h2>
            <p className="text-xl text-gray-500">See how Hyperlynx revolutionizes regulatory change management</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Comparison 1 */}
            <Card className="bg-white/[0.02] backdrop-blur-xl border-white/[0.08] p-6 hover:bg-white/[0.04] transition-all">
              <div className="flex items-center gap-2 text-red-400/60 mb-4">
                <X className="w-4 h-4" />
                <span className="text-sm text-gray-400">Manual Monitoring</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">Hours spent tracking regulatory updates across multiple sources daily</p>
              
              <div className="border-t border-white/[0.06] pt-6">
                <div className="flex items-center gap-2 text-emerald-400 mb-3">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">80% Less Noise</span>
                </div>
                <div className="text-gray-200 mb-2">Automated Scanning</div>
                <p className="text-gray-500 text-sm">AI filters and prioritizes changes, delivering only what matters to your dashboard</p>
              </div>
            </Card>

            <Card className="bg-white/[0.02] backdrop-blur-xl border-white/[0.08] p-6 hover:bg-white/[0.04] transition-all">
              <div className="flex items-center gap-2 text-red-400/60 mb-4">
                <X className="w-4 h-4" />
                <span className="text-sm text-gray-400">1-3 Weeks Analysis</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">Lengthy review cycles to assess impact and determine next steps</p>
              
              <div className="border-t border-white/[0.06] pt-6">
                <div className="flex items-center gap-2 text-emerald-400 mb-3">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">90% Faster</span>
                </div>
                <div className="text-gray-200 mb-2">&lt;2 Days Response</div>
                <p className="text-gray-500 text-sm">AI-powered impact analysis provides immediate, actionable recommendations</p>
              </div>
            </Card>

            <Card className="bg-white/[0.02] backdrop-blur-xl border-white/[0.08] p-6 hover:bg-white/[0.04] transition-all">
              <div className="flex items-center gap-2 text-red-400/60 mb-4">
                <X className="w-4 h-4" />
                <span className="text-sm text-gray-400">Scattered Records</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">Incomplete documentation with gaps in compliance audit trail</p>
              
              <div className="border-t border-white/[0.06] pt-6">
                <div className="flex items-center gap-2 text-emerald-400 mb-3">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Complete Visibility</span>
                </div>
                <div className="text-gray-200 mb-2">100% Audit Trail</div>
                <p className="text-gray-500 text-sm">Automated documentation and centralized record-keeping for every change</p>
              </div>
            </Card>

            <Card className="bg-white/[0.02] backdrop-blur-xl border-white/[0.08] p-6 hover:bg-white/[0.04] transition-all">
              <div className="flex items-center gap-2 text-red-400/60 mb-4">
                <X className="w-4 h-4" />
                <span className="text-sm text-gray-400">Manual Queries</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">Time-consuming research through regulatory documents and policies</p>
              
              <div className="border-t border-white/[0.06] pt-6">
                <div className="flex items-center gap-2 text-emerald-400 mb-3">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Instant Answers</span>
                </div>
                <div className="text-gray-200 mb-2">AI Assistant</div>
                <p className="text-gray-500 text-sm">Get immediate responses to compliance questions with source citations</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 border-t border-white/[0.05]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4 text-gray-200">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-500">Everything you need to know about Hyperlynx</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline text-left text-gray-200">
                What data sources does Hyperlynx monitor?
              </AccordionTrigger>
              <AccordionContent className="text-gray-500">
                Hyperlynx monitors over 100 regulatory sources including US federal and state regulators (SEC, FINRA, CFPB, OCC, state banking departments), European regulators (EBA, FCA, ESMA), international bodies (FSB, BCBS, IOSCO), and industry standards organizations. We continuously update our sources to ensure comprehensive coverage.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline text-left text-gray-200">
                How accurate is the AI-powered compliance analysis?
              </AccordionTrigger>
              <AccordionContent className="text-gray-500">
                Our AI maintains a 99.9% accuracy rate through continuous learning and validation against regulatory databases. Every analysis is backed by source documentation and can be reviewed by your compliance team.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline text-left text-gray-200">
                Can Hyperlynx integrate with existing compliance systems?
              </AccordionTrigger>
              <AccordionContent className="text-gray-500">
                Yes, Hyperlynx offers robust API integrations with major compliance management platforms, GRC tools, and documentation systems. Our team will work with you to ensure seamless integration.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline text-left text-gray-200">
                How long does implementation typically take?
              </AccordionTrigger>
              <AccordionContent className="text-gray-500">
                Most implementations are completed within 2-4 weeks, including data migration, team training, and system configuration. We provide dedicated support throughout the process.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline text-left text-gray-200">
                What security measures are in place to protect our data?
              </AccordionTrigger>
              <AccordionContent className="text-gray-500">
                Hyperlynx is SOC 2 Type II certified and ISO 27001 compliant. We use end-to-end encryption, regular security audits, and maintain strict access controls. All data is stored in secure, redundant cloud infrastructure.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline text-left text-gray-200">
                How does pricing work?
              </AccordionTrigger>
              <AccordionContent className="text-gray-500">
                We offer flexible pricing based on your organization's size and needs. Contact our sales team for a customized quote that fits your compliance requirements.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline text-left text-gray-200">
                What kind of support and training do you provide?
              </AccordionTrigger>
              <AccordionContent className="text-gray-500">
                We provide comprehensive onboarding, live training sessions, detailed documentation, and 24/7 customer support. Your success team will be available for ongoing assistance and best practices guidance.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-6 border-t border-white/[0.05]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl mb-4 text-gray-200">Ready to Transform Your Compliance?</h2>
          <p className="text-xl text-gray-500 mb-8">Join leading fintechs using Hyperlynx to stay ahead of regulations</p>
          <Button className="bg-white text-black hover:bg-gray-200">
            Request a Demo
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img src={logo} alt="Hyperlynx" className="h-8" />
              </div>
              <p className="text-gray-500 text-sm mb-6 max-w-sm">
                AI-powered cyber regulatory compliance platform for modern fintechs. Automate compliance, reduce risk, and stay ahead of regulations.
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-gray-200">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#features" className="hover:text-gray-300 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-gray-200">Company</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-gray-300 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Blog</a></li>
                <li><a href="#contact" className="hover:text-gray-300 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-gray-200">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-gray-300 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Webinars</a></li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-white/[0.05]">
            <div>
              <h4 className="mb-4 text-gray-200">Legal</h4>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-gray-300 transition-colors">Cookie Policy</a>
                <a href="#" className="hover:text-gray-300 transition-colors">DPA</a>
              </div>
            </div>

            <div className="flex items-center gap-3 md:justify-end flex-wrap">
              <Badge className="bg-white/[0.03] text-gray-400 border-white/[0.08]">SOC 2 Type II</Badge>
              <Badge className="bg-white/[0.03] text-gray-400 border-white/[0.08]">ISO 27001</Badge>
              <Badge className="bg-white/[0.03] text-gray-400 border-white/[0.08]">GDPR Compliant</Badge>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2025 Hyperlynx. All rights reserved.</p>
            <p>Made with precision for fintech compliance</p>
          </div>
        </div>
      </footer>

      {/* Copilot Chat Widget */}
      <CopilotChat />
      </div>
    </div>
  );
}
