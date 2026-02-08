import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { reset_password } from '~/utils/Api/authentication';
import './reset_password.css';
const MIN_PASSWORD_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const Message = ({ type, message }) => (
    <h6 className={`msg ${type === 'error' ? 'msg-error' : 'msg-success'}`}>
        {message}
    </h6>
);

function Reset_password() {
    const { id: token } = useParams(); 
    const navigate = useNavigate();

    const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [redirecting, setRedirecting] = useState(false);

    function handle_change(e) {
        setError(null);
        setSuccess(null);
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const validate_password = (password) => {
        if (password.length < MIN_PASSWORD_LENGTH) {
            return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
        }
        if (!PASSWORD_REGEX.test(password)) {
            return "Password must include uppercase, lowercase, number, and a special character.";
        }
        return null;
    };

    async function handle_submit(e) {
        e.preventDefault();
        setIsSubmitting(true);

        if (form.newPassword !== form.confirmPassword) {
            setError("Passwords do not match.");
            setTimeout(() => setError(null), 4000);
            setIsSubmitting(false);
            return;
        }

        const validationError = validate_password(form.newPassword);
        if (validationError) {
            setError(validationError);
            setTimeout(() => setError(null), 4000);
            setIsSubmitting(false);
            return;
        }

        if (!token) {
            setError("Missing required token. Cannot reset password.");
            setTimeout(() => setError(null), 4000);
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await reset_password(form.newPassword, token);
            setSuccess(response || "Password reset successfully!");
            setRedirecting(true);
            setTimeout(() => setSuccess(null), 4000);

            setTimeout(() => navigate('/login', { replace: true }), 6000);
        } catch (err) {
            const message = err?.message || "An unexpected error occurred during reset.";
            setError(message);
            setTimeout(() => setError(null), 4000);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (redirecting) {
        return (
            <div className="redirect-container">
                <h3>Redirecting to Login...</h3>
            </div>
        );
    }

    return (
        <div className="reset-wrapper">
            <form onSubmit={handle_submit} className="reset-form">
                <h5 className="reset-title">Reset Password</h5>

                <div className="input-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input 
                        type="password" 
                        name="newPassword" 
                        id="newPassword"
                        value={form.newPassword} 
                        onChange={handle_change} 
                        required 
                        disabled={isSubmitting}
                    />
                    <p className="input-info">Min {MIN_PASSWORD_LENGTH} chars, must include symbols and numbers.</p>
                </div>

                <div className="input-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        id="confirmPassword"
                        value={form.confirmPassword} 
                        onChange={handle_change}
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`submit-btn ${isSubmitting ? 'disabled' : ''}`}
                >
                    {isSubmitting ? 'Resetting...' : 'Set New Password'}
                </button>
            </form>

            {error && <Message type="error" message={error} />}
            {success && <Message type="success" message={success} />}
        </div>
    );
}

export default Reset_password;
