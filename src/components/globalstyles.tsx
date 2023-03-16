import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  body {
    background-color: #000000;
    background-image: url(black.jpg);
    background-size: cover;
    color: #FFFFFF;
    padding: 0;
    margin: 0;
    font-family: Bebas Neue;
    letter-spacing: 4px;
    transition: background-image 0.5s;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }
`
