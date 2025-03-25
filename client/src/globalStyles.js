import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  /* Global Reset */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
  }

  /* Root Styles */
  :root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --background-color: #f8f9fa;
    --text-color: #333;
    --card-bg: #ffffff;
    --border-radius: 8px;
    --transition: 0.3s ease-in-out;
  }

  /* Body Styles */
  body {
    background-color: var(--background-color);
    color: var(--text-color);
    line-height: 1.6;
  }

  /* Container Utility */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  /* Form Styles */
  input, button {
    padding: 12px;
    border-radius: var(--border-radius);
    border: 1px solid #ccc;
    outline: none;
    transition: var(--transition);
  }

  input:focus {
    border-color: var(--primary-color);
  }

  button {
    background: var(--primary-color);
    color: white;
    cursor: pointer;
    border: none;
  }

  button:hover {
    background: darken(var(--primary-color), 10%);
  }

  /* Card Styles */
  .card {
    background: var(--card-bg);
    padding: 20px;
    border-radius: var(--border-radius);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: var(--transition);
  }

  .card:hover {
    transform: translateY(-5px);
  }

  /* Links */
  a {
    text-decoration: none;
    color: var(--primary-color);
    transition: var(--transition);
  }

  a:hover {
    color: darken(var(--primary-color), 10%);
  }
`;

export default GlobalStyle;
