import { useEffect } from 'react';
const useRegisterPlugin = () => {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            console.log('GSAP ScrollTrigger registered');
        }
    }, []);
};
export default useRegisterPlugin;
