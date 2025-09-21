import React, { useState } from "react";
import styled from "styled-components";
import Button from "../Button/Button";

interface AddTodoProps {

}

/**
 *
 */
const AddTodo = ({onClick}: AddTodoProps): JSX.Element => {
   const[toDo,setToDo] = useState()
  return (
    <>
      <input className="inputToDo"></input>
      <Button onClick={onClick}>Добавить</Button>
    </>
  );
};
// #endregion

export default AddTodo;
