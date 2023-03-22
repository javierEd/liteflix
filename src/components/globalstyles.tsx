import { createGlobalStyle } from 'styled-components'

export const classNameVisible = (isVisible: boolean) => {
  if (isVisible) {
    return 'visible';
  }

  return 'hidden';
};

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
    transition: background-image 0.3s;

    > #__next {
      background-color: rgba(0, 0, 0, 0.35);
      padding: 32px 100px;
    }
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }

  .hidden {
    opacity: 0;
    transition: visibility 0s 0.3s, opacity 0.3s;
    visibility: hidden;
  }

  .visible {
    opacity: 1;
    transition: visibility 0s, opacity 0.3s;
    visibility: visible;
  }
`
