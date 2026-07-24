import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Expertise from './components/Expertise';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Products from './components/Products';
import Research from './components/Research';
import Blog from './components/Blog';
import Education from './components/Education';
import Certifications from './components/Certifications';
import Hobbies from './components/Hobbies';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  // Scroll progress bar across the very top.
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, mass: 0.3 });

  return (
    <>
      <motion.div
        style={{ scaleX }}
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent-gradient"
      />
      <Navbar />
      <main>
        {/* Order is deliberate: the universe opens, the person is introduced,
            then the work, then the credentials, then the human bits. */}
        <Hero />
        <About />
        <Expertise />
        <Skills />
        <Experience />
        <Products />
        <Research />
        <Blog />
        <Education />
        <Certifications />
        <Hobbies />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
