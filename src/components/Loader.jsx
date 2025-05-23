import { Html, useProgress } from '@react-three/drei';

const Loader = () => {
  const { progress } = useProgress();

  return <Html center style={{ color: 'white', fontSize: '20px' }}>{`Loading... ${progress.toFixed(0)}%`}</Html>;
}

export default Loader;

