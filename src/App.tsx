import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Features from './components/sections/Features';
import Impact from './components/sections/Impact';
import FAQ from './components/sections/FAQ';
import Copilot from './components/Copilot';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <Impact />
        <FAQ />
      </main>
      <Footer />
      <Copilot />
    </div>
  );
}

export default App;
