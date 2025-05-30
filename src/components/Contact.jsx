import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser'

import { styles } from '../styles';
import { ComputersCanvas } from './canvas';
import { SectionWrapper } from '../hoc';
import { slideIn } from '../utils/motion';

const Contact = () => {
  const formRef = useRef();

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value })
  }

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
    )
      .then(() => {
        setLoading(false);
        alert("Thank you! I will get back to you as soon as possible.");

        setForm({
          name: '',
          email: '',
          message: '',
        });
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        alert('Something went wrong.');
      });


  }

  return (
    <div className="xl:mt-12 lg:flex-row flex-col-reverse flex lg:gap-4 gap-10 pb-32 overflow-hidden">
      <motion.div
        variants={slideIn('left', "tween", 0.2, 1)}
        className="basis-5/12 bg-color-4 p-8 rounded-2xl">
        <p className={styles.sectionSubText}>GET IN TOUCH</p>
        <h3 className={styles.sectionHeadText}>Contact.</h3>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-12 flex flex-col gap-8">
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your Name</span>
            <input
              type='text'
              name='name'
              value={form.name}
              onChange={handleChange}
              placeholder="What's your name?"
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outlined-none border-none font-medium"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your Email</span>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              placeholder="What's your email?"
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outlined-none border-none font-medium"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your Message</span>
            <textarea
              rows='4'
              name='message'
              value={form.message}
              onChange={handleChange}
              placeholder="What do you want to say?"
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outlined-none border-none font-medium"
            />
          </label>

          <button
            className='bg-tertiary py-3 px-8 outline-none w-fit text-white font-bold shadow-md shadow-primary rounded-xl'
            type='submit'>{loading ? 'Sending...' : 'Send'}</button>
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

        < ComputersCanvas/>
      </motion.div>
    </div>
  )
}

export default SectionWrapper(Contact, "contact");