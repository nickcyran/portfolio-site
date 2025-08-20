import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

import { styles } from '../styles';
import { ComputersCanvas } from './canvas';
import { SectionWrapper } from '../hoc';
import { slideIn } from '../utils/motion';

const FormField = ({ label, type = 'text', name, value, onChange, placeholder, rows }) => {
  const InputComponent = type === 'textarea' ? 'textarea' : 'input';

  return (
    <label className="flex flex-col">
      <span className="font-medium mb-3 crt-text">
        {'>'} {label}:
      </span>
      <InputComponent
        type={type === 'textarea' ? undefined : type} name={name}
        value={value} onChange={onChange} placeholder={placeholder} rows={rows} 
        className="bg-black py-3 px-4 placeholder:text-terminal-placeholder rounded-md border border-terminal-sub focus:outline-none focus:border-terminal-main focus:ring-1 focus:ring-terminal-main font-mono crt-input"
      />
    </label>
  );
};

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        from_name: form.name,
        to_name: 'Nick',
        from_email: form.email,
        to_email: 'ncyran@albany.edu',
        message: form.message,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    ).then(() => {
      setLoading(false);
      alert("Message sent!");
      setForm({ name: '', email: '', message: '' });
    }).catch((error) => {
      setLoading(false);
      console.error(error);
      alert('Message failed. Check connection.');
    });
  };

  return (
    <div>
      <p className={`${styles.sectionSubText}`}>GET IN TOUCH</p>
      <h3 className={`${styles.sectionHeadText}`}>Contact.</h3>

      <div className="mt-5 lg:flex-row flex-col-reverse flex lg:gap-4 gap-10 pb-24 overflow-hidden">
        <motion.div
          variants={slideIn('left', "tween", 0.2, 1)}
          className="crt-container basis-5/12 bg-black p-8 rounded-lg border-2 border-terminal-sub font-mono text-green-500"
        >
          <p className="text-xl font-bold mb-4 crt-text">// CONTACT_FORM</p>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-6"
          >
            <FormField
              label="Your Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="USER@HOST:~$"
            />

            <FormField
              label="Your Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@domain.com"
            />

            <FormField
              label="Your Message"
              type="textarea"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Type your message here..."
              rows="4"
            />

            <button
              className='group bg-black border border-terminal-sub py-3 px-8 outline-none w-fit font-bold shadow-md shadow-terminal-main rounded-md font-mono hover:bg-terminal-main transition-colors duration-200 flex items-center'
              type='submit'>
              <span className="text-terminal-sub crt-button-text group-hover:text-black group-hover:crt-button-hover-text">
                {loading ? 'SENDING...' : 'SEND'}
              </span>
              {!loading && <span className="ml-1 w-2 h-4 animate-blink group-hover:bg-black"></span>}
            </button>
          </form>
        </motion.div>

        <motion.div
          variants={slideIn('right', "tween", 0.2, 1)}
          className="flex-shrink-0 
                     xs:h-[24rem] xs:w-[24rem]
                     sm:h-[30rem] sm:w-[30rem]
                     md:h-[32rem] md:w-[32rem] 
                     lg:h-[32rem] lg:w-[32rem]
                     h-[20rem] w-[20rem]
                     mx-auto my-auto">
          <ComputersCanvas />
        </motion.div>
      </div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");