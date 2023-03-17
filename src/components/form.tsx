import styled from "styled-components";

const Form = styled.form`
  text-align: center;

  > * {
    display: block;
    margin: 36px auto;

    > input[type=text], > input[type=text]:hover {
      background: none;
      border: none;
      border-bottom: 1px solid #FFFFFF;
      color: #FFFFFF;
      font-family: 'Bebas Neue';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
      text-align: center;
      letter-spacing: 4px;
      padding: 8px;
      text-align: center;
      width: 248px;
    }
  }

  > input[type=submit] {
    background: #919191;
    border: none;
    color: #242424;
    height: 56px;
    width: 248px;
    font-family: 'Bebas Neue';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
    letter-spacing: 4px;
  }
`;

export default Form;
