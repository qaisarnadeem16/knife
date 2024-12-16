import React, { useEffect, useState } from 'react';

const Resize = ({ children }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const shouldDisplayContent = width > 600 && height > 400;

  return (
    <div>
      {shouldDisplayContent && (
        <p>This content is displayed when the screen size is larger than 600px in width and 400px in height.</p>
      )}
      {children}
    </div>
  );
};

export default Resize;
