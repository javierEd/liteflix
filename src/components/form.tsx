import styled from "styled-components";

const Form = styled.form`
  text-align: center;

  input {
    font-family: 'Bebas Neue';
    font-style: normal;
    font-weight: 400;
    letter-spacing: 4px;
  }

  > * {
    display: block;
    margin: 0 auto 36px;

    > input[type=text], > input[type=text]:hover {
      background: none;
      border: none;
      border-bottom: 1px solid #FFFFFF;
      color: #FFFFFF;
      font-size: 16px;
      line-height: 19px;
      text-align: center;
      padding: 8px;
      text-align: center;
      width: 248px;
    }
  }

  > input[type=submit] {
    background-color: #fffff;
    border: none;
    color: #242424;
    cursor: pointer;
    height: 56px;
    width: 248px;
    font-size: 18px;
    line-height: 22px;
    margin: 0 auto;
    transition: background-color 0.3s;

    &.disabled {
      background-color: #919191;
      cursor: not-allowed;
    }
  }
`;

export default Form;
