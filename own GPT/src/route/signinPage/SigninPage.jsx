import { SignIn } from '@clerk/clerk-react';
import React from 'react'
import './signin.css'

function SigninPage() {
    return (
        <div className="signinPage">

            <SignIn path="/sign-in" signUpUrl='/sign-up' forceRedirectUrl={'/dashbord'}/>
        </div>
    )
}

export default SigninPage
