import { createGlobalStyle } from 'styled-components'

export const classNameVisible = (isVisible: boolean) => {
  if (isVisible) {
    return 'visible';
  }

  return 'hidden';
};

export const maxMobileWidth = '1023px';
export const minDesktopWidth = '1024px';

export default createGlobalStyle`
  body {
    background-color: #000000;
    background-image: url(black.jpg);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    color: #FFFFFF;
    font-family: Bebas Neue;
    letter-spacing: 4px;
    margin: 0;
    padding: 0;
    transition: background-image 0.3s;

    > #__next {
      padding: 32px 100px;
      position: relative;

      @media (max-width: ${maxMobileWidth}) {
        padding: 24px;
      }
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

  .hidden-mobile {
    @media (max-width: ${maxMobileWidth}) {
      display: none !important;
    }
  }

  .hidden-desktop {
    @media (min-width: ${minDesktopWidth}) {
      display: none !important;
    }
  }
`
