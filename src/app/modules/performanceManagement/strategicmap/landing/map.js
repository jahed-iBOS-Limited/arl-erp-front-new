import React, { useEffect, useState } from "react";
import ReactFlow, {
  removeElements,
  addEdge,
  Controls,
} from "react-flow-renderer";
import { Header } from "./header";

// Initial Data or Nodes
const position = { x: 0, y: 0 };

const initialElements = [
  // {
  //   id: 1,
  //   data: { label: "Node 1" },
  //   position,
  // },
  // {
  //   id: 2,
  //   data: { label: "Node 2" },
  //   position,
  // },
  // {
  //   id: 3,
  //   data: { label: "Node 3" },
  //   position,
  // },
];

const Map = () => {
  const [goalDDL, setGoalDDL] = useState([
    { value: 1, label: "goal 1" },
    { value: 2, label: "goal 2" },
    { value: 3, label: "goal 3" },
    { value: 4, label: "goal 4" },
  ]);

  const [elements, setElements] = useState(
    localStorage.getItem("data")
      ? JSON.parse(localStorage.getItem("data"))
      : initialElements
  );

  const onElementsRemove = (elementsToRemove) => {
    const data = elements.find((item) => item.id === elementsToRemove[0].id);
    console.log(data);

    setElements((els) => removeElements(elementsToRemove, els));
    if(data) setGoalDDL([ { value: data?.id, label: data?.data?.label }, ...goalDDL]);
  };

  const onConnect = (params) => setElements((els) => addEdge(params, els));

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(elements));
  }, [elements]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("data"));
    const copyGoal = [...goalDDL];
    let activeItem = [];

    copyGoal.forEach((item) => {
      const index = data.findIndex(
        (singleData) => singleData?.data?.label === item.label
      );

      console.log(index);
      if (index === -1) {
        activeItem.push(item);
      }
    });
    console.log(activeItem);
    setGoalDDL(activeItem);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements]);

  console.log(elements);

  return (
    <>
      <Header
        goalDDL={goalDDL}
        setGoalDDL={setGoalDDL}
        onSelect={(value) => {
          setElements([
            ...elements,
            {
              id: `${new Date().getTime()}`,
              data: { label: value.label },
              position,
            },
          ]);
        }}
      />

      <div className="flow ibos_flow">
        <div className="body-flow floating_line_wrapper">
          <div className="line" style={{ top: "25%" }}></div>
          <div className="line" style={{ top: "50%" }}></div>
          <div className="line" style={{ top: "75%" }}></div>
          {/* floating Line */}
          {/* <div className="position floating_line">
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
        </div> */}
          <ReactFlow
            elements={elements}
            onElementsRemove={onElementsRemove}
            onConnect={onConnect}
            onLoad={(instance) => setTimeout(() => instance.fitView(), 0)}
            onNodeDragStop={(e, node) => {
              console.log(node);
              let cloneState = [...elements];
              let newPos = cloneState.map((item) => {
                if (item?.id === node?.id) {
                  console.log("founded");
                  return {
                    ...item,
                    position: node?.position,
                  };
                } else {
                  return item;
                }
              });

              setElements(newPos);
            }}
            deleteKeyCode={46} /* 'delete'-key */
          >
            <Controls />
          </ReactFlow>

          <button
            onClick={(e) => {
              setElements([
                ...elements,
                {
                  id: `${new Date().getTime()}`,
                  data: { label: "Node new" },
                  position,
                },
              ]);
            }}
          >
            add new{" "}
          </button>
        </div>
      </div>
    </>
  );
};

export default Map;
