import { BrowserRouter } from 'react-router-dom';

import {
  About, Contact,
  Welcome, Navbar, Projects
} from './components';

const App = () => {
  return (
    <BrowserRouter>
      <div className='relative z-0 bg-[#08080A]'>
        <div className='relative isolate z-10'>
          <Navbar />
          <Welcome />
        </div>

        <About />
        <Projects />

        <div className='relative z-0'>
          <Contact />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;