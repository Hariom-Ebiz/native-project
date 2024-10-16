import React, { useState } from "react";
import styles from "@/styles/assesment.module.css";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import 'bootstrap/dist/css/bootstrap.css';
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver, bgColour) => ({
  //   background: isDraggingOver ? "lightblue" : "lightgrey",
  background: bgColour,
  padding: grid,
});

const grid = 1;

const useDnd2 = ({ values, titles, bgColours, maxLimit }) => {
  const [columns, setColumns] = useState(values);

  function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(columns[sInd], source.index, destination.index);
      const newState = [...columns];
      newState[sInd] = items;
      setColumns(newState);
    } else {
      if (dInd > 0) {
        const existingCount = columns[dInd].length;
        if (existingCount == maxLimit[dInd]) {
          return;
        }
      }
      const result = move(columns[sInd], columns[dInd], source, destination);
      const newState = [...columns];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      // setColumns(newState.filter((group) => group.length));
      setColumns(newState);
    }
  }

  const updateColumns = (newColumns) => {
    setColumns(newColumns);
  };

  const getUI = () => {
    if (columns.length == 0) {
      return null;
    }

    // const tooltipTriggerList = document.querySelectorAll(
    //   '[data-bs-toggle="tooltip"]'
    // );
    // const tooltipList = [...tooltipTriggerList].map(
    //   (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
    // );

    return (
      <div className={styles.dag_drop_block} id="target">
        <DragDropContext onDragEnd={onDragEnd}>
          {columns.map((el, ind) => (
            <Droppable
              key={ind}
              droppableId={`${ind}`}
              isDropDisabled={maxLimit[ind] === columns[ind].length}
            >
              {(provided, snapshot) => (
                <div
                  className={`${
                    ind > 0 ? styles.inner_item : styles.list_block
                  }`}

                  // className={
                  //   ind > 0 ? styles.inner_item : `${styles.list_block} ${styles.full_height}`
                  // }
                >
                  {ind > 0 && (
                    <h2
                      style={{
                        boxShadow: `0px 2.763197183609009px 0px 0px ${bgColours[ind]} inset`,
                      }}
                    >
                      <span
                        className={styles.dot_shape}
                        style={{ backgroundColor: bgColours[ind] }}
                      ></span>
                      {titles[ind]}
                    </h2>
                  )}
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(
                      snapshot.isDraggingOver,
                      bgColours[ind]
                    )}
                    // className={`${styles.inner_list_block}`}
                    className={`${styles.inner_list_block} ${
                      ind == 0 ? styles.full_height : ""
                    }`}
                    // className={
                    //   ind == 0 ? styles.full_height : styles.inner_list_block
                    // }
                    {...provided.droppableProps}
                  >
                    {el.length > 0 &&
                      el.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              // style={getItemStyle(
                              //   snapshot.isDragging,
                              //   provided.draggableProps.style
                              // )}
                            >
                              <div
                                className={
                                  ind == 0
                                    ? styles.item_name
                                    : styles.inner_list_item_name
                                }
                                // style={{
                                //   display: "flex",
                                //   justifyContent: "space-around",
                                // }}
                                style={{
                                  border: `3px solid ${bgColours[ind]}`,
                                }}
                                // data-custom-class="custom-tooltip"
                                // data-toggle="tooltip"
                                // data-placement="top"
                                // title="Enter keywords such as skills."
                              >
                                {item.content}

                                <OverlayTrigger
                                  delay={{ hide: 450, show: 300 }}
                                  overlay={(props) => (
                                    <Tooltip {...props}>
                                      {item?.description}
                                    </Tooltip>
                                  )}
                                  placement="top"
                                >
                                  <Button className={styles.info_icon}>
                                    {" "}
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      class="bi bi-info-circle"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                    </svg>
                                  </Button>
                                </OverlayTrigger>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    );
  };

  return {
    showNextButton: columns[0]?.length == 0,
    getUI,
    columns,
    updateColumns,
  };
};

export default useDnd2;
