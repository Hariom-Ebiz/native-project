import { useState, Fragment } from "react";
import { Draggable, Droppable } from "react-drag-and-drop";
import styles from "@/styles/assesment.module.css";

const useDnd = ({ droppableItems, droppableBoxes }) => {
  const [dropBoxes, setDropBoxes] = useState(droppableBoxes);
  const [items, setItems] = useState(droppableItems);

  const onDrop = (dropped, boxId) => {
    let itemId = dropped.any;
    let droppedItem;

    let boxToEdit = dropBoxes.find((val) => val.id === boxId);
    if (!boxToEdit) {
      return;
    }
    if (boxToEdit.max <= boxToEdit.filledItems.length) {
      return;
    }

    setItems((prev) => {
      let filtered = prev.filter((val) => {
        if (val.id === itemId) {
          droppedItem = val;
          return false;
        }
        return true;
      });
      return filtered;
    });

    setDropBoxes((prev) => {
      let updated = prev.map((val) => {
        if (val.id === boxId) {
          let updatedItems = [...val.filledItems, droppedItem];
          return { ...val, filledItems: updatedItems };
        }
        return val;
      });
      return updated;
    });
  };

  const getUi = () => (
    <>
      <div className={styles.dag_drop_block}>
        <div className={styles.list_block}>
          {/* <h2>Items list</h2> */}
          <div className={styles.inner_list_block}>
            {items.map((item) => {
              return (
                <Draggable key={item.id} type={item.type} data={item.id}>
                  <div className={styles.item_name}>{item.name}</div>
                </Draggable>
              );
            })}
          </div>
        </div>
        {dropBoxes.map((box) => {
          return (
            <Fragment key={box.id}>
              <Droppable
                className={styles.inner_item}
                types={box.typeAllowed}
                onDrop={(item) => onDrop(item, box.id)}
              >
                <h2
                  style={{
                    boxShadow: `0px 2.763197183609009px 0px 0px ${box.bgColor} inset`,
                  }}
                >
                  <span
                    className={styles.dot_shape}
                    style={{ backgroundColor: box.bgColor }}
                  ></span>
                  Heading {box.id}
                </h2>
                <div
                  style={{ backgroundColor: box.bgColor }}
                  className={styles.listing_items_inner}
                >
                  {box.filledItems.map((item) => {
                    return (
                      <div
                        className={styles.inner_list_item_name}
                        key={item.id}
                        style={{ border: `3px solid ${box.bgColor}` }}
                      >
                        {item.name}
                      </div>
                    );
                  })}
                </div>
              </Droppable>
            </Fragment>
          );
        })}
      </div>
    </>
  );

  const getDndResult = () => {
    return dropBoxes;
  };

  return {
    getUi,
    getDndResult,
  };
};

export default useDnd;
