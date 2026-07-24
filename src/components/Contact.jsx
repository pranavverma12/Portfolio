import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';
import SectionTitle from './SectionTitle';
import { profile } from '../data/content';
import { stagger, rise, inView, spring } from './anim';

// Floating-label field with a focus micro-interaction (label lifts, accent underline grows).
function Field({ id, label, type = 'text', textarea = false, value, onChange, required }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  const Tag = textarea ? 'textarea' : 'input';

  return (
    <div className="relative">
      <Tag
        id={id}
        name={id}
        type={textarea ? undefined : type}
        rows={textarea ? 5 : undefined}
        value={value}
        required={required}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`peer w-full resize-none rounded-xl bg-ink/60 px-4 pb-2.5 pt-6 text-white shadow-neu-inset outline-none ring-1 transition-all ${
          focused ? 'ring-accent/50' : 'ring-white/[0.04]'
        }`}
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-4 origin-left transition-all duration-200 ${
          active ? 'top-2 text-xs text-accent' : 'top-4 text-base text-body'
        }`}
      >
        {label}
      </label>
      {/* Growing accent underline on focus */}
      <span
        className={`absolute inset-x-4 bottom-0 h-0.5 origin-left rounded-full bg-accent-gradient transition-transform duration-300 ${
          focused ? 'scale-x-100' : 'scale-x-0'
        }`}
      />
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend in this static build — open the user's mail client with the message,
    // then show the success state. Swap this for a real endpoint (Formspree/EmailJS) later.
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    const subject = encodeURIComponent(form.subject || `Portfolio enquiry from ${form.name}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="border-t border-white/5 py-24 sm:py-28">
      <div className="container-px">
        <SectionTitle eyebrow="Contact" title="Let's Work Together" />

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left — contact card */}
          <motion.div
            variants={stagger(0.1)}
            {...inView}
            className="flex flex-col rounded-2xl bg-surface p-8 shadow-neu"
          >
            <motion.div variants={rise} className="overflow-hidden rounded-2xl">
              <img src={profile.contactPhoto} alt={profile.name} className="h-56 w-full object-cover" />
            </motion.div>
            <motion.h3 variants={rise} className="mt-6 text-2xl font-bold text-white">
              {profile.name}
            </motion.h3>
            <motion.p variants={rise} className="text-accent-2">
              Data Analyst / Data Scientist
            </motion.p>
            <motion.p variants={rise} className="mt-4 text-[15px] leading-relaxed text-body">
              Connect with me via email or through my social profiles.
            </motion.p>
            <motion.a
              variants={rise}
              href={`mailto:${profile.email}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-accent"
            >
              <Icon name="mail" size={16} /> {profile.email}
            </motion.a>
            <motion.div variants={rise} className="mt-6">
              <p className="mb-3 text-xs uppercase tracking-widest text-body">Find me at</p>
              <div className="flex gap-3">
                {profile.socials.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    whileHover={{ scale: 1.12, y: -2 }}
                    transition={spring}
                    className="grid h-10 w-10 place-items-center rounded-full bg-ink/60 text-lightn/80 shadow-neu-inset hover:text-accent"
                  >
                    <Icon name={s.icon} size={18} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            variants={fadeWrap}
            {...inView}
            className="relative rounded-2xl bg-surface p-8 shadow-neu"
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={spring}
                  className="flex min-h-[420px] flex-col items-center justify-center text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ ...spring, delay: 0.1 }}
                    className="grid h-20 w-20 place-items-center rounded-full bg-accent/15 text-accent shadow-glow"
                  >
                    <Icon name="check-circle" size={40} />
                  </motion.div>
                  <h3 className="mt-6 text-2xl font-bold text-white">Message ready!</h3>
                  <p className="mt-2 max-w-sm text-body">
                    Your mail client just opened with the message pre-filled. Thanks for reaching out —
                    I&apos;ll reply as soon as I can.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="grid gap-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="name" label="Your Name" value={form.name} onChange={update('name')} required />
                    <Field id="email" label="Email" type="email" value={form.email} onChange={update('email')} required />
                  </div>
                  <Field id="subject" label="Subject" value={form.subject} onChange={update('subject')} />
                  <Field id="message" label="Your Message" textarea value={form.message} onChange={update('message')} required />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={spring}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-gradient px-7 py-3.5 text-base font-semibold text-white shadow-glow"
                  >
                    Send Message <Icon name="arrow-right" size={18} />
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const fadeWrap = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: spring },
};
