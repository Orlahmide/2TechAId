import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import logo from '../assets/logo.jpeg';
import styles from './CreateAccount.module.css';

const CreateAccount = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('staff'); // Default role
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (register(name, email, password, role)) {
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      toast.error('Registration failed');
    }
  };

  return (
    <div className={styles.container}>
      <Toaster />
      <div className={styles.logoContainer}>
        <img src={logo} alt="Optimus TechAid" className={styles.logo} />
      </div>
      <div className={styles.formContainer}>
        <h1 className={styles.leftAlign}>Create Account</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>First Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Last Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={styles.input}
              required
            >
              <option value="it">IT Staff</option>
              <option value="staff">Other Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className={styles.button}>
            Create Account
          </button>
        </form>
        <p className={styles.link}>
          Already have an account? <Link to="/" className={styles.linkItem}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default CreateAccount;