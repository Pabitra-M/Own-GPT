import { SignUp } from '@clerk/clerk-react';
import React from 'react'
import './signup.css'

function SignupPage() {
    return (
        <div className="signupPage">

            <SignUp path="/sign-up" signInUrl='/sign-in' forceRedirectUrl={'/dashbord'} />
        </div>
    )
}

export default SignupPage
