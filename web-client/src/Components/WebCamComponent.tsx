import React, { useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import Webcam from 'react-webcam';
import { Dispatch, SetStateAction } from 'react';

interface WebcamComponentProps {
  setShowCamera: Dispatch<SetStateAction<boolean>>;
  setImageUrl: Dispatch<SetStateAction<string | null>>;
}

const videoConstraints = {
  facingMode: 'user',
};

const WebcamComponent = forwardRef(({ setShowCamera, setImageUrl }: WebcamComponentProps, ref) => {
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImageUrl(imageSrc);
      setShowCamera(false);
    }
  }, [setShowCamera, setImageUrl]);

  useImperativeHandle(ref, () => ({
    capture,
  }));

  return (
    <div className="flex flex-col items-center gap-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-lg border-2 border-indigo-500"
        videoConstraints={videoConstraints}
      />
    </div>
  );
});

export default WebcamComponent;
