import { useEffect, useState } from "react";
import { auth, RecaptchaVerifier } from "../firebase";

export function useRecaptcha(componentId) {
    const [recaptcha, setRecaptcha] = useState();

    useEffect(() => {
        const recaptchaVerifier = new RecaptchaVerifier(auth, componentId, { "size": "invisible" });

        setRecaptcha(recaptchaVerifier);

        return () => {
            if (recaptchaVerifier) {
                console.log('Clearing reCAPTCHA verifier...');
                recaptchaVerifier.clear();
            }
        };
    }, [componentId]);

    return recaptcha;
}
