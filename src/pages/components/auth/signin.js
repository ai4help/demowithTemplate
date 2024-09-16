import { useState } from 'react';
import { signIn } from 'next-auth/react';
import axios from 'axios'; // For making API requests

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [code, setCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState('');

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            // Call API to send verification code
            await axios.post('/api/auth/send-code', { email });
            setIsCodeSent(true);
            setError('');
        } catch (err) {
            setError('Failed to send verification code. Try again.');
        }
    };

    const handleCodeVerification = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/verify-code', { email, code });
            if (response.data.success) {
                setIsVerified(true);
                setError('');
                // Log the user in (could set session manually or redirect)
            } else {
                setError('Invalid verification code. Try again.');
            }
        } catch (err) {
            setError('Verification failed. Try again.');
        }
    };

    return (
        <div className="signin-container">
            {/* Left Section */}
            <div className="signin-left-section">
                <div className="signin-welcome-text">
                    <h1>Hello SaleSkip! 👋</h1>
                    <p>Skip repetitive and manual sales-marketing tasks. Get highly productive through automation and save tons of time!</p>
                </div>
            </div>

            {/* Right Section */}
            <div className="signin-right-section">
                <div className="signin-form-container">
                    <h2>SaleSkip</h2>
                    {!isCodeSent ? (
                        <>
                            <h3>Welcome Back!</h3>
                            <form className="signin-form" onSubmit={handleEmailSubmit}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="signin-input-field"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button type="submit" className="signin-continue-button">
                                    Continue
                                </button>
                            </form>
                            {error && <p className="signin-error">{error}</p>}
                        </>
                    ) : (
                        <>
                            <h3>Enter the code sent to {email}</h3>
                            <form className="signin-form" onSubmit={handleCodeVerification}>
                                <input
                                    type="text"
                                    placeholder="Enter Code"
                                    className="signin-input-field"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                />
                                <button type="submit" className="signin-continue-button">
                                    Verify and Login
                                </button>
                            </form>
                            {error && <p className="signin-error">{error}</p>}
                        </>
                    )}

                    <div className="signin-divider">
                        <hr />
                        <span>OR</span>
                        <hr />
                    </div>

                    <button
                        type="button"
                        onClick={() => signIn('google')}
                        className="signin-google-button"
                    >
                        Login with Google
                    </button>

                    <a href="#" className="signin-forgot-password">
                        Forgot password? <span>Click here</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
