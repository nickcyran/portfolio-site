import { BrowserRouter } from 'react-router-dom';

import {
  About, Contact,
  MainScreen, Navbar, Projects, StarsCanvas
} from './components';

const App = () => {
  return (
    <BrowserRouter>
      <div className='relative z-0 bg-gradient'>
        <div className='bg-begin bg-cover bg-center'>
          <Navbar />
          <MainScreen />
        </div>

        <About />
        <Projects />
        <div className='relative z-0'>
          <Contact />
          <StarsCanvas />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
